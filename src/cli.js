#!/usr/bin/env node

import { Command } from "commander";
import { WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import pty from "node-pty";
import { createRelayServer } from "./server.js";

const IS_WINDOWS = process.platform === "win32";

function relayUrl(baseUrl, routePath, params) {
  const parsed = new URL(baseUrl);
  parsed.protocol = parsed.protocol === "https:" ? "wss:" : "ws:";
  parsed.pathname = routePath;
  parsed.search = new URLSearchParams(params).toString();
  return parsed.toString();
}

async function registerHost({ server, hostId, username, password }) {
  const response = await fetch(`${server.replace(/\/$/, "")}/api/register-host`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ hostId, username, password })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`register-host failed (${response.status}): ${detail}`);
  }

  return response.json();
}

function warningBanner() {
  console.warn("\n⚠️  WARNING FOR HOSTS");
  console.warn("You are exposing your terminal and filesystem to someone else.");
  console.warn("They can read, edit, or delete files your user can access.");
  console.warn("Use an isolated user account / VM and never share real production credentials.\n");
}

function resolveShell(shellOverride) {
  if (shellOverride) return shellOverride;
  if (os.platform() === "win32") return "powershell.exe";
  return process.env.SHELL || "bash";
}

function sanitizeSandboxDir(cwd, sandboxDir) {
  const sandbox = path.resolve(sandboxDir || cwd || process.cwd());
  const resolvedCwd = path.resolve(cwd || sandbox);

  if (!resolvedCwd.startsWith(sandbox)) {
    throw new Error(`cwd ${resolvedCwd} escapes sandbox directory ${sandbox}`);
  }

  return { sandbox, cwd: resolvedCwd };
}

function connectHost({ server, hostId, username, password, shell, cwd, sandboxDir }) {
  const sessions = new Map();
  const ws = new WebSocket(relayUrl(server, "/ws/host", { hostId, username, password }));

  const safeSend = (payload) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  };

  const createSession = (clientId) => {
    if (sessions.has(clientId)) return sessions.get(clientId);

    const proc = pty.spawn(shell, [], {
      name: "xterm-256color",
      cols: 120,
      rows: 30,
      cwd,
      env: { ...process.env, TERM: "xterm-256color" }
    });

    proc.onData((data) => {
      safeSend({ type: "output", clientId, data });
    });

    proc.onExit(({ exitCode }) => {
      safeSend({ type: "exit", clientId, code: exitCode });
      sessions.delete(clientId);
    });

    const session = { proc };
    sessions.set(clientId, session);
    return session;
  };

  const closeSession = (clientId, reason = "session closed") => {
    const session = sessions.get(clientId);
    if (!session) return;
    session.proc.kill();
    sessions.delete(clientId);
    safeSend({ type: "exit", clientId, code: 0, reason });
  };

  ws.on("open", () => {
    console.log(`Host connected. Shell=${shell} cwd=${cwd} sandbox=${sandboxDir || cwd}`);
  });

  ws.on("message", (raw) => {
    let incoming;
    try {
      incoming = JSON.parse(String(raw));
    } catch {
      return;
    }

    if (incoming.type === "system") {
      if (incoming.message === "client disconnected" && incoming.clientId) {
        closeSession(incoming.clientId, "client disconnected");
      }
      if (incoming.message === "client connected" && incoming.clientId) {
        createSession(incoming.clientId);
      }
      console.log(`[system] ${incoming.message}${incoming.clientId ? ` (${incoming.clientId})` : ""}`);
      return;
    }

    if (!["input", "resize"].includes(incoming.type)) return;

    const clientId = String(incoming.clientId || "");
    if (!clientId) return;

    const session = createSession(clientId);

    if (incoming.type === "input") {
      session.proc.write(String(incoming.data || ""));
      return;
    }

    const cols = Math.max(20, Number(incoming.cols) || 120);
    const rows = Math.max(5, Number(incoming.rows) || 30);
    session.proc.resize(cols, rows);
  });

  ws.on("close", () => {
    for (const [clientId, session] of sessions.entries()) {
      session.proc.kill();
      sessions.delete(clientId);
    }
    console.log("Host disconnected.");
    process.exit(0);
  });

  ws.on("error", (err) => {
    console.error(`Host connection error: ${err.message}`);
    process.exit(1);
  });
}

function connectClient({ server, hostId, username, password }) {
  const ws = new WebSocket(relayUrl(server, "/ws/client", { hostId, username, password }));
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  let teardownInput = () => {};

  const sendResize = () => {
    if (ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({
      type: "resize",
      cols: process.stdout.columns || 120,
      rows: process.stdout.rows || 30
    }));
  };

  const setupInteractiveInput = () => {
    if (typeof process.stdin.setRawMode !== "function") {
      console.warn("[client] stdin is not a terminal; fallback to line mode");
      return setupLineInput();
    }

    process.stdin.setRawMode(true);
    process.stdin.resume();

    const onData = (chunk) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({ type: "input", data: chunk.toString("utf8") }));
    };

    const onResize = () => sendResize();

    process.stdin.on("data", onData);
    process.stdout.on("resize", onResize);
    sendResize();

    return () => {
      process.stdin.off("data", onData);
      process.stdout.off("resize", onResize);
      if (typeof process.stdin.setRawMode === "function") {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();
    };
  };

  const setupLineInput = () => {
    process.stdin.resume();
    const onData = (chunk) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({ type: "input", data: chunk.toString("utf8") }));
    };
    process.stdin.on("data", onData);

    return () => {
      process.stdin.off("data", onData);
      process.stdin.pause();
    };
  };

  ws.on("open", () => {
    console.log(`Connected to host ${hostId}.`);
    teardownInput = interactive ? setupInteractiveInput() : setupLineInput();
  });

  ws.on("message", (raw) => {
    let incoming;
    try {
      incoming = JSON.parse(String(raw));
    } catch {
      return;
    }

    if (incoming.type === "output") process.stdout.write(incoming.data || "");
    if (incoming.type === "exit") process.stdout.write(`\n[exit ${incoming.code}]\n`);
    if (incoming.type === "system") process.stdout.write(`\n[system] ${incoming.message}\n`);
    if (incoming.type === "error") process.stderr.write(`\n[error] ${incoming.message}\n`);
  });

  process.on("SIGINT", () => {
    if (interactive) return;
    ws.close();
  });

  ws.on("close", () => {
    teardownInput();
    console.log("Disconnected from relay server.");
    process.exit(0);
  });

  ws.on("error", (err) => {
    teardownInput();
    console.error(`Connection error: ${err.message}`);
    process.exit(1);
  });
}

const program = new Command();
program.name("terminal-tool").description("Expose and connect to remote terminals through a relay API");

program
  .command("server")
  .description("Start relay API + websocket server")
  .option("--port <port>", "Port to listen on", "3000")
  .option("--host <host>", "Host bind address", "0.0.0.0")
  .action(async (options) => {
    const relay = createRelayServer({ port: Number(options.port), host: options.host, verbose: true });
    await relay.start();
    console.log(`Relay server listening on http://${options.host}:${options.port}`);
  });

program
  .command("host")
  .description("Register host credentials and expose current shell")
  .requiredOption("--server <url>", "Relay server URL")
  .requiredOption("--username <username>", "Username for host authentication")
  .requiredOption("--password <password>", "Password for host authentication")
  .option("--host-id <id>", "Stable host ID (if omitted one is generated)")
  .option("--shell <path>", "Shell executable override (auto-detected by default)")
  .option("--cwd <path>", "Working directory to expose", process.cwd())
  .option("--sandbox-dir <path>", "Restrict host cwd to this directory")
  .option("--dangerously-allow-root", "Allow running as root user (not recommended)", false)
  .action(async (options) => {
    if (typeof process.getuid === "function" && process.getuid() === 0 && !options.dangerouslyAllowRoot) {
      throw new Error("Refusing to run host as root. Re-run with --dangerously-allow-root if you understand the risk.");
    }

    warningBanner();

    const { cwd, sandbox } = sanitizeSandboxDir(options.cwd, options.sandboxDir);
    const shell = resolveShell(options.shell);

    const registration = await registerHost({
      server: options.server,
      hostId: options.hostId,
      username: options.username,
      password: options.password
    });

    console.log(`hostId: ${registration.hostId}`);
    console.warn(`[host] security notice: this exposes shell access within sandbox ${sandbox}`);

    connectHost({
      server: options.server,
      hostId: registration.hostId,
      username: options.username,
      password: options.password,
      shell,
      cwd,
      sandboxDir: sandbox
    });
  });

program
  .command("client")
  .description("Connect as remote user and open a real terminal stream")
  .requiredOption("--server <url>", "Relay server URL")
  .requiredOption("--host-id <id>", "hostId shared by host")
  .requiredOption("--username <username>", "Username from host")
  .requiredOption("--password <password>", "Password from host")
  .action((options) => {
    connectClient(options);
  });

program.parseAsync(process.argv).catch((err) => {
  console.error(err.message);
  process.exit(1);
});

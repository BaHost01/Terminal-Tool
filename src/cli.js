#!/usr/bin/env node

import { Command } from "commander";
import { WebSocket } from "ws";
import { spawn } from "node:child_process";
import readline from "node:readline";
import { randomUUID } from "node:crypto";
import { createRelayServer } from "./server.js";

function relayUrl(baseUrl, path, params) {
  const parsed = new URL(baseUrl);
  parsed.protocol = parsed.protocol === "https:" ? "wss:" : "ws:";
  parsed.pathname = path;
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

function attachHostShell(ws, shell, cwd) {
  const runningCommands = new Map();

  ws.on("message", (raw) => {
    let incoming;
    try {
      incoming = JSON.parse(String(raw));
    } catch {
      return;
    }

    if (incoming.type === "system") {
      console.log(`[system] ${incoming.message}`);
      return;
    }

    if (incoming.type === "cancel") {
      const active = runningCommands.get(incoming.requestId);
      if (active) {
        active.kill("SIGTERM");
        runningCommands.delete(incoming.requestId);
      }
      return;
    }

    if (incoming.type !== "command") {
      return;
    }

    const command = String(incoming.command || "").trim();
    if (!command) {
      ws.send(JSON.stringify({ type: "stderr", requestId: incoming.requestId, data: "Empty command\n" }));
      return;
    }

    const child = spawn(shell, ["-lc", command], { cwd, env: process.env });
    runningCommands.set(incoming.requestId, child);

    child.stdout.on("data", (chunk) => {
      ws.send(JSON.stringify({ type: "stdout", requestId: incoming.requestId, data: chunk.toString() }));
    });

    child.stderr.on("data", (chunk) => {
      ws.send(JSON.stringify({ type: "stderr", requestId: incoming.requestId, data: chunk.toString() }));
    });

    child.on("close", (code) => {
      runningCommands.delete(incoming.requestId);
      ws.send(JSON.stringify({ type: "exit", requestId: incoming.requestId, code }));
    });

    child.on("error", (err) => {
      runningCommands.delete(incoming.requestId);
      ws.send(JSON.stringify({ type: "stderr", requestId: incoming.requestId, data: `${err.message}\n` }));
      ws.send(JSON.stringify({ type: "exit", requestId: incoming.requestId, code: 1 }));
    });
  });

  ws.on("close", () => {
    for (const child of runningCommands.values()) {
      child.kill("SIGTERM");
    }
    runningCommands.clear();
  });
}

function connectClient({ server, hostId, username, password }) {
  let lastRequestId = null;
  const ws = new WebSocket(relayUrl(server, "/ws/client", { hostId, username, password }));

  ws.on("open", () => {
    console.log(`Connected to host ${hostId}. Type commands below.`);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });

    rl.on("line", (line) => {
      const requestId = randomUUID();
      lastRequestId = requestId;
      ws.send(JSON.stringify({ type: "command", command: line, requestId }));
    });

    rl.on("SIGINT", () => {
      if (lastRequestId) {
        ws.send(JSON.stringify({ type: "cancel", requestId: lastRequestId }));
        process.stdout.write("\n[system] cancellation signal sent\n");
        return;
      }

      rl.close();
      ws.close();
    });
  });

  ws.on("message", (raw) => {
    let incoming;
    try {
      incoming = JSON.parse(String(raw));
    } catch {
      return;
    }

    if (incoming.type === "stdout") process.stdout.write(incoming.data || "");
    if (incoming.type === "stderr") process.stderr.write(incoming.data || "");
    if (incoming.type === "exit") {
      if (incoming.requestId === lastRequestId) {
        lastRequestId = null;
      }
      process.stdout.write(`\n[exit ${incoming.code}]\n`);
    }
    if (incoming.type === "system") process.stdout.write(`\n[system] ${incoming.message}\n`);
    if (incoming.type === "error") process.stderr.write(`\n[error] ${incoming.message}\n`);
  });

  ws.on("close", () => {
    console.log("Disconnected from relay server.");
    process.exit(0);
  });

  ws.on("error", (err) => {
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
  .option("--shell <path>", "Shell executable", process.env.SHELL || "bash")
  .option("--cwd <path>", "Working directory to expose", process.cwd())
  .option("--dangerously-allow-root", "Allow running as root user (not recommended)", false)
  .action(async (options) => {
    if (typeof process.getuid === "function" && process.getuid() === 0 && !options.dangerouslyAllowRoot) {
      throw new Error("Refusing to run host as root. Re-run with --dangerously-allow-root if you understand the risk.");
    }

    warningBanner();

    const registration = await registerHost({
      server: options.server,
      hostId: options.hostId,
      username: options.username,
      password: options.password
    });

    console.log(`hostId: ${registration.hostId}`);

    const ws = new WebSocket(
      relayUrl(options.server, "/ws/host", {
        hostId: registration.hostId,
        username: options.username,
        password: options.password
      })
    );

    ws.on("open", () => {
      console.log(`Host connected. Exposing ${options.cwd}`);
      attachHostShell(ws, options.shell, options.cwd);
    });

    ws.on("error", (err) => {
      console.error(`Host connection error: ${err.message}`);
      process.exit(1);
    });

    ws.on("close", () => {
      console.log("Host disconnected.");
      process.exit(0);
    });
  });

program
  .command("client")
  .description("Connect as remote player/user and send commands")
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

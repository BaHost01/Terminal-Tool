#!/usr/bin/env node

import { Command } from "commander";
import { WebSocket } from "ws";
import { spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createRelayServer } from "./server.js";

const PLATFORM = process.platform;
const IS_WINDOWS = PLATFORM === "win32";
const DANGEROUS_PATTERN = /(;|&&|\|\||`|\$\(|\n|\r)/;

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

function commandBase(command) {
  const match = String(command || "").trim().match(/^([A-Za-z0-9._-]+)/);
  return match ? match[1].toLowerCase() : "";
}

function isShellAvailable(shellName) {
  const checker = IS_WINDOWS ? "where" : "which";
  const result = spawnSync(checker, [shellName], { stdio: "ignore" });
  return result.status === 0;
}

function shellSpec(shellName) {
  const lower = shellName.toLowerCase();
  const windowsStyle = IS_WINDOWS || lower.includes("powershell") || lower === "pwsh" || lower === "cmd" || lower.endsWith("cmd.exe");

  if (windowsStyle) {
    if (lower === "cmd" || lower.endsWith("cmd.exe")) {
      return {
        shell: shellName,
        buildArgs: (command) => ["/d", "/s", "/c", command],
        interactiveArgs: []
      };
    }

    return {
      shell: shellName,
      buildArgs: (command) => ["-Command", command],
      interactiveArgs: ["-NoLogo"]
    };
  }

  return {
    shell: shellName,
    buildArgs: (command) => ["-lc", command],
    interactiveArgs: ["-l"]
  };
}

function resolveShellPlan(shellOverride) {
  const candidates = [];
  if (shellOverride) {
    candidates.push(shellOverride);
    if (IS_WINDOWS && !/cmd(\.exe)?$/i.test(shellOverride)) candidates.push("cmd.exe", "cmd");
    if (!IS_WINDOWS && shellOverride !== "bash") candidates.push("bash", "sh");
  } else if (IS_WINDOWS) {
    candidates.push("powershell.exe", "pwsh", "cmd.exe", "cmd");
  } else {
    candidates.push("bash", "sh");
  }

  const unique = [...new Set(candidates)];
  const available = unique.filter((candidate) => candidate.includes("/") || candidate.includes("\\") || isShellAvailable(candidate));
  const finalList = available.length > 0 ? available : unique;

  return finalList.map((candidate) => shellSpec(candidate));
}

function buildHostPolicy(options) {
  const whitelist = new Set(
    String(options.whitelist || "")
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean)
  );

  return {
    cwd: options.cwd,
    strictCwd: Boolean(options.strictCwd),
    whitelist,
    warnDangerous: true
  };
}

function evaluateCommand(command, policy) {
  const trimmed = String(command || "").trim();

  if (!trimmed) {
    return { ok: false, reason: "Empty command" };
  }

  if (trimmed.includes("\0")) {
    return { ok: false, reason: "Command contains null bytes" };
  }

  if (policy.strictCwd && /(^|\s)cd\s+\.\./.test(trimmed)) {
    return { ok: false, reason: "strict-cwd blocks directory traversal with 'cd ..'" };
  }

  if (policy.strictCwd && /(^|\s)(cd|cat|less|more|type)\s+([A-Za-z]:\\|\/)/i.test(trimmed)) {
    return { ok: false, reason: "strict-cwd blocks absolute-path access attempts" };
  }

  const base = commandBase(trimmed);
  if (policy.whitelist.size > 0 && !policy.whitelist.has(base)) {
    return { ok: false, reason: `Command '${base || "<unknown>"}' is not in whitelist` };
  }

  if (policy.warnDangerous && DANGEROUS_PATTERN.test(trimmed)) {
    return { ok: true, warning: "Command contains chaining/substitution operators. Review carefully." };
  }

  return { ok: true };
}

function killProcess(child, reason = "cleanup") {
  if (!child || child.killed) return;

  child.kill("SIGTERM");
  setTimeout(() => {
    if (!child.killed) {
      child.kill("SIGKILL");
    }
  }, 3000).unref();

  console.log(`[host] sent termination signal (${reason}) to pid=${child.pid}`);
}

async function loadPty() {
  try {
    const mod = await import("node-pty");
    return mod.default ?? mod;
  } catch (error) {
    console.warn(`[host] PTY unavailable (${error.message}); using non-interactive spawn fallback`);
    return null;
  }
}

function trySpawn(shellPlan, command, cwd) {
  const attempted = [];
  for (const spec of shellPlan) {
    attempted.push(spec.shell);
    const args = spec.buildArgs(command);
    try {
      const child = spawn(spec.shell, args, {
        cwd,
        env: { ...process.env },
        stdio: ["pipe", "pipe", "pipe"]
      });
      return { child, spec, attempted };
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }

  throw new Error(`No usable shell found. Attempted: ${attempted.join(", ")}`);
}

function attachHostShell(ws, shellPlan, policy) {
  const runningCommands = new Map();
  const isTTY = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  console.log(`[host] tty-detect stdin=${Boolean(process.stdin.isTTY)} stdout=${Boolean(process.stdout.isTTY)} mode=${isTTY ? "interactive" : "non-interactive"}`);

  const safeSend = (payload) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  };

  const terminateAll = (reason) => {
    for (const [requestId, active] of runningCommands.entries()) {
      killProcess(active.child, reason);
      runningCommands.delete(requestId);
    }
  };

  const ptySession = {
    proc: null,
    shell: null,
    usingPty: false
  };

  const startPty = async () => {
    if (!isTTY || ptySession.proc) return;

    const pty = await loadPty();
    if (!pty) return;

    for (const spec of shellPlan) {
      try {
        const proc = pty.spawn(spec.shell, spec.interactiveArgs, {
          name: "xterm-256color",
          cwd: policy.cwd,
          env: { ...process.env, TERM: process.env.TERM || "xterm-256color" },
          cols: process.stdout.columns || 120,
          rows: process.stdout.rows || 30,
          encoding: "utf8"
        });

        ptySession.proc = proc;
        ptySession.shell = spec.shell;
        ptySession.usingPty = true;

        proc.onData((data) => {
          safeSend({ type: "output", data });
        });

        proc.onExit(({ exitCode, signal }) => {
          safeSend({ type: "system", message: `interactive shell exited (${exitCode}${signal ? `, ${signal}` : ""})` });
          ptySession.proc = null;
          ptySession.usingPty = false;
        });

        console.log(`[host] execution-mode=pty shell=${spec.shell}`);
        return;
      } catch (error) {
        console.error(`[host] PTY spawn failed for shell=${spec.shell}: ${error.message}`);
      }
    }

    console.warn("[host] PTY initialization failed for all shell candidates; falling back to spawn mode");
  };

  const executeCommand = (requestId, command) => {
    const evaluation = evaluateCommand(command, policy);

    if (!evaluation.ok) {
      safeSend({ type: "stderr", requestId, data: `[policy] ${evaluation.reason}\n` });
      safeSend({ type: "exit", requestId, code: 126 });
      return;
    }

    if (evaluation.warning) {
      console.warn(`[host][warning] ${evaluation.warning} command="${command}"`);
      safeSend({ type: "system", message: `[warning] ${evaluation.warning}` });
    }

    console.log(`[host] exec requestId=${requestId} cwd=${policy.cwd} command="${command}"`);

    let spawned;
    try {
      spawned = trySpawn(shellPlan, command, policy.cwd);
    } catch (error) {
      safeSend({ type: "stderr", requestId, data: `${error.message}\n` });
      safeSend({ type: "exit", requestId, code: 1 });
      console.error(`[host] failed to start command requestId=${requestId}: ${error.message}`);
      return;
    }

    const { child, spec } = spawned;
    runningCommands.set(requestId, { child, startedAt: Date.now() });
    console.log(`[host] execution-mode=spawn shell=${spec.shell}`);

    child.stdout.on("data", (chunk) => {
      safeSend({ type: "stdout", requestId, data: chunk.toString("utf8") });
    });

    child.stderr.on("data", (chunk) => {
      safeSend({ type: "stderr", requestId, data: chunk.toString("utf8") });
    });

    child.on("close", (code) => {
      runningCommands.delete(requestId);
      safeSend({ type: "exit", requestId, code });
      console.log(`[host] command finished requestId=${requestId} code=${code} shell=${spec.shell}`);
    });

    child.on("error", (err) => {
      runningCommands.delete(requestId);
      const msg = err?.code === "ENOENT"
        ? `Shell executable not found: ${spec.shell}`
        : `Process error: ${err.message}`;
      safeSend({ type: "stderr", requestId, data: `${msg}\n` });
      safeSend({ type: "exit", requestId, code: 1 });
      console.error(`[host] process error requestId=${requestId}: ${msg}`);
    });
  };

  startPty();

  ws.on("message", (raw) => {
    let incoming;
    try {
      incoming = JSON.parse(String(raw));
    } catch {
      console.warn("[host] ignoring non-JSON websocket message");
      return;
    }

    if (incoming.type === "system") {
      console.log(`[system] ${incoming.message}`);
      return;
    }

    if (incoming.type === "cancel") {
      const requestId = String(incoming.requestId || "");
      if (requestId) {
        const active = runningCommands.get(requestId);
        if (active) {
          killProcess(active.child, "client-cancel");
          runningCommands.delete(requestId);
          console.log(`[host] command cancelled requestId=${requestId}`);
          return;
        }
      }

      if (ptySession.proc) {
        ptySession.proc.write("\u0003");
      }
      return;
    }

    if (incoming.type === "input") {
      if (ptySession.proc) {
        ptySession.proc.write(String(incoming.data || ""));
      } else {
        safeSend({ type: "system", message: "interactive input unavailable in spawn mode" });
      }
      return;
    }

    if (incoming.type === "resize") {
      if (ptySession.proc) {
        const cols = Number(incoming.cols) || 120;
        const rows = Number(incoming.rows) || 30;
        ptySession.proc.resize(cols, rows);
      }
      return;
    }

    if (incoming.type !== "command") {
      return;
    }

    const requestId = incoming.requestId || randomUUID();
    const command = String(incoming.command || "");
    executeCommand(requestId, command);
  });

  ws.on("close", () => {
    console.log("[host] websocket closed, cleaning up running commands");
    terminateAll("ws-close");
    if (ptySession.proc) {
      ptySession.proc.kill();
      ptySession.proc = null;
    }
  });

  ws.on("error", (err) => {
    console.error(`[host] websocket error: ${err.message}`);
    terminateAll("ws-error");
    if (ptySession.proc) {
      ptySession.proc.kill();
      ptySession.proc = null;
    }
  });
}

function connectClient({ server, hostId, username, password }) {
  let lastRequestId = null;
  const ws = new WebSocket(relayUrl(server, "/ws/client", { hostId, username, password }));
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);

  const handleInteractiveStdin = () => {
    const onData = (chunk) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({ type: "input", data: chunk.toString("utf8") }));
    };

    const onResize = () => {
      if (ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({
        type: "resize",
        cols: process.stdout.columns || 120,
        rows: process.stdout.rows || 30
      }));
    };

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", onData);
    process.stdout.on("resize", onResize);
    onResize();

    return () => {
      process.stdin.off("data", onData);
      process.stdout.off("resize", onResize);
      if (typeof process.stdin.setRawMode === "function") {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();
    };
  };

  const handleNonInteractiveStdin = () => {
    let buffered = "";

    const onData = (chunk) => {
      buffered += chunk.toString("utf8");
      const lines = buffered.split(/\r?\n/);
      buffered = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) continue;
        const requestId = randomUUID();
        lastRequestId = requestId;
        ws.send(JSON.stringify({ type: "command", command: line, requestId }));
      }
    };

    const onEnd = () => {
      if (buffered.trim()) {
        const requestId = randomUUID();
        lastRequestId = requestId;
        ws.send(JSON.stringify({ type: "command", command: buffered.trim(), requestId }));
      }
    };

    process.stdin.on("data", onData);
    process.stdin.on("end", onEnd);
    process.stdin.resume();

    return () => {
      process.stdin.off("data", onData);
      process.stdin.off("end", onEnd);
      process.stdin.pause();
    };
  };

  let teardownInput = () => {};

  ws.on("open", () => {
    console.log(`Connected to host ${hostId}.`);
    if (interactive) {
      console.log("[client] tty detected; using stream input mode");
      teardownInput = handleInteractiveStdin();
    } else {
      console.log("[client] no tty detected; using line command mode");
      teardownInput = handleNonInteractiveStdin();
    }
  });

  ws.on("message", (raw) => {
    let incoming;
    try {
      incoming = JSON.parse(String(raw));
    } catch {
      return;
    }

    if (incoming.type === "output") process.stdout.write(incoming.data || "");
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

  process.on("SIGINT", () => {
    if (interactive) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "input", data: "\u0003" }));
      }
      return;
    }

    if (lastRequestId && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "cancel", requestId: lastRequestId }));
      process.stdout.write("\n[system] cancellation signal sent\n");
      return;
    }

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
  .option("--strict-cwd", "Block obvious absolute path and traversal patterns", false)
  .option("--whitelist <commands>", "Comma-separated allowed command prefixes (e.g. ls,pwd,cat)")
  .option("--dangerously-allow-root", "Allow running as root user (not recommended)", false)
  .action(async (options) => {
    if (typeof process.getuid === "function" && process.getuid() === 0 && !options.dangerouslyAllowRoot) {
      throw new Error("Refusing to run host as root. Re-run with --dangerously-allow-root if you understand the risk.");
    }

    warningBanner();

    const shellPlan = resolveShellPlan(options.shell);
    console.log(`[host] shell candidates: ${shellPlan.map((item) => item.shell).join(", ")}`);

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
      const policy = buildHostPolicy(options);
      console.log(`Host connected. Exposing ${options.cwd}`);
      if (policy.whitelist.size > 0) {
        console.log(`[host] whitelist enabled: ${[...policy.whitelist].join(", ")}`);
      }
      attachHostShell(ws, shellPlan, policy);
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

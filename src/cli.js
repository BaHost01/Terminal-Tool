#!/usr/bin/env node

import { Command } from "commander";
import { WebSocket } from "ws";
import { spawn, spawnSync } from "node:child_process";
import readline from "node:readline";
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
        terminateSignal: "SIGTERM"
      };
    }

    return {
      shell: shellName,
      buildArgs: (command) => ["-Command", command],
      terminateSignal: "SIGTERM"
    };
  }

  return {
    shell: shellName,
    buildArgs: (command) => ["-lc", command],
    terminateSignal: "SIGTERM"
  };
}

function resolveShellPlan(shellOverride) {
  const candidates = [];
  if (shellOverride) {
    candidates.push(shellOverride);
    if (IS_WINDOWS && !/cmd(\.exe)?$/i.test(shellOverride)) candidates.push("cmd");
    if (!IS_WINDOWS && shellOverride !== "bash") candidates.push("bash", "sh");
  } else if (IS_WINDOWS) {
    candidates.push("powershell", "cmd");
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

function trySpawn(shellPlan, command, cwd) {
  const attempted = [];
  for (const spec of shellPlan) {
    attempted.push(spec.shell);
    const args = spec.buildArgs(command);
    try {
      const child = spawn(spec.shell, args, {
        cwd,
        env: { ...process.env },
        stdio: ["ignore", "pipe", "pipe"]
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
      const active = runningCommands.get(incoming.requestId);
      if (active) {
        killProcess(active.child, "client-cancel");
        runningCommands.delete(incoming.requestId);
        console.log(`[host] command cancelled requestId=${incoming.requestId}`);
      }
      return;
    }

    if (incoming.type !== "command") {
      return;
    }

    const requestId = incoming.requestId;
    const command = String(incoming.command || "");
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

    child.stdout.on("data", (chunk) => {
      safeSend({ type: "stdout", requestId, data: chunk.toString() });
    });

    child.stderr.on("data", (chunk) => {
      safeSend({ type: "stderr", requestId, data: chunk.toString() });
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
  });

  ws.on("close", () => {
    console.log("[host] websocket closed, cleaning up running commands");
    terminateAll("ws-close");
  });

  ws.on("error", (err) => {
    console.error(`[host] websocket error: ${err.message}`);
    terminateAll("ws-error");
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

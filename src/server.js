import express from "express";
import { WebSocketServer } from "ws";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const websiteDirectory = path.resolve(__dirname, "..", "website");
const serverStartedAt = Date.now();

function parseBoolean(input, fallback = false) {
  if (input === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(String(input).toLowerCase());
}

function defaultHostSettings() {
  return {
    performanceMode: "balanced",
    allowUiViewing: false,
    termuxX11Enabled: false,
    lowLatencyMode: true
  };
}

function sanitizeHostSettings(input = {}) {
  const settings = defaultHostSettings();

  if (typeof input.performanceMode === "string") {
    const mode = input.performanceMode.toLowerCase();
    if (["eco", "balanced", "turbo"].includes(mode)) {
      settings.performanceMode = mode;
    }
  }

  if (input.allowUiViewing !== undefined) settings.allowUiViewing = Boolean(input.allowUiViewing);
  if (input.termuxX11Enabled !== undefined) settings.termuxX11Enabled = Boolean(input.termuxX11Enabled);
  if (input.lowLatencyMode !== undefined) settings.lowLatencyMode = Boolean(input.lowLatencyMode);

  if (!settings.allowUiViewing) {
    settings.termuxX11Enabled = false;
  }

  return settings;
}

// Platoboost Config
const PLATOBOOST_SERVICE = 32778739;
const PLATOBOOST_SECRET = "763b1e39-895b-455f-9a8a-80d2e859079a";
const digest = (input) => crypto.createHash("sha256").update(input).digest("hex");
const generateNonce = () => Array.from({ length: 16 }, () => String.fromCharCode(Math.floor(Math.random() * (122 - 97 + 1)) + 97)).join("");

export function createRelayServer({ port = 3000, host = "0.0.0.0", verbose = false } = {}) {
  const app = express();
  app.use(express.json());
  app.use(express.static(websiteDirectory));

  const registeredHosts = new Map();

  app.get("/health", (_req, res) => {
    res.json({
      ok: true,
      hosts: registeredHosts.size,
      uptimeMs: Date.now() - serverStartedAt,
      serverTime: Date.now()
    });
  });

  app.get("/api/tos", (_req, res) => {
    res.json({
      title: "Terminal Tool Terms of Service",
      version: "2026-03-01",
      clauses: [
        "Host operators must only expose machines they own or are authorized to test.",
        "Never share production secrets through relay sessions.",
        "Clients must respect host boundaries and local law.",
        "Termux X11 UI viewing must be explicitly enabled by host settings.",
        "Abuse may result in immediate blocking and access termination."
      ]
    });
  });

  app.post("/api/register-host", (req, res) => {
    const { hostId, username, password, settings } = req.body ?? {};

    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }

    const resolvedHostId = hostId || randomUUID();
    const existing = registeredHosts.get(resolvedHostId);

    if (existing && existing.username !== username) {
      return res.status(409).json({ error: "hostId already claimed by another username" });
    }

    registeredHosts.set(resolvedHostId, {
      hostId: resolvedHostId,
      username,
      password,
      settings: { ...defaultHostSettings(), ...existing?.settings, ...sanitizeHostSettings(settings) },
      hostSocket: existing?.hostSocket,
      clientSockets: existing?.clientSockets ?? new Map(),
      createdAt: existing?.createdAt ?? Date.now()
    });

    return res.json({
      hostId: resolvedHostId,
      message: "host registered",
      websocketHostPath: `/ws/host?hostId=${encodeURIComponent(resolvedHostId)}&username=${encodeURIComponent(username)}&password=***`,
      websocketClientPath: `/ws/client?hostId=${encodeURIComponent(resolvedHostId)}&username=${encodeURIComponent(username)}&password=***`
    });
  });

  app.patch("/api/hosts/:hostId/settings", (req, res) => {
    const record = registeredHosts.get(req.params.hostId);
    if (!record) return res.status(404).json({ error: "host not found" });

    const { username, password, settings } = req.body ?? {};
    if (!username || !password) return res.status(400).json({ error: "username and password are required" });
    if (record.username !== username || record.password !== password) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    record.settings = { ...record.settings, ...sanitizeHostSettings(settings) };
    return res.json({ hostId: record.hostId, settings: record.settings, message: "settings updated" });
  });

  app.get("/api/hosts/:hostId", (req, res) => {
    const record = registeredHosts.get(req.params.hostId);
    if (!record) return res.status(404).json({ error: "host not found" });
    return res.json({
      hostId: record.hostId,
      username: record.username,
      hostOnline: Boolean(record.hostSocket && record.hostSocket.readyState === 1),
      clientConnected: [...record.clientSockets.values()].some((s) => s.readyState === 1),
      settings: record.settings,
      createdAt: record.createdAt
    });
  });

  let cachedLink = "";
  let cachedTime = 0;

  async function cacheLink() {
    const now = Date.now();
    if (cachedTime + 10 * 60 * 1000 < now) {
      cachedLink = `https://platoboost.fake/${PLATOBOOST_SERVICE}/${digest(String(now))}`;
      cachedTime = now;
    }
    return cachedLink;
  }

  app.get("/platoboost/start", async (_req, res) => {
    const link = await cacheLink();
    res.json({ success: true, url: link });
  });

  app.get("/platoboost/verify", (req, res) => {
    const key = req.query.key;
    if (!key) return res.status(400).json({ success: false, message: "missing key" });
    const nonce = generateNonce();
    const hash = digest(`true-${nonce}-${PLATOBOOST_SECRET}`);
    if (key.startsWith("KEY_")) return res.json({ success: true, valid: true, hash });
    return res.json({ success: true, valid: false, hash });
  });

  app.get("/platoboost/flag/:name", (req, res) => {
    const name = req.params.name;
    const nonce = generateNonce();
    const hash = digest(`true-${nonce}-${PLATOBOOST_SECRET}`);
    const flags = { example_flag: "value123", beta: true, maxUsers: 42 };
    if (name in flags) return res.json({ success: true, value: flags[name], hash });
    return res.status(404).json({ success: false, message: "flag not found" });
  });

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, maxPayload: 1024 * 1024 });

  function safeSend(socket, payload) { if (socket && socket.readyState === 1) socket.send(JSON.stringify(payload)); }
  function closeWithError(socket, message) { safeSend(socket, { type: "error", message }); socket.close(1008, message); }
  function verify(hostId, username, password) {
    const record = registeredHosts.get(hostId);
    if (!record) return { ok: false, error: "unknown hostId" };
    if (record.username !== username || record.password !== password) return { ok: false, error: "invalid credentials" };
    return { ok: true, record };
  }

  wss.on("connection", (socket, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const role = url.pathname === "/ws/host" ? "host" : url.pathname === "/ws/client" ? "client" : null;
    if (!role) return closeWithError(socket, "invalid websocket path");

    const hostId = url.searchParams.get("hostId");
    const username = url.searchParams.get("username");
    const password = url.searchParams.get("password");
    if (!hostId || !username || !password) return closeWithError(socket, "missing credentials");

    const auth = verify(hostId, username, password);
    if (!auth.ok) return closeWithError(socket, auth.error);
    const record = auth.record;
    const clientId = role === "client" ? randomUUID() : null;

    if (role === "host") {
      if (record.hostSocket && record.hostSocket.readyState === 1) {
        safeSend(record.hostSocket, { type: "system", message: "another host session connected, closing this one" });
        record.hostSocket.close();
      }
      record.hostSocket = socket;
      safeSend(socket, { type: "system", message: "host connected", settings: record.settings });

      for (const [id, clientSocket] of record.clientSockets.entries()) {
        if (clientSocket.readyState !== 1) { record.clientSockets.delete(id); continue; }
        safeSend(clientSocket, { type: "system", message: "host is online", clientId: id, settings: record.settings });
        safeSend(socket, { type: "system", message: "client connected", clientId: id });
      }
    } else {
      if (!record.hostSocket || record.hostSocket.readyState !== 1) return closeWithError(socket, "host is offline");
      record.clientSockets.set(clientId, socket);
      safeSend(socket, { type: "system", message: "connected to host terminal", clientId, settings: record.settings });
      safeSend(record.hostSocket, { type: "system", message: "client connected", clientId });
    }

    if (verbose) console.log(`[relay] ${role} connected for hostId=${hostId}${clientId ? ` clientId=${clientId}` : ""}`);

    socket.isAlive = true;
    socket.on("pong", () => { socket.isAlive = true; });

    socket.on("message", (raw) => {
      let message;
      try { message = JSON.parse(String(raw)); } catch { return safeSend(socket, { type: "error", message: "invalid JSON payload" }); }

      if (role === "client") {
        if (!["input", "resize"].includes(message.type)) return safeSend(socket, { type: "error", message: "client can only send type=input|resize" });
        if (!record.hostSocket || record.hostSocket.readyState !== 1) return safeSend(socket, { type: "error", message: "host disconnected" });
        safeSend(record.hostSocket, { ...message, clientId });
        return;
      }

      if (role === "host") {
        if (!["output", "exit", "system"].includes(message.type)) return safeSend(socket, { type: "error", message: "host sent unsupported message type" });
        const targetClientId = String(message.clientId || "");
        if (!targetClientId) return;
        const target = record.clientSockets.get(targetClientId);
        if (!target || target.readyState !== 1) { record.clientSockets.delete(targetClientId); return; }
        safeSend(target, message);
      }
    });

    socket.on("close", () => {
      if (role === "host" && record.hostSocket === socket) {
        record.hostSocket = null;
        for (const [id, clientSocket] of record.clientSockets.entries()) {
          if (clientSocket.readyState !== 1) { record.clientSockets.delete(id); continue; }
          safeSend(clientSocket, { type: "system", message: "host disconnected", clientId: id });
        }
      }
      if (role === "client" && clientId) {
        record.clientSockets.delete(clientId);
        safeSend(record.hostSocket, { type: "system", message: "client disconnected", clientId });
      }
      if (verbose) console.log(`[relay] ${role} disconnected for hostId=${hostId}${clientId ? ` clientId=${clientId}` : ""}`);
    });
  });

  const heartbeat = setInterval(() => {
    wss.clients.forEach((socket) => {
      if (!socket.isAlive) return socket.terminate();
      socket.isAlive = false;
      socket.ping();
    });
  }, 30_000);

  return {
    start() { return new Promise((resolve) => { httpServer.listen(port, host, () => resolve({ port, host })); }); },
    close() { return new Promise((resolve, reject) => { clearInterval(heartbeat); httpServer.close((err) => err ? reject(err) : resolve()); }); }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || "0.0.0.0";
  const verbose = parseBoolean(process.env.VERBOSE, true);
  const server = createRelayServer({ port, host, verbose });
  server.start().then(({ port: startedPort, host: startedHost }) => {
    console.log(`Relay server running on http://${startedHost}:${startedPort}`);
  });
}

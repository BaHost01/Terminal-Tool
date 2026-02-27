import express from "express";
import { WebSocketServer } from "ws";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const websiteDirectory = path.resolve(__dirname, "..", "website");

function parseBoolean(input, fallback = false) {
  if (input === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(String(input).toLowerCase());
}

export function createRelayServer({ port = 3000, host = "0.0.0.0", verbose = false } = {}) {
  const app = express();
  app.use(express.json());
  app.use(express.static(websiteDirectory));

  const registeredHosts = new Map();

  app.get("/health", (_req, res) => {
    res.json({ ok: true, hosts: registeredHosts.size });
  });

  app.post("/api/register-host", (req, res) => {
    const { hostId, username, password } = req.body ?? {};

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
      hostSocket: existing?.hostSocket,
      clientSocket: existing?.clientSocket,
      createdAt: existing?.createdAt ?? Date.now()
    });

    return res.json({
      hostId: resolvedHostId,
      message: "host registered",
      websocketHostPath: `/ws/host?hostId=${encodeURIComponent(resolvedHostId)}&username=${encodeURIComponent(username)}&password=***`,
      websocketClientPath: `/ws/client?hostId=${encodeURIComponent(resolvedHostId)}&username=${encodeURIComponent(username)}&password=***`
    });
  });

  app.get("/api/hosts/:hostId", (req, res) => {
    const record = registeredHosts.get(req.params.hostId);
    if (!record) {
      return res.status(404).json({ error: "host not found" });
    }

    return res.json({
      hostId: record.hostId,
      username: record.username,
      hostOnline: Boolean(record.hostSocket && record.hostSocket.readyState === 1),
      clientConnected: Boolean(record.clientSocket && record.clientSocket.readyState === 1)
    });
  });

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, maxPayload: 1024 * 1024 });

  function safeSend(socket, payload) {
    if (socket && socket.readyState === 1) {
      socket.send(JSON.stringify(payload));
    }
  }

  function closeWithError(socket, message) {
    safeSend(socket, { type: "error", message });
    socket.close(1008, message);
  }

  function verify(hostId, username, password) {
    const record = registeredHosts.get(hostId);
    if (!record) return { ok: false, error: "unknown hostId" };
    if (record.username !== username || record.password !== password) {
      return { ok: false, error: "invalid credentials" };
    }
    return { ok: true, record };
  }

  wss.on("connection", (socket, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const role = url.pathname === "/ws/host" ? "host" : url.pathname === "/ws/client" ? "client" : null;

    if (!role) {
      return closeWithError(socket, "invalid websocket path");
    }

    const hostId = url.searchParams.get("hostId");
    const username = url.searchParams.get("username");
    const password = url.searchParams.get("password");

    if (!hostId || !username || !password) {
      return closeWithError(socket, "missing credentials");
    }

    const auth = verify(hostId, username, password);
    if (!auth.ok) {
      return closeWithError(socket, auth.error);
    }

    const record = auth.record;

    if (role === "host") {
      if (record.hostSocket && record.hostSocket.readyState === 1) {
        safeSend(record.hostSocket, { type: "system", message: "another host session connected, closing this one" });
        record.hostSocket.close();
      }
      record.hostSocket = socket;
      safeSend(socket, { type: "system", message: "host connected" });
      safeSend(record.clientSocket, { type: "system", message: "host is online" });
    } else {
      if (!record.hostSocket || record.hostSocket.readyState !== 1) {
        return closeWithError(socket, "host is offline");
      }
      if (record.clientSocket && record.clientSocket.readyState === 1) {
        safeSend(record.clientSocket, { type: "system", message: "new client connected, closing this one" });
        record.clientSocket.close();
      }
      record.clientSocket = socket;
      safeSend(socket, { type: "system", message: "connected to host terminal" });
      safeSend(record.hostSocket, { type: "system", message: "client connected" });
    }

    if (verbose) {
      console.log(`[relay] ${role} connected for hostId=${hostId}`);
    }

    socket.isAlive = true;
    socket.on("pong", () => {
      socket.isAlive = true;
    });

    socket.on("message", (raw) => {
      let message;
      try {
        message = JSON.parse(String(raw));
      } catch {
        return safeSend(socket, { type: "error", message: "invalid JSON payload" });
      }

      if (role === "client") {
        if (!["command", "cancel"].includes(message.type)) {
          return safeSend(socket, { type: "error", message: "client can only send type=command|cancel" });
        }

        if (!record.hostSocket || record.hostSocket.readyState !== 1) {
          return safeSend(socket, { type: "error", message: "host disconnected" });
        }

        if (message.type === "command") {
          safeSend(record.hostSocket, {
            type: "command",
            command: String(message.command || ""),
            requestId: message.requestId || randomUUID(),
            sentAt: Date.now()
          });
          return;
        }

        safeSend(record.hostSocket, {
          type: "cancel",
          requestId: String(message.requestId || "")
        });
        return;
      }

      if (role === "host") {
        if (!["stdout", "stderr", "exit", "system"].includes(message.type)) {
          return safeSend(socket, { type: "error", message: "host sent unsupported message type" });
        }

        if (record.clientSocket && record.clientSocket.readyState === 1) {
          safeSend(record.clientSocket, message);
        }
      }
    });

    socket.on("close", () => {
      if (role === "host" && record.hostSocket === socket) {
        record.hostSocket = null;
        safeSend(record.clientSocket, { type: "system", message: "host disconnected" });
      }

      if (role === "client" && record.clientSocket === socket) {
        record.clientSocket = null;
        safeSend(record.hostSocket, { type: "system", message: "client disconnected" });
      }

      if (verbose) {
        console.log(`[relay] ${role} disconnected for hostId=${hostId}`);
      }
    });
  });

  const heartbeat = setInterval(() => {
    wss.clients.forEach((socket) => {
      if (!socket.isAlive) {
        socket.terminate();
        return;
      }

      socket.isAlive = false;
      socket.ping();
    });
  }, 30_000);

  return {
    start() {
      return new Promise((resolve) => {
        httpServer.listen(port, host, () => {
          resolve({ port, host });
        });
      });
    },
    close() {
      return new Promise((resolve, reject) => {
        clearInterval(heartbeat);
        httpServer.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
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

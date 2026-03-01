import express, { Request, Response } from "express";
import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const websiteDirectory = path.resolve(__dirname, "..", "website");

type Role = "host" | "client";

interface HostRecord {
  hostId: string;
  username: string;
  password: string;
  hostSocket: WebSocket | null;
  clientSocket: WebSocket | null;
  createdAt: number;
}

interface RelayOptions {
  port?: number;
  host?: string;
  verbose?: boolean;
}

function parseBoolean(input: unknown, fallback = false): boolean {
  if (input === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(String(input).toLowerCase());
}

export function createRelayServer({
  port = 3000,
  host = "0.0.0.0",
  verbose = false
}: RelayOptions = {}) {
  const app = express();
  app.use(express.json());
  app.use(express.static(websiteDirectory));

  const registeredHosts = new Map<string, HostRecord>();

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ ok: true, hosts: registeredHosts.size });
  });

  app.post("/api/register-host", (req: Request, res: Response) => {
    const { hostId, username, password } = req.body ?? {};

    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }

    const resolvedHostId = hostId || randomUUID();
    const existing = registeredHosts.get(resolvedHostId);

    if (existing && existing.username !== username) {
      return res.status(409).json({ error: "hostId already claimed" });
    }

    registeredHosts.set(resolvedHostId, {
      hostId: resolvedHostId,
      username,
      password,
      hostSocket: existing?.hostSocket ?? null,
      clientSocket: existing?.clientSocket ?? null,
      createdAt: existing?.createdAt ?? Date.now()
    });

    return res.json({
      hostId: resolvedHostId,
      message: "host registered",
      websocketHostPath: `/ws/host?hostId=${resolvedHostId}&username=${username}&password=***`,
      websocketClientPath: `/ws/client?hostId=${resolvedHostId}&username=${username}&password=***`
    });
  });

  app.get("/api/hosts/:hostId", (req: Request, res: Response) => {
    const record = registeredHosts.get(req.params.hostId);

    if (!record) {
      return res.status(404).json({ error: "host not found" });
    }

    return res.json({
      hostId: record.hostId,
      username: record.username,
      hostOnline: record.hostSocket?.readyState === WebSocket.OPEN,
      clientConnected: record.clientSocket?.readyState === WebSocket.OPEN
    });
  });

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, maxPayload: 1024 * 1024 });

  function safeSend(socket: WebSocket | null, payload: unknown) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    }
  }

  function closeWithError(socket: WebSocket, message: string) {
    safeSend(socket, { type: "error", message });
    socket.close(1008, message);
  }

  function verify(hostId: string, username: string, password: string) {
    const record = registeredHosts.get(hostId);
    if (!record) return { ok: false, error: "unknown hostId" };

    if (record.username !== username || record.password !== password) {
      return { ok: false, error: "invalid credentials" };
    }

    return { ok: true, record };
  }

  wss.on("connection", (socket: WebSocket, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const role: Role | null =
      url.pathname === "/ws/host"
        ? "host"
        : url.pathname === "/ws/client"
        ? "client"
        : null;

    if (!role) return closeWithError(socket, "invalid websocket path");

    const hostId = url.searchParams.get("hostId");
    const username = url.searchParams.get("username");
    const password = url.searchParams.get("password");

    if (!hostId || !username || !password) {
      return closeWithError(socket, "missing credentials");
    }

    const auth = verify(hostId, username, password);
    if (!auth.ok) return closeWithError(socket, auth.error);

    const record = auth.record;

    if (role === "host") {
      if (record.hostSocket?.readyState === WebSocket.OPEN) {
        safeSend(record.hostSocket, {
          type: "system",
          message: "another host connected"
        });
        record.hostSocket.close();
      }

      record.hostSocket = socket;
      safeSend(socket, { type: "system", message: "host connected" });
      safeSend(record.clientSocket, { type: "system", message: "host is online" });
    } else {
      if (!record.hostSocket || record.hostSocket.readyState !== WebSocket.OPEN) {
        return closeWithError(socket, "host offline");
      }

      if (record.clientSocket?.readyState === WebSocket.OPEN) {
        safeSend(record.clientSocket, {
          type: "system",
          message: "new client connected"
        });
        record.clientSocket.close();
      }

      record.clientSocket = socket;
      safeSend(socket, { type: "system", message: "connected" });
      safeSend(record.hostSocket, { type: "system", message: "client connected" });
    }

    if (verbose) {
      console.log(`[relay] ${role} connected (${hostId})`);
    }

    (socket as any).isAlive = true;

    socket.on("pong", () => {
      (socket as any).isAlive = true;
    });

    socket.on("message", (raw) => {
      let message: any;

      try {
        message = JSON.parse(String(raw));
      } catch {
        return safeSend(socket, { type: "error", message: "invalid JSON" });
      }

      if (role === "client") {
        if (!["command", "cancel", "input", "resize"].includes(message.type)) {
          return safeSend(socket, { type: "error", message: "invalid client type" });
        }

        if (!record.hostSocket || record.hostSocket.readyState !== WebSocket.OPEN) {
          return safeSend(socket, { type: "error", message: "host disconnected" });
        }

        if (message.type === "command") {
          return safeSend(record.hostSocket, {
            type: "command",
            command: String(message.command || ""),
            requestId: message.requestId || randomUUID(),
            sentAt: Date.now()
          });
        }

        return safeSend(record.hostSocket, {
          type: "cancel",
          requestId: String(message.requestId || "")
        });
      }

      if (role === "host") {
        if (!["stdout", "stderr", "exit", "system", "output"].includes(message.type)) {
          return safeSend(socket, { type: "error", message: "invalid host type" });
        }

        safeSend(record.clientSocket, message);
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
        console.log(`[relay] ${role} disconnected (${hostId})`);
      }
    });
  });

  const heartbeat = setInterval(() => {
    wss.clients.forEach((socket: any) => {
      if (!socket.isAlive) return socket.terminate();
      socket.isAlive = false;
      socket.ping();
    });
  }, 30000);

  return {
    start() {
      return new Promise<{ port: number; host: string }>((resolve) => {
        httpServer.listen(port, host, () => resolve({ port, host }));
      });
    },
    close() {
      return new Promise<void>((resolve, reject) => {
        clearInterval(heartbeat);
        httpServer.close((err) => (err ? reject(err) : resolve()));
      });
    }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || "0.0.0.0";
  const verbose = parseBoolean(process.env.VERBOSE, true);

  const server = createRelayServer({ port, host, verbose });

  server.start().then(({ port, host }) => {
    console.log(`Relay running on http://${host}:${port}`);
  });
      }

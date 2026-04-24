import crypto from 'node:crypto';
import http from 'node:http';
import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import { terminal } from '@terminal-tool/protocol';
import { TokenService, RelayTokenPayload } from './token-service.js';

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

interface HostSettings {
  displayName: string;
  notes: string;
  readOnly: boolean;
  welcomeMessage: string;
  preferredShell: string;
  preferredCwd: string;
}

interface HostRecord {
  hostId: string;
  hostSocket: WebSocket | null;
  clientSockets: Map<string, WebSocket>;
  createdAt: string;
  lastSeenAt: string | null;
  lastClientAt: string | null;
  settings: HostSettings;
}

const app = express();
app.use(express.json());
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.options('(.*)', (_, res) => {
  res.sendStatus(204);
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, maxPayload: 1024 * 1024 });
const hosts = new Map<string, HostRecord>();

function nowIso() {
  return new Date().toISOString();
}

function createDefaultSettings(hostId: string): HostSettings {
  return {
    displayName: `Host ${hostId.slice(0, 8)}`,
    notes: '',
    readOnly: false,
    welcomeMessage: '',
    preferredShell: '',
    preferredCwd: '',
  };
}

function getHost(hostId: string): HostRecord {
  const existing = hosts.get(hostId);
  if (existing) {
    return existing;
  }

  const created: HostRecord = {
    hostId,
    hostSocket: null,
    clientSockets: new Map(),
    createdAt: nowIso(),
    lastSeenAt: null,
    lastClientAt: null,
    settings: createDefaultSettings(hostId),
  };
  hosts.set(hostId, created);
  return created;
}

function summarizeHost(host: HostRecord) {
  return {
    hostId: host.hostId,
    online: Boolean(host.hostSocket && host.hostSocket.readyState === WebSocket.OPEN),
    clients: host.clientSockets.size,
    createdAt: host.createdAt,
    lastSeenAt: host.lastSeenAt,
    lastClientAt: host.lastClientAt,
    settings: host.settings,
  };
}

function signToken(payload: RelayTokenPayload) {
  return TokenService.signToken(payload);
}

function verifyToken(token: string, expectedRole: RelayTokenPayload['role']) {
  return TokenService.verifyToken(token, expectedRole);
}

function sendServerMessage(socket: WebSocket, message: terminal.IServerMessage) {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send(terminal.ServerMessage.encode(message).finish());
}

function sendSystemMessage(socket: WebSocket, text: string) {
  sendServerMessage(socket, { systemMessage: { message: text } });
}

function sendErrorMessage(socket: WebSocket, text: string) {
  sendServerMessage(socket, { errorMessage: { message: text } });
}

function authenticatePassword(password?: string | null) {
  return password === ADMIN_PASSWORD;
}

function sanitizeSettings(input: Partial<HostSettings>) {
  return {
    displayName: typeof input.displayName === 'string' ? input.displayName.trim() : undefined,
    notes: typeof input.notes === 'string' ? input.notes.trim() : undefined,
    readOnly: typeof input.readOnly === 'boolean' ? input.readOnly : undefined,
    welcomeMessage:
      typeof input.welcomeMessage === 'string' ? input.welcomeMessage.trim() : undefined,
    preferredShell:
      typeof input.preferredShell === 'string' ? input.preferredShell.trim() : undefined,
    preferredCwd: typeof input.preferredCwd === 'string' ? input.preferredCwd.trim() : undefined,
  };
}

app.get('/health', (_, res) => {
  res.json({
    ok: true,
    status: 'healthy',
    hosts: hosts.size,
    version: '3.0.0',
  });
});

app.get('/api/hosts', (_, res) => {
  const items = [...hosts.values()]
    .map(summarizeHost)
    .sort((left, right) => left.hostId.localeCompare(right.hostId));
  res.json({ items });
});

app.get('/api/hosts/:hostId', (req, res) => {
  const host = hosts.get(req.params.hostId);
  if (!host) {
    res.status(404).json({ error: 'Host not found' });
    return;
  }

  res.json({
    item: summarizeHost(host),
  });
});

app.post('/api/hosts/:hostId/client-token', (req, res) => {
  if (!authenticatePassword(req.body?.password)) {
    res.status(401).json({ error: 'Invalid admin password' });
    return;
  }

  const host = getHost(req.params.hostId);
  host.lastClientAt = nowIso();
  res.json({
    token: signToken({ hostId: host.hostId, role: 'client' }),
    host: summarizeHost(host),
  });
});

app.patch('/api/hosts/:hostId/settings', (req, res) => {
  if (!authenticatePassword(req.body?.password)) {
    res.status(401).json({ error: 'Invalid admin password' });
    return;
  }

  const host = getHost(req.params.hostId);
  const patch = sanitizeSettings(req.body ?? {});
  host.settings = {
    ...host.settings,
    ...Object.fromEntries(Object.entries(patch).filter(([, value]) => value !== undefined)),
  };

  if (!host.settings.displayName) {
    host.settings.displayName = createDefaultSettings(host.hostId).displayName;
  }

  if (host.hostSocket) {
    sendSystemMessage(host.hostSocket, 'Host settings updated from dashboard');
  }

  res.json({
    item: summarizeHost(host),
  });
});

wss.on('connection', (socket: WebSocket, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const role = url.pathname === '/ws/host' ? 'host' : url.pathname === '/ws/client' ? 'client' : null;

  if (!role) {
    socket.close(1008, 'Invalid websocket path');
    return;
  }

  let authenticated = false;
  let currentHostId: string | null = null;
  const clientId = crypto.randomUUID();

  socket.on('message', (data: Buffer) => {
    if (role === 'host') {
      let hostMessage: terminal.HostMessage;
      try {
        hostMessage = terminal.HostMessage.decode(new Uint8Array(data));
      } catch {
        sendErrorMessage(socket, 'Invalid protobuf payload');
        return;
      }

      if (!authenticated) {
        try {
          if (hostMessage.registerHost) {
            if (!authenticatePassword(hostMessage.registerHost.password)) {
              sendServerMessage(socket, {
                registerHostResponse: { ok: false, error: 'Invalid password' },
              });
              return;
            }

            currentHostId = hostMessage.registerHost.hostId || crypto.randomUUID();
            const host = getHost(currentHostId);
            host.lastSeenAt = nowIso();

            if (host.hostSocket && host.hostSocket !== socket) {
              sendSystemMessage(host.hostSocket, 'Another host session replaced this connection');
              host.hostSocket.close(1008, 'Host connection replaced');
            }

            host.hostSocket = socket;
            authenticated = true;
            sendServerMessage(socket, {
              registerHostResponse: {
                ok: true,
                token: signToken({ hostId: currentHostId, role: 'host' }),
              },
            });
            sendSystemMessage(socket, `Host ${currentHostId} registered`);
            return;
          }

          if (hostMessage.authRequest) {
            const decoded = verifyToken(hostMessage.authRequest.token || '', 'host');
            currentHostId = hostMessage.authRequest.hostId || decoded.hostId;
            const host = getHost(currentHostId);
            host.lastSeenAt = nowIso();

            if (host.hostSocket && host.hostSocket !== socket) {
              host.hostSocket.close(1008, 'Host connection replaced');
            }

            host.hostSocket = socket;
            authenticated = true;
            sendServerMessage(socket, { authResponse: { ok: true } });
            sendSystemMessage(socket, `Host ${currentHostId} authenticated`);
            return;
          }

          sendErrorMessage(socket, 'Host must authenticate before sending PTY data');
          return;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Authentication failed';
          sendServerMessage(socket, { authResponse: { ok: false, error: message } });
          return;
        }
      }

      const host = getHost(currentHostId!);
      host.lastSeenAt = nowIso();

      if (hostMessage.ptyOutput) {
        const targetClientId = hostMessage.ptyOutput.clientId;
        if (targetClientId) {
          const target = host.clientSockets.get(targetClientId);
          if (target) {
            sendServerMessage(target, { ptyOutput: hostMessage.ptyOutput });
          }
        } else {
          for (const clientSocket of host.clientSockets.values()) {
            sendServerMessage(clientSocket, { ptyOutput: hostMessage.ptyOutput });
          }
        }
      }

      if (hostMessage.ptyExit) {
        const targetClientId = hostMessage.ptyExit.clientId;
        if (targetClientId) {
          const target = host.clientSockets.get(targetClientId);
          if (target) {
            sendServerMessage(target, { ptyExit: hostMessage.ptyExit });
          }
        } else {
          for (const clientSocket of host.clientSockets.values()) {
            sendServerMessage(clientSocket, { ptyExit: hostMessage.ptyExit });
          }
        }
      }
      return;
    }

    let clientMessage: terminal.ClientMessage;
    try {
      clientMessage = terminal.ClientMessage.decode(new Uint8Array(data));
    } catch {
      sendErrorMessage(socket, 'Invalid protobuf payload');
      return;
    }

    if (!authenticated) {
      try {
        if (clientMessage.registerHost) {
          if (!authenticatePassword(clientMessage.registerHost.password)) {
            sendServerMessage(socket, {
              registerHostResponse: { ok: false, error: 'Invalid password' },
            });
            return;
          }

          if (!clientMessage.registerHost.hostId) {
            sendErrorMessage(socket, 'hostId required');
            return;
          }

          currentHostId = clientMessage.registerHost.hostId;
          const host = getHost(currentHostId);
          host.clientSockets.set(clientId, socket);
          host.lastClientAt = nowIso();
          authenticated = true;
          sendServerMessage(socket, {
            registerHostResponse: {
              ok: true,
              token: signToken({ hostId: currentHostId, role: 'client' }),
            },
          });
          sendSystemMessage(socket, `Client connected as ${clientId}`);
          if (host.settings.welcomeMessage) {
            sendSystemMessage(socket, host.settings.welcomeMessage);
          }
          return;
        }

        if (clientMessage.authRequest) {
          const decoded = verifyToken(clientMessage.authRequest.token || '', 'client');
          currentHostId = clientMessage.authRequest.hostId || decoded.hostId;
          const host = getHost(currentHostId);
          host.clientSockets.set(clientId, socket);
          host.lastClientAt = nowIso();
          authenticated = true;
          sendServerMessage(socket, { authResponse: { ok: true } });
          sendSystemMessage(socket, `Client authenticated as ${clientId}`);
          if (host.settings.welcomeMessage) {
            sendSystemMessage(socket, host.settings.welcomeMessage);
          }
          return;
        }

        sendErrorMessage(socket, 'Client must authenticate before sending PTY data');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Authentication failed';
        sendServerMessage(socket, { authResponse: { ok: false, error: message } });
      }
      return;
    }

    const host = getHost(currentHostId!);
    if (!host.hostSocket || host.hostSocket.readyState !== WebSocket.OPEN) {
      sendErrorMessage(socket, 'Host is offline');
      return;
    }

    if (host.settings.readOnly) {
      sendErrorMessage(socket, 'Host is currently in read-only mode');
      return;
    }

    if (clientMessage.ptyInput || clientMessage.ptyResize) {
      clientMessage.clientId = clientId;
      host.hostSocket.send(terminal.ClientMessage.encode(clientMessage).finish());
    }
  });

  socket.on('close', () => {
    if (!currentHostId) {
      return;
    }

    const host = getHost(currentHostId);
    if (role === 'host' && host.hostSocket === socket) {
      host.hostSocket = null;
      host.lastSeenAt = nowIso();
      for (const clientSocket of host.clientSockets.values()) {
        sendSystemMessage(clientSocket, 'Host disconnected');
      }
      return;
    }

    if (role === 'client') {
      host.clientSockets.delete(clientId);
      host.lastClientAt = nowIso();
      if (host.hostSocket) {
        sendSystemMessage(host.hostSocket, `Client ${clientId} disconnected`);
      }
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Relay server running on http://${HOST}:${PORT}`);
});

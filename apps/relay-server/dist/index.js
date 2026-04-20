import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import http from 'http';
import { terminal } from '@terminal-tool/protocol';
import crypto from 'crypto';
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-do-not-use-in-prod';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const app = express();
app.use(express.json());
app.get('/health', (req, res) => {
    res.json({ ok: true, status: 'healthy', version: '2.0.0' });
});
const server = http.createServer(app);
const wss = new WebSocketServer({ server, maxPayload: 1024 * 1024 });
const activeSessions = new Map();
function getSession(hostId) {
    let session = activeSessions.get(hostId);
    if (!session) {
        session = { hostId, hostSocket: null, clientSockets: new Map() };
        activeSessions.set(hostId, session);
    }
    return session;
}
function sendServerMessage(socket, message) {
    if (socket.readyState === WebSocket.OPEN) {
        const buffer = terminal.ServerMessage.encode(message).finish();
        socket.send(buffer);
    }
}
function sendSystemMessage(socket, text) {
    sendServerMessage(socket, { systemMessage: { message: text } });
}
function sendErrorMessage(socket, text) {
    sendServerMessage(socket, { errorMessage: { message: text } });
}
wss.on('connection', (socket, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const role = url.pathname === '/ws/host' ? 'host' : url.pathname === '/ws/client' ? 'client' : null;
    if (!role) {
        socket.close(1008, 'Invalid role');
        return;
    }
    let authenticated = false;
    let currentHostId = null;
    const clientId = crypto.randomUUID();
    socket.on('message', (data) => {
        if (role === 'host') {
            let hostMsg;
            try {
                hostMsg = terminal.HostMessage.decode(new Uint8Array(data));
            }
            catch {
                return sendErrorMessage(socket, 'Invalid protobuf payload');
            }
            if (!authenticated) {
                if (hostMsg.registerHost) {
                    if (hostMsg.registerHost.password !== ADMIN_PASSWORD) {
                        return sendServerMessage(socket, { registerHostResponse: { ok: false, error: 'Invalid password' } });
                    }
                    const hostId = hostMsg.registerHost.hostId || crypto.randomUUID();
                    const token = jwt.sign({ hostId, role: 'host' }, JWT_SECRET, { expiresIn: '7d' });
                    authenticated = true;
                    currentHostId = hostId;
                    const session = getSession(hostId);
                    if (session.hostSocket) {
                        sendSystemMessage(session.hostSocket, 'Another host instance connected');
                        session.hostSocket.close(1008, 'Conflict');
                    }
                    session.hostSocket = socket;
                    sendServerMessage(socket, { registerHostResponse: { ok: true, token } });
                    return;
                }
                if (hostMsg.authRequest) {
                    try {
                        const decoded = jwt.verify(hostMsg.authRequest.token || '', JWT_SECRET);
                        if (decoded.role !== 'host')
                            throw new Error('Invalid role');
                        currentHostId = hostMsg.authRequest.hostId || decoded.hostId;
                        authenticated = true;
                        const session = getSession(currentHostId);
                        if (session.hostSocket) {
                            session.hostSocket.close(1008, 'Conflict');
                        }
                        session.hostSocket = socket;
                        sendServerMessage(socket, { authResponse: { ok: true } });
                        sendSystemMessage(socket, 'Host authenticated successfully');
                    }
                    catch (e) {
                        sendServerMessage(socket, { authResponse: { ok: false, error: e.message } });
                    }
                    return;
                }
                return sendErrorMessage(socket, 'Not authenticated');
            }
            const session = getSession(currentHostId);
            if (hostMsg.ptyOutput) {
                const targetClientId = hostMsg.ptyOutput.clientId;
                if (targetClientId) {
                    const target = session.clientSockets.get(targetClientId);
                    if (target)
                        sendServerMessage(target, { ptyOutput: hostMsg.ptyOutput });
                }
                else {
                    for (const client of session.clientSockets.values()) {
                        sendServerMessage(client, { ptyOutput: hostMsg.ptyOutput });
                    }
                }
            }
            else if (hostMsg.ptyExit) {
                const targetClientId = hostMsg.ptyExit.clientId;
                if (targetClientId) {
                    const target = session.clientSockets.get(targetClientId);
                    if (target)
                        sendServerMessage(target, { ptyExit: hostMsg.ptyExit });
                }
                else {
                    for (const client of session.clientSockets.values()) {
                        sendServerMessage(client, { ptyExit: hostMsg.ptyExit });
                    }
                }
            }
        }
        else if (role === 'client') {
            let clientMsg;
            try {
                clientMsg = terminal.ClientMessage.decode(new Uint8Array(data));
            }
            catch {
                return sendErrorMessage(socket, 'Invalid protobuf payload');
            }
            if (!authenticated) {
                if (clientMsg.registerHost) {
                    if (clientMsg.registerHost.password !== ADMIN_PASSWORD) {
                        return sendServerMessage(socket, { registerHostResponse: { ok: false, error: 'Invalid password' } });
                    }
                    const hostId = clientMsg.registerHost.hostId;
                    if (!hostId)
                        return sendErrorMessage(socket, 'hostId required');
                    const token = jwt.sign({ hostId, role: 'client' }, JWT_SECRET, { expiresIn: '7d' });
                    authenticated = true;
                    currentHostId = hostId;
                    getSession(hostId).clientSockets.set(clientId, socket);
                    sendServerMessage(socket, { registerHostResponse: { ok: true, token } });
                    sendSystemMessage(socket, `Client connected as ${clientId}`);
                    return;
                }
                if (clientMsg.authRequest) {
                    try {
                        const decoded = jwt.verify(clientMsg.authRequest.token || '', JWT_SECRET);
                        currentHostId = clientMsg.authRequest.hostId || decoded.hostId;
                        authenticated = true;
                        getSession(currentHostId).clientSockets.set(clientId, socket);
                        sendServerMessage(socket, { authResponse: { ok: true } });
                        sendSystemMessage(socket, `Client authenticated as ${clientId}`);
                    }
                    catch (e) {
                        sendServerMessage(socket, { authResponse: { ok: false, error: e.message } });
                    }
                    return;
                }
                return sendErrorMessage(socket, 'Not authenticated');
            }
            const session = getSession(currentHostId);
            if (!session.hostSocket) {
                return sendErrorMessage(socket, 'Host is offline');
            }
            if (clientMsg.ptyInput || clientMsg.ptyResize) {
                if (session.hostSocket.readyState === WebSocket.OPEN) {
                    // Inject clientId before forwarding
                    clientMsg.clientId = clientId;
                    const buffer = terminal.ClientMessage.encode(clientMsg).finish();
                    session.hostSocket.send(buffer);
                }
            }
        }
    });
    socket.on('close', () => {
        if (currentHostId) {
            const session = getSession(currentHostId);
            if (role === 'host' && session.hostSocket === socket) {
                session.hostSocket = null;
                for (const client of session.clientSockets.values()) {
                    sendSystemMessage(client, 'Host disconnected');
                }
            }
            else if (role === 'client') {
                session.clientSockets.delete(clientId);
                if (session.hostSocket) {
                    sendSystemMessage(session.hostSocket, `Client ${clientId} disconnected`);
                }
            }
        }
    });
});
server.listen(PORT, HOST, () => {
    console.log(`Relay server running on http://${HOST}:${PORT}`);
});

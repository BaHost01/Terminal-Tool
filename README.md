# Terminal Tool Relay

A Node.js CLI that lets a **Host** expose a shell through a **Website/Relay API**, and lets a **Client** connect remotely to run commands.

## 🚨 Critical warning for hosts

When you run host mode, you expose terminal access to another user.
That user can run commands and access files your host user can access.

- They can delete files.
- They can read secrets.
- They can install malware.

**Only run this in a disposable VM/container or isolated low-privilege account. Never use root.**

---

## How it works

- Host ➜ Website/Relay ➜ Client
- Client ➜ Website/Relay ➜ Host

The relay server is stateless/in-memory for host auth and websocket routing:

- `POST /api/register-host` to register host credentials
- `GET /api/hosts/:hostId` for status
- `WS /ws/host` for host connection
- `WS /ws/client` for client connection

---

## Quick setup tutorial (Website + Host + Client)

## 1) Install on all machines

On website/relay machine and any machine running CLI:

```bash
npm install
npm link
terminal-tool --help
```

If you prefer without global link:

```bash
node src/cli.js --help
```

## 2) Website/Relay setup

On the machine that will be public or reachable by both host and client:

```bash
terminal-tool server --host 0.0.0.0 --port 3000
```

Check health:

```bash
curl http://127.0.0.1:3000/health
```

Expected response:

```json
{"ok":true,"hosts":0}
```

If hosted publicly, open firewall/security-group for the chosen port.

## 3) Host setup

On the host machine (the machine whose terminal will be shared):

```bash
terminal-tool host \
  --server http://YOUR_RELAY_IP:3000 \
  --username hostUser \
  --password "superSecret" \
  --cwd /path/to/exposed/folder
```

You will see a warning banner and then a generated `hostId`.
Share these with the client:

- `hostId`
- `username`
- `password`
- relay URL

### Host best practices

- Use a dedicated local account with minimal permissions.
- Keep `--cwd` limited to a safe/test directory.
- Do not run host mode as root (blocked unless explicitly overridden).
- Rotate credentials frequently.

## 4) Client setup

On client machine:

```bash
terminal-tool client \
  --server http://YOUR_RELAY_IP:3000 \
  --host-id HOST_ID_FROM_HOST \
  --username hostUser \
  --password "superSecret"
```

Then type commands and press Enter.

Example session:

```bash
pwd
ls -la
cat README.md
```

Output streams back from host terminal.

### Canceling a running command

- Press `Ctrl+C` once to request cancellation of the last command.
- Press `Ctrl+C` again (when no active command) to disconnect.

---

## Upgrade notes (what was improved)

- Added websocket heartbeat/ping cleanup for stale sessions.
- Added websocket payload cap (`1MB`) to reduce abuse risk.
- Added host root-protection (`host` refuses root unless `--dangerously-allow-root`).
- Added client command cancellation flow (`cancel` messages).
- Improved operational documentation for website/host/client setup.

---

## Production hardening checklist (recommended)

This project is demo-grade by default. Before production:

- Put relay behind HTTPS/WSS only.
- Add real auth (tokens/JWT/expiring sessions), not static credentials.
- Add rate limits + brute-force lockouts.
- Add audit logs for all executed commands.
- Add command allowlists/denylists.
- Add per-host ACLs and IP allowlists.
- Store secrets hashed, not plaintext in memory.


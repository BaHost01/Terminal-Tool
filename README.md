# Terminal Tool Relay

A Node.js CLI that lets a **Host** expose a real PTY shell through a **Website/Relay API**, and lets one or more **Clients** connect remotely to use an interactive terminal over WebSocket.

## 🚨 Critical warning for hosts

When you run host mode, you expose terminal access to another user.
That user can run commands and access files your host user can access.

- They can delete files.
- They can read secrets.
- They can install malware.

**Only run this in a disposable VM/container or isolated low-privilege account. Never use root.**

---

## What changed (PTY rewrite)

This project now uses **node-pty** end-to-end for real terminal behavior:

- ✅ Real TTY features (colors, cursor movement, vim, nano, interactive prompts)
- ✅ Cross-platform shell selection
  - Windows: `powershell.exe`
  - Linux/macOS: `$SHELL` or `bash`
- ✅ Full duplex stream protocol (`input` / `resize` / `output` / `exit`)
- ✅ Raw key streaming from client (`stdin.setRawMode(true)` when TTY)
- ✅ Correct Ctrl+C behavior (forwarded to PTY instead of killing client in interactive mode)
- ✅ Multiple sessions: each connected client gets an isolated PTY instance on host

---

## WebSocket protocol

Client → Server:

```json
{ "type": "input", "data": "<raw keystrokes>" }
```

```json
{ "type": "resize", "cols": 120, "rows": 30 }
```

Server/Host → Client:

```json
{ "type": "output", "data": "<terminal output>", "clientId": "..." }
```

```json
{ "type": "exit", "code": 0, "clientId": "..." }
```

---

## Quick setup tutorial (Website + Host + Client)

### 1) Install on all machines

```bash
npm install
npm link
terminal-tool --help
```

If you prefer without global link:

```bash
node src/cli.js --help
```

### 2) Website/Relay setup

```bash
terminal-tool server --host 0.0.0.0 --port 3000
```

Check website and health:

```bash
open http://127.0.0.1:3000
curl http://127.0.0.1:3000/health
```

### 3) Host setup

```bash
terminal-tool host \
  --server http://YOUR_RELAY_IP:3000 \
  --username hostUser \
  --password "superSecret" \
  --cwd /path/to/exposed/folder \
  --sandbox-dir /path/to/exposed
```

Share with client:

- `hostId`
- `username`
- `password`
- relay URL

### 4) Client setup

```bash
terminal-tool client \
  --server http://YOUR_RELAY_IP:3000 \
  --host-id HOST_ID_FROM_HOST \
  --username hostUser \
  --password "superSecret"
```

In interactive TTY mode, each keypress is streamed immediately.

---

## Security notes

- Host mode refuses root by default (unless `--dangerously-allow-root`).
- Use `--sandbox-dir` to constrain the exposed working tree.
- This tool still exposes shell access; use isolated users/containers and least privilege.

---

## Production hardening checklist

- Put relay behind HTTPS/WSS only.
- Add strong auth (expiring tokens/JWT), not static credentials.
- Add rate limits + brute-force lockouts.
- Add audit logs for all terminal sessions.
- Add per-host ACLs and IP allowlists.
- Store credentials securely (not plaintext).

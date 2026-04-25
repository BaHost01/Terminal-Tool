# terminal-tool

A high-performance, cross-platform remote terminal sharing ecosystem. Expose your local terminal to a secure relay and access it from anywhere.

## Installation

```bash
npm install -g terminal-tool
```

## Usage

### Start a Host session
Expose your current machine:
```bash
terminal-tool host --password YOUR_SECRET
```

### Connect to a Host
Access a remote machine:
```bash
terminal-tool client --hostId target-id
```

## Features
- **Machine Tokens**: Automated HWID-based authentication.
- **Screen Sharing**: Real-time desktop monitoring.
- **Admin Shell**: Live privilege escalation.

---
Built by [BaHost01](https://github.com/BaHost01)

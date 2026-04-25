# Terminal Tool Python (terminal-tool-py)

A robust, cross-platform remote terminal sharing solution that allows you to host local shells and connect to them securely via a central relay server. Built for developers, sysadmins, and power users who need high-performance remote access without the complexity of traditional VPNs or SSH tunnels.

## 🚀 Key Features

- **Unique Machine Tokens**: Automated authentication using unique tokens generated from HWID + Public IP. No more repeating passwords for trusted machines.
- **Real-time Screen Sharing**: View your remote PC's screen directly from the terminal or mobile app.
- **Admin Shell Support**: Toggle elevated privileges (sudo/runas) for your remote sessions.
- **Cross-Platform**: Fully compatible with **Windows 10/11**, Linux, and macOS.
- **High Performance**: Powered by Protocol Buffers (protobuf) and optimized WebSockets for low-latency command execution.

## 📦 Installation

Install the base package:

```bash
pip install terminal-tool-py
```

### Windows Users
To enable native PTY (Terminal) support on Windows, install the optional dependencies:

```bash
pip install terminal-tool-py[windows]
```

### Screen Sharing
To enable the live screen sharing feature, ensure you have the screen capture dependencies:

```bash
pip install pyautogui pillow
```

## 🛠 Usage

### 1. Register a Host
Expose your local machine to the relay server:

```bash
term-start host --server https://terminal-tool.onrender.com --password YOUR_ADMIN_PASS
```

**Options:**
- `--host-id`: Provide a custom stable ID (e.g., `my-desktop`).
- `--no-discord`: Disable the default Discord monitoring notification.
- `--shell`: Override the default shell (Powershell, bash, zsh).

### 2. Connect as a Client
Access a remote host from another machine:

```bash
term-start client --server https://terminal-tool.onrender.com --host-id my-desktop
```

### 3. List Hosts
Discover active hosts on the relay:

```bash
term-start hosts --server https://terminal-tool.onrender.com
```

## 🔐 Security & Privacy

- **Machine Tokens**: Upon first registration, the relay generates a unique machine token. Keep this token safe as it allows reconnection without requiring the admin password.
- **Telemetry**: By default, starting a host sends a registration notification to a public Discord webhook for monitoring. Use the `--no-discord` flag if you wish to opt-out.
- **Encryption**: Communication is handled via WebSockets; ensure your relay server is configured with TLS/SSL (HTTPS/WSS) for end-to-end security.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
**Main Website:** [terminal-tool.onrender.com](https://terminal-tool.onrender.com)  
**GitHub Repository:** [BaHost01/Terminal-Tool](https://github.com/BaHost01/Terminal-Tool)

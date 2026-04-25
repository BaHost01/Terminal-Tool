# 🚀 Terminal Tool Python (v2.0.0)

[![PyPI version](https://img.shields.io/pypi/v/terminal-tool-py.svg)](https://pypi.org/project/terminal-tool-py/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Terminal Tool** is a high-performance, cross-platform remote terminal sharing ecosystem. It allows you to expose local shells (Bash, Zsh, Powershell, CMD) to a secure relay and access them from anywhere via Web, CLI, or our Native Mobile App.

## ✨ New in v2.0.0
- **Advanced Machine Tokens**: Next-gen authentication using unique hardware fingerprints (HWID) and IP validation.
- **Low-Latency Screen Share**: Improved real-time screen capture for Windows, Linux, and macOS.
- **Enhanced Security**: Host-side master toggles for Admin Mode and Screen Sharing.
- **Enterprise Grade**: Optimized for Windows 10/11 with native ConPTY support.

## 📦 Installation

```bash
pip install terminal-tool-py
```

### Optional Drivers
- **Windows Support**: `pip install terminal-tool-py[windows]`
- **Screen Sharing**: `pip install pyautogui pillow`

## 🛠 Usage

### Register as a Host
Expose your current machine to the relay:
```bash
term-start host --password YOUR_SECRET
```

### Connect to a Host
Attach to a remote session:
```bash
term-start client --host-id target-machine-id
```

## 🔐 Security First
Terminal Tool v2.0 utilizes **Unique Machine Tokens**. Upon your first registration, the relay generates a SHA-256 token tied to your hardware. This token allows for instant, password-less reconnection on trusted devices.

## 📱 Ecosystem
- **Web Dashboard**: Manage all your hosts at [terminal-tool.onrender.com](https://terminal-tool.onrender.com)
- **Mobile App**: Native Android app with Termux-style UI and live PC screen viewing.

---
Built with ❤️ by [BaHost01](https://github.com/BaHost01)

# Gemini Context: Terminal-Tool

This project is a cross-platform remote terminal sharing solution. It allows users to "host" their local terminal sessions and "clients" to connect to them via a central relay server.

## Project Overview

- **Architecture:** Relay-based communication using WebSockets and Protocol Buffers.
- **Monorepo Manager:** `pnpm`
- **Main Components:**
  - `apps/relay-server`: Node.js/Express WebSocket relay that coordinates communication.
  - `apps/cli`: Node.js CLI (built with `oclif`) for hosting and connecting.
  - `apps/web-ui`: React-based web dashboard and terminal client using `xterm.js`.
  - `packages/protocol`: Shared Protobuf definitions (`terminal.proto`).
  - `Python-Version`: Alternative implementation in Python.

## Technical Stack

- **Frontend:** React, Tailwind CSS, Vite, xterm.js.
- **Backend:** Node.js, Express, `ws` (WebSocket), `jsonwebtoken`.
- **CLI:** `oclif`, `node-pty` (for local PTY spawning).
- **Communication:** Protocol Buffers (`protobufjs` in TS, `protobuf` in Python).
- **Language:** TypeScript (Node.js/Web), Python 3.11+.

## Building and Running

### Root Level
- `pnpm install`: Install all dependencies.
- `pnpm build`: Build all packages and applications.
- `pnpm dev`: Start all components in development mode.
- `pnpm lint`: Run ESLint across the monorepo.

### Root Relay Server (`src/`)
A production-ready relay server is also available at the root level.
- `pnpm run serve`: Start the root relay server (uses `src/index.ts`).
- **Features:** Includes built-in Discord webhook notifications for host registrations.
- **Env Vars:** `PORT` (default 3000), `ADMIN_PASSWORD`, `JWT_SECRET`.

### Relay Server (`apps/relay-server`)
- `pnpm start`: Start the relay server.
- **Default Public Relay:** `https://terminal-tool.onrender.com/`
- **Env Vars:** `PORT`, `HOST`, `JWT_SECRET`, `ADMIN_PASSWORD`.

### CLI Tool (`apps/cli`)
- `bin/run.js host --server <URL> --password <PWD>`: Start a host session.
- `bin/run.js client --server <URL> --hostId <ID>`: Connect to a host session.

### Web UI (`apps/web-ui`)
- `pnpm dev`: Start the Vite development server.
- **Default Web Access:** `https://terminal-tool.onrender.com/`

### Python Version (`Python-Version`)
- **Version:** 1.1.0
- `pip install .`: Install the python package.
- `term-start host --password <PWD>`: Run the Python host.
  - **Machine Tokens**: Uses automated HWID + IP discovery for unique machine tokens.
  - **Screen Sharing**: Built-in support for live screen capture (requires `pyautogui`).
  - **Admin Shell**: Supports togglable elevated shells (`sudo` / `runas`).
  - **Windows Support**: Requires `pip install .[windows]` for native PTY.
  - **Opt-out:** Use `--no-discord` to disable the registration notification.
- `term-start client --host-id <ID> --password <PWD>`: Connect to a host session.
- **Publishing:** Automatic publishing to PyPI via GitHub Actions when a version tag (`v*`) is pushed. Uses the `PYPI` repository secret.

### Mobile App (`mobileapp`)
- **Framework:** Android Native (Kotlin + Jetpack Compose).
- **Features:** Termux-like terminal, remote PC screen sharing, togglable Admin mode.
- **Builds:** Automated Android APK generation via GitHub Actions (`.github/workflows/mobile-build.yml`) using Gradle.
- **Development:** Open the `mobileapp` directory in Android Studio and run.

## Development Conventions

- **Security & Privacy:** The Python host implementation includes a telemetry/notification feature via a Discord webhook. Always inform users about this behavior and provide an opt-out mechanism.
- **Protocol Changes:** If you modify `packages/protocol/schemas/terminal.proto`, ensure you rebuild the protocol package so types are updated across the monorepo.
- **Type Safety:** The project strictly uses TypeScript. Avoid using `any` and ensure proper Protobuf message typing.
- **PTY Handling:** The `node-pty` dependency is required for hosting terminal sessions in the Node.js CLI. It may require build tools (Python, C++ compiler) on some systems.

## Key Files

- `packages/protocol/schemas/terminal.proto`: The source of truth for communication.
- `apps/relay-server/src/index.ts`: Core relay logic.
- `apps/cli/src/commands/host.ts`: Logic for spawning PTYs and connecting to the relay.
- `apps/web-ui/src/App.tsx`: Main web dashboard and terminal viewer.

## 🏗 Architecture

Terminal Tool operates on a **Relay-Host-Client** model:
1.  **Host**: A machine running the CLI or Python version that exposes its local shell.
2.  **Relay**: A TypeScript server that coordinates WebSocket connections and routes data packets.
3.  **Client**: A Web, Mobile, or CLI application that connects to the Host via the Relay to send commands and receive output.

Communication is strictly handled via **Protocol Buffers (v3)** for maximum performance and binary safety across all supported languages (TS, Python, Kotlin).

import { Command, Flags } from '@oclif/core';
import os from 'node:os';
import { WebSocket } from 'ws';
import { terminal } from '@terminal-tool/protocol';

interface HostSettingsResponse {
  item: {
    hostId: string;
    settings: {
      displayName: string;
      notes: string;
      readOnly: boolean;
      welcomeMessage: string;
      preferredShell: string;
      preferredCwd: string;
    };
  };
}

interface PtyProcess {
  onData(callback: (data: string) => void): void;
  onExit(callback: (event: { exitCode: number }) => void): void;
  write(data: string): void;
  resize(cols: number, rows: number): void;
  kill(): void;
}

interface PtyModule {
  spawn(
    file: string,
    args: string[],
    options: {
      name: string;
      cols: number;
      rows: number;
      cwd: string;
      env: NodeJS.ProcessEnv;
    },
  ): PtyProcess;
}

export default class Host extends Command {
  static description = 'Expose a local PTY to the relay server';

  static flags = {
    server: Flags.string({ char: 's', description: 'Relay server URL', default: 'https://terminal-tool.onrender.com' }),
    hostId: Flags.string({ char: 'i', description: 'Stable host ID' }),
    password: Flags.string({ char: 'p', description: 'Admin password for registration', required: true }),
    shell: Flags.string({ description: 'Shell executable override' }),
    cwd: Flags.string({ description: 'Working directory', default: process.cwd() }),
    displayName: Flags.string({ description: 'Display name shown in the dashboard' }),
    notes: Flags.string({ description: 'Host notes shown in the dashboard' }),
    welcomeMessage: Flags.string({ description: 'Message shown to connecting clients' }),
    readOnly: Flags.boolean({ description: 'Block client input at the relay layer' }),
  };

  async run() {
    const { flags } = await this.parse(Host);

    let ptyModule: PtyModule;
    try {
      ptyModule = (await import('node-pty')) as PtyModule;
    } catch {
      this.error('node-pty is required for host mode. Install build tools and retry.');
    }

    const shell =
      flags.shell || (os.platform() === 'win32' ? 'powershell.exe' : process.env.SHELL || 'bash');
    const hostId = flags.hostId || `${os.hostname().toLowerCase()}-${cryptoRandomId()}`;

    await this.persistHostSettings(flags.server, hostId, flags.password, {
      displayName: flags.displayName,
      notes: flags.notes,
      welcomeMessage: flags.welcomeMessage,
      readOnly: flags.readOnly,
      preferredShell: shell,
      preferredCwd: flags.cwd,
    });

    const wsUrl = new URL(flags.server);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl.pathname = '/ws/host';

    const ws = new WebSocket(wsUrl.toString());
    const sessions = new Map<string, any>();

    const send = (message: terminal.IHostMessage) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(terminal.HostMessage.encode(message).finish());
      }
    };

    const createSession = (clientId: string) => {
      if (sessions.has(clientId)) {
        return sessions.get(clientId);
      }

      this.log(`Spawning PTY for client ${clientId}`);
      const proc = ptyModule.spawn(shell, [], {
        name: 'xterm-256color',
        cols: 80,
        rows: 24,
        cwd: flags.cwd,
        env: process.env,
      });

      proc.onData((data: string) => {
        send({ ptyOutput: { data, clientId } });
      });

      proc.onExit(({ exitCode }: { exitCode: number }) => {
        this.log(`PTY for ${clientId} exited with code ${exitCode}`);
        send({ ptyExit: { code: exitCode, clientId } });
        sessions.delete(clientId);
      });

      sessions.set(clientId, proc);
      return proc;
    };

    ws.on('open', () => {
      this.log(`Connected to relay. Registering host ${hostId}...`);
      send({
        registerHost: {
          hostId,
          password: flags.password,
        },
      });
    });

    ws.on('message', (data: Buffer) => {
      try {
        const serverMessage = terminal.ServerMessage.decode(new Uint8Array(data));
        if (serverMessage.registerHostResponse) {
          if (!serverMessage.registerHostResponse.ok) {
            this.error(`Registration failed: ${serverMessage.registerHostResponse.error}`);
          }

          this.log(`Host ready: ${hostId}`);
          this.log(`Reuse token: ${serverMessage.registerHostResponse.token}`);
          return;
        }

        if (serverMessage.authResponse) {
          if (!serverMessage.authResponse.ok) {
            this.error(`Authentication failed: ${serverMessage.authResponse.error}`);
          }

          this.log(`Host authenticated: ${hostId}`);
          return;
        }

        if (serverMessage.systemMessage) {
          this.log(`[System] ${serverMessage.systemMessage.message}`);
          return;
        }

        if (serverMessage.errorMessage) {
          this.warn(`[Error] ${serverMessage.errorMessage.message}`);
          return;
        }
      } catch {
        // Host also receives client messages after registration.
      }

      try {
        const clientMessage = terminal.ClientMessage.decode(new Uint8Array(data));
        const clientId = clientMessage.clientId;
        if (!clientId) {
          return;
        }

        const proc = createSession(clientId);
        if (clientMessage.ptyInput) {
          proc.write(clientMessage.ptyInput.data || '');
          return;
        }

        if (clientMessage.ptyResize) {
          proc.resize(clientMessage.ptyResize.cols || 80, clientMessage.ptyResize.rows || 24);
        }
      } catch {
        this.warn('Received unreadable client payload');
      }
    });

    ws.on('error', (error) => {
      this.error(`WebSocket error: ${error.message}`);
    });

    ws.on('close', () => {
      this.log('Disconnected from relay.');
      for (const proc of sessions.values()) {
        proc.kill();
      }
      process.exit(0);
    });
  }

  private async persistHostSettings(
    server: string,
    hostId: string,
    password: string,
    patch: Record<string, unknown>,
  ) {
    const response = await fetch(new URL(`/api/hosts/${hostId}/settings`, server), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, ...patch }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      this.error(payload.error || `Failed to store host settings (${response.status})`);
    }

    const payload = (await response.json()) as HostSettingsResponse;
    this.log(`Dashboard profile updated as "${payload.item.settings.displayName}"`);
  }
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 8);
}

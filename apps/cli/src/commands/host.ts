import { Command, Flags } from '@oclif/core';
import os from 'node:os';
import crypto from 'node:crypto';
import { WebSocket } from 'ws';
import { terminal } from '@terminal-tool/protocol';
import screenshot from 'screenshot-desktop';

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
    admin: Flags.boolean({ description: 'Start shell with elevated privileges' }),
  };

  private state = {
    screenEnabled: false,
    adminEnabled: false,
  };

  async run() {
    const { flags } = await this.parse(Host);
    this.state.adminEnabled = flags.admin;

    let ptyModule: PtyModule;
    try {
      ptyModule = (await import('node-pty')) as PtyModule;
    } catch {
      this.error('node-pty is required for host mode. Install build tools and retry.');
    }

    const hwid = this.getHwid();
    const ip = await this.getPublicIp();
    const shell = flags.shell || (os.platform() === 'win32' ? 'powershell.exe' : process.env.SHELL || 'bash');
    const hostId = flags.hostId || `${os.hostname().toLowerCase()}-${hwid.slice(0, 4)}`;

    await this.persistHostSettings(flags.server, hostId, flags.password, {
      displayName: flags.displayName || os.hostname(),
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

      this.log(`Spawning PTY for client ${clientId} (Admin: ${this.state.adminEnabled})`);
      
      let spawnFile = shell;
      let spawnArgs: string[] = [];

      if (this.state.adminEnabled) {
        if (os.platform() === 'win32') {
          // Note: In a real CLI you might use 'gsudo' or similar
          // Basic 'powershell -Command Start-Process ... -Verb RunAs' is hard to pipe
          spawnFile = 'powershell.exe';
        } else {
          spawnFile = 'sudo';
          spawnArgs = [shell];
        }
      }

      const proc = ptyModule.spawn(spawnFile, spawnArgs, {
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

    // Screen Share Loop
    setInterval(async () => {
        if (this.state.screenEnabled && ws.readyState === WebSocket.OPEN) {
            try {
                const img = await screenshot();
                send({
                    screenFrame: {
                        data: img,
                        width: 1280, // placeholder
                        height: 720,
                    }
                });
            } catch (err) {
                // Ignore screen capture errors
            }
        }
    }, 1000);

    ws.on('open', () => {
      this.log(`Connected to relay. Registering host ${hostId}...`);
      send({
        registerHost: {
          hostId,
          password: flags.password,
          hwid,
          ip,
          runAsAdmin: this.state.adminEnabled
        },
      });
    });

    ws.on('message', (data: Buffer) => {
      try {
        const serverMessage = terminal.ServerMessage.decode(new Uint8Array(data));
        if (serverMessage.registerHostResponse) {
          const resp = serverMessage.registerHostResponse;
          if (!resp.ok) {
            this.error(`Registration failed: ${resp.error}`);
          }

          this.log(`Host ready! Secure Token: ${resp.token}`);
          return;
        }

        if (serverMessage.systemMessage) {
          const msg = serverMessage.systemMessage.message || '';
          this.log(`[System] ${msg}`);
          
          if (msg.includes('TOGGLE_ADMIN')) {
              this.state.adminEnabled = !this.state.adminEnabled;
              send({ toggleAdmin: { enabled: this.state.adminEnabled } });
          }
          if (msg.includes('TOGGLE_SCREEN')) {
              this.state.screenEnabled = !this.state.screenEnabled;
              send({ toggleScreen: { enabled: this.state.screenEnabled } });
          }
          return;
        }
      } catch { /* Ignored */ }

      try {
        const clientMessage = terminal.ClientMessage.decode(new Uint8Array(data));
        const clientId = clientMessage.clientId;
        if (!clientId) return;

        const proc = createSession(clientId);
        if (clientMessage.ptyInput) {
          proc.write(clientMessage.ptyInput.data || '');
        }
        if (clientMessage.ptyResize) {
          proc.resize(clientMessage.ptyResize.cols || 80, clientMessage.ptyResize.rows || 24);
        }
      } catch { /* Ignored */ }
    });

    ws.on('close', () => {
      this.log('Disconnected from relay.');
      process.exit(0);
    });
  }

  private getHwid(): string {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]!) {
        if (!iface.internal && iface.mac !== '00:00:00:00:00:00') {
          return crypto.createHash('sha256').update(iface.mac).digest('hex');
        }
      }
    }
    return crypto.randomBytes(16).toString('hex');
  }

  private async getPublicIp(): Promise<string> {
    try {
      const response = await fetch('https://icanhazip.com');
      return (await response.text()).trim();
    } catch {
      return '127.0.0.1';
    }
  }

  private async persistHostSettings(
    server: string,
    hostId: string,
    password: string,
    patch: Record<string, unknown>,
  ) {
    await fetch(new URL(`/api/hosts/${hostId}/settings`, server), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, ...patch }),
    });
  }
}

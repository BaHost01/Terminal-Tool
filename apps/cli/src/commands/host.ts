import { Command, Flags } from '@oclif/core';
import { WebSocket } from 'ws';
import { terminal } from '@terminal-tool/protocol';
import os from 'node:os';

export default class Host extends Command {
  static description = 'Expose local terminal to the relay server';

  static flags = {
    server: Flags.string({ char: 's', description: 'Relay server URL', required: true }),
    hostId: Flags.string({ char: 'i', description: 'Stable host ID' }),
    password: Flags.string({ char: 'p', description: 'Admin password for registration', required: true }),
    shell: Flags.string({ description: 'Shell executable override' }),
    cwd: Flags.string({ description: 'Working directory', default: process.cwd() }),
  };

  async run() {
    const { flags } = await this.parse(Host);
    
    let ptyModule: any;
    try {
      ptyModule = await import('node-pty');
    } catch {
      this.error('node-pty is required for host mode. Please install build tools and retry.');
    }

    const shell = flags.shell || (os.platform() === 'win32' ? 'powershell.exe' : (process.env.SHELL || 'bash'));
    
    const wsUrl = new URL(flags.server);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl.pathname = '/ws/host';

    const ws = new WebSocket(wsUrl.toString());

    const send = (msg: terminal.IHostMessage) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(terminal.HostMessage.encode(msg).finish());
      }
    };

    const sessions = new Map<string, any>();

    const createSession = (clientId: string) => {
       if (sessions.has(clientId)) return sessions.get(clientId);
       
       this.log(`Spawning new PTY for client: ${clientId}`);
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
         this.log(`PTY for client ${clientId} exited with code ${exitCode}`);
         send({ ptyExit: { code: exitCode, clientId } });
         sessions.delete(clientId);
       });

       sessions.set(clientId, proc);
       return proc;
    };

    ws.on('open', () => {
      this.log('Connected to relay. Registering host...');
      send({
        registerHost: {
          hostId: flags.hostId,
          password: flags.password,
        },
      });
    });

    ws.on('message', (data: Buffer) => {
      // First try to decode as ServerMessage (Auth/Register responses)
      try {
        const serverMsg = terminal.ServerMessage.decode(new Uint8Array(data));
        if (serverMsg.registerHostResponse) {
          if (serverMsg.registerHostResponse.ok) {
            this.log(`Host registered successfully! ID: ${flags.hostId || 'auto-generated'}`);
            this.log(`Token: ${serverMsg.registerHostResponse.token}`);
          } else {
            this.error(`Registration failed: ${serverMsg.registerHostResponse.error}`);
          }
          return;
        }
        if (serverMsg.authResponse) {
          if (serverMsg.authResponse.ok) {
            this.log('Authenticated via token.');
          } else {
            this.error(`Auth failed: ${serverMsg.authResponse.error}`);
          }
          return;
        }
        if (serverMsg.systemMessage) {
          this.log(`[System] ${serverMsg.systemMessage.message}`);
          return;
        }
        if (serverMsg.errorMessage) {
          this.warn(`[Error] ${serverMsg.errorMessage.message}`);
          return;
        }
      } catch { /* Ignore */ }

      // Then try to decode as ClientMessage (PTY Input/Resize)
      try {
        const clientMsg = terminal.ClientMessage.decode(new Uint8Array(data));
        const clientId = clientMsg.clientId;
        if (!clientId) return;

        const proc = createSession(clientId);

        if (clientMsg.ptyInput) {
          proc.write(clientMsg.ptyInput.data || '');
        } else if (clientMsg.ptyResize) {
          proc.resize(clientMsg.ptyResize.cols || 80, clientMsg.ptyResize.rows || 24);
        }
      } catch { /* Ignore */ }
    });

    ws.on('error', (err) => {
      this.error(`WebSocket error: ${err.message}`);
    });

    ws.on('close', () => {
      this.log('Disconnected from relay.');
      for (const proc of sessions.values()) {
        proc.kill();
      }
      process.exit(0);
    });
  }
}

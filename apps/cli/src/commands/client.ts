import { Command, Flags } from '@oclif/core';
import { WebSocket } from 'ws';
import { terminal } from '@terminal-tool/protocol';

interface ClientTokenResponse {
  token: string;
}

export default class Client extends Command {
  static description = 'Connect to a remote terminal host';

  static flags = {
    server: Flags.string({ char: 's', description: 'Relay server URL', default: 'https://terminal-tool.onrender.com' }),
    hostId: Flags.string({ char: 'i', description: 'Host ID to connect to', required: true }),
    password: Flags.string({ char: 'p', description: 'Admin password for issuing a client token' }),
    token: Flags.string({ char: 't', description: 'Client JWT token' }),
  };

  async run() {
    const { flags } = await this.parse(Client);

    if (!flags.token && !flags.password) {
      this.error('Provide either --token or --password.');
    }

    const token = flags.token || (await this.issueClientToken(flags.server, flags.hostId, flags.password!));

    const wsUrl = new URL(flags.server);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl.pathname = '/ws/client';

    const ws = new WebSocket(wsUrl.toString());
    let rawModeEnabled = false;

    const teardownRawMode = () => {
      if (rawModeEnabled && process.stdin.isTTY) {
        process.stdin.setRawMode(false);
        rawModeEnabled = false;
      }
    };

    const send = (msg: terminal.IClientMessage) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(terminal.ClientMessage.encode(msg).finish());
      }
    };

    const setupRawMode = () => {
      if (process.stdin.isTTY) {
        rawModeEnabled = true;
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', (data) => {
          send({ ptyInput: { data: data.toString() } });
        });

        const onResize = () => {
          send({
            ptyResize: {
              cols: process.stdout.columns || 80,
              rows: process.stdout.rows || 24,
            },
          });
        };

        process.stdout.on('resize', onResize);
        onResize();
        return;
      }

      this.warn('stdin is not a TTY; forwarding piped input only.');
      process.stdin.on('data', (data) => {
        send({ ptyInput: { data: data.toString() } });
      });
    };

    ws.on('open', () => {
      this.log('Connected to relay. Authenticating...');
      send({ authRequest: { hostId: flags.hostId, token } });
    });

    ws.on('message', (data: Buffer) => {
      try {
        const serverMessage = terminal.ServerMessage.decode(new Uint8Array(data));

        if (serverMessage.authResponse) {
          if (!serverMessage.authResponse.ok) {
            this.error(`Authentication failed: ${serverMessage.authResponse.error}`);
          }

          this.log('Authenticated successfully.');
          setupRawMode();
          return;
        }

        if (serverMessage.registerHostResponse) {
          if (!serverMessage.registerHostResponse.ok) {
            this.error(`Authentication failed: ${serverMessage.registerHostResponse.error}`);
          }

          this.log('Authenticated successfully.');
          setupRawMode();
          return;
        }

        if (serverMessage.ptyOutput) {
          process.stdout.write(serverMessage.ptyOutput.data || '');
          return;
        }

        if (serverMessage.ptyExit) {
          this.log(`\n[Remote process exited with code ${serverMessage.ptyExit.code}]`);
          ws.close();
          return;
        }

        if (serverMessage.systemMessage) {
          this.log(`\n[System] ${serverMessage.systemMessage.message}`);
          return;
        }

        if (serverMessage.errorMessage) {
          this.warn(`\n[Error] ${serverMessage.errorMessage.message}`);
        }
      } catch {
        this.warn('Received unreadable message from relay');
      }
    });

    ws.on('error', (error) => {
      teardownRawMode();
      this.error(`WebSocket error: ${error.message}`);
    });

    ws.on('close', () => {
      teardownRawMode();
      this.log('Disconnected from relay.');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      teardownRawMode();
      ws.close();
    });
  }

  private async issueClientToken(server: string, hostId: string, password: string) {
    const response = await fetch(new URL(`/api/hosts/${hostId}/client-token`, server), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      this.error(payload.error || `Failed to issue client token (${response.status})`);
    }

    const payload = (await response.json()) as ClientTokenResponse;
    return payload.token;
  }
}

import { Command, Flags } from '@oclif/core';
import { WebSocket } from 'ws';
import { terminal } from '@terminal-tool/protocol';

export default class Client extends Command {
  static description = 'Connect to a remote terminal host';

  static flags = {
    server: Flags.string({ char: 's', description: 'Relay server URL', required: true }),
    hostId: Flags.string({ char: 'i', description: 'Host ID to connect to', required: true }),
    password: Flags.string({ char: 'p', description: 'Admin password for token issuance', required: true }),
    token: Flags.string({ char: 't', description: 'JWT token (if already have one)' }),
  };

  async run() {
    const { flags } = await this.parse(Client);

    const wsUrl = new URL(flags.server);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl.pathname = '/ws/client';

    const ws = new WebSocket(wsUrl.toString());

    const send = (msg: terminal.IClientMessage) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(terminal.ClientMessage.encode(msg).finish());
      }
    };

    const setupRawMode = () => {
       if (process.stdin.isTTY) {
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
          onResize(); // Initial resize
       } else {
          this.warn('Stdin is not a TTY. Interaction will be limited.');
          process.stdin.on('data', (data) => {
             send({ ptyInput: { data: data.toString() } });
          });
       }
    };

    ws.on('open', () => {
      this.log('Connected to relay. Authenticating...');
      if (flags.token) {
         send({ authRequest: { hostId: flags.hostId, token: flags.token } });
      } else {
         send({ registerHost: { hostId: flags.hostId, password: flags.password } });
      }
    });

    ws.on('message', (data: Buffer) => {
       try {
          const serverMsg = terminal.ServerMessage.decode(new Uint8Array(data));
          
          if (serverMsg.registerHostResponse) {
             if (serverMsg.registerHostResponse.ok) {
                this.log(`Authenticated! Token: ${serverMsg.registerHostResponse.token}`);
                setupRawMode();
             } else {
                this.error(`Auth failed: ${serverMsg.registerHostResponse.error}`);
             }
             return;
          }

          if (serverMsg.authResponse) {
             if (serverMsg.authResponse.ok) {
                this.log('Authenticated successfully.');
                setupRawMode();
             } else {
                this.error(`Token auth failed: ${serverMsg.authResponse.error}`);
             }
             return;
          }

          if (serverMsg.ptyOutput) {
             process.stdout.write(serverMsg.ptyOutput.data || '');
             return;
          }

          if (serverMsg.ptyExit) {
             this.log(`\n[Remote process exited with code ${serverMsg.ptyExit.code}]`);
             ws.close();
             return;
          }

          if (serverMsg.systemMessage) {
             this.log(`\n[System] ${serverMsg.systemMessage.message}`);
             return;
          }

          if (serverMsg.errorMessage) {
             this.warn(`\n[Error] ${serverMsg.errorMessage.message}`);
             return;
          }
       } catch { /* Ignore */ }
    });

    ws.on('error', (err) => {
       if (process.stdin.isTTY) process.stdin.setRawMode(false);
       this.error(`WebSocket error: ${err.message}`);
    });

    ws.on('close', () => {
       if (process.stdin.isTTY) process.stdin.setRawMode(false);
       this.log('Disconnected from relay.');
       process.exit(0);
    });

    process.on('SIGINT', () => {
       ws.close();
    });
  }
}

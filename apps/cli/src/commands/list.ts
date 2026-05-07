import { Command, Flags, ux } from '@oclif/core';

interface HostSummary {
  hostId: string;
  online: boolean;
  clients: number;
  settings: {
    displayName: string;
    notes?: string;
  };
  isAdmin: boolean;
  screenActive: boolean;
  adminActive: boolean;
}

export default class List extends Command {
  static description = 'List all available terminal hosts on the relay server';

  static flags = {
    server: Flags.string({ char: 's', description: 'Relay server URL', default: 'https://terminal-tool.onrender.com' }),
    json: Flags.boolean({ description: 'Output in JSON format' }),
  };

  async run() {
    const { flags } = await this.parse(List);

    try {
      const response = await fetch(new URL('/api/hosts', flags.server));
      if (!response.ok) {
        this.error(`Failed to fetch hosts: ${response.statusText}`);
      }

      const { items } = (await response.json()) as { items: HostSummary[] };

      if (flags.json) {
        this.log(JSON.stringify(items, null, 2));
        return;
      }

      if (items.length === 0) {
        this.log('No hosts available.');
        return;
      }

      ux.table(items, {
        hostId: {
          header: 'Host ID',
          minWidth: 15,
        },
        name: {
          header: 'Name',
          get: (row) => row.settings.displayName || row.hostId,
        },
        status: {
          header: 'Status',
          get: (row) => (row.online ? '🟢 Online' : '🔴 Offline'),
        },
        clients: {
          header: 'Clients',
          get: (row) => row.clients.toString(),
        },
        features: {
          header: 'Features',
          get: (row) => {
            const features = [];
            if (row.adminActive) features.push('Shield');
            if (row.screenActive) features.push('Monitor');
            return features.join(', ') || '-';
          },
        },
      });
    } catch (error) {
      this.error(`Error connecting to relay server: ${(error as Error).message}`);
    }
  }
}

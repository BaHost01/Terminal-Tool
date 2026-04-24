import { startTransition, useEffect, useRef, useState } from 'react';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal as XTerm } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { terminal as protocol } from '@terminal-tool/protocol';
import {
  Activity,
  KeyRound,
  MonitorSmartphone,
  RefreshCcw,
  Save,
  ShieldCheck,
  TerminalSquare,
  Wifi,
} from 'lucide-react';

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error' | 'disconnected';

interface HostSettings {
  displayName: string;
  notes: string;
  readOnly: boolean;
  welcomeMessage: string;
  preferredShell: string;
  preferredCwd: string;
}

interface HostItem {
  hostId: string;
  online: boolean;
  clients: number;
  createdAt: string;
  lastSeenAt: string | null;
  lastClientAt: string | null;
  settings: HostSettings;
}

interface HostsResponse {
  items: HostItem[];
}

interface HostResponse {
  item: HostItem;
}

interface TokenResponse {
  token: string;
  host: HostItem;
}

interface SessionState {
  server: string;
  hostId: string;
  displayName: string;
  token: string;
}

function getDefaultServer() {
  if (typeof window === 'undefined') {
    return 'http://localhost:3000';
  }

  return window.location.origin.startsWith('http')
    ? window.location.origin
    : 'http://localhost:3000';
}

function formatStamp(value: string | null) {
  if (!value) {
    return 'Never';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function StatusPill({ online, readOnly }: { online: boolean; readOnly: boolean }) {
  return (
    <div className="status-row">
      <span className={`status-pill ${online ? 'status-pill-online' : 'status-pill-offline'}`}>
        {online ? 'Online' : 'Offline'}
      </span>
      {readOnly ? <span className="status-pill status-pill-readonly">Read-only</span> : null}
    </div>
  );
}

function TerminalSession({
  session,
  onClose,
}: {
  session: SessionState;
  onClose: () => void;
}) {
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<XTerm | null>(null);
  const [status, setStatus] = useState<ConnectionState>('connecting');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!terminalContainerRef.current) {
      return;
    }

    const terminal = new XTerm({
      cursorBlink: true,
      convertEol: true,
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 14,
      theme: {
        background: '#06131d',
        foreground: '#d3f6ff',
        cursor: '#7af0ff',
        selectionBackground: '#225264',
      },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(terminalContainerRef.current);
    fitAddon.fit();
    terminalRef.current = terminal;

    const wsUrl = new URL(session.server);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl.pathname = '/ws/client';
    const ws = new WebSocket(wsUrl);

    const send = (message: protocol.IClientMessage) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(protocol.ClientMessage.encode(message).finish());
      }
    };

    const handleResize = () => {
      fitAddon.fit();
      send({
        ptyResize: {
          cols: terminal.cols,
          rows: terminal.rows,
        },
      });
    };

    ws.onopen = () => {
      setStatus('connecting');
      terminal.writeln('\x1b[36m[relay connected]\x1b[0m');
      send({
        authRequest: {
          hostId: session.hostId,
          token: session.token,
        },
      });
    };

    ws.onmessage = async (event) => {
      const data = new Uint8Array(await event.data.arrayBuffer());

      try {
        const message = protocol.ServerMessage.decode(data);
        if (message.authResponse) {
          if (!message.authResponse.ok) {
            setStatus('error');
            setError(message.authResponse.error || 'Authentication failed');
            terminal.writeln(`\x1b[31m[auth failed] ${message.authResponse.error}\x1b[0m`);
            return;
          }

          setStatus('connected');
          terminal.writeln(`\x1b[32m[connected to ${session.displayName}]\x1b[0m`);
          handleResize();
          return;
        }

        if (message.ptyOutput) {
          terminal.write(message.ptyOutput.data || '');
          return;
        }

        if (message.systemMessage) {
          terminal.writeln(`\r\n\x1b[34m[system] ${message.systemMessage.message}\x1b[0m`);
          return;
        }

        if (message.errorMessage) {
          terminal.writeln(`\r\n\x1b[31m[relay] ${message.errorMessage.message}\x1b[0m`);
          return;
        }

        if (message.ptyExit) {
          terminal.writeln(`\r\n\x1b[33m[process exited ${message.ptyExit.code}]\x1b[0m`);
        }
      } catch (decodeError) {
        console.error('Failed to decode relay message', decodeError);
      }
    };

    ws.onerror = () => {
      setStatus('error');
      setError('WebSocket connection error');
    };

    ws.onclose = () => {
      setStatus('disconnected');
      terminal.writeln('\r\n\x1b[31m[relay disconnected]\x1b[0m');
    };

    const dataDisposable = terminal.onData((value) => {
      send({ ptyInput: { data: value } });
    });
    const resizeDisposable = terminal.onResize(({ cols, rows }) => {
      send({ ptyResize: { cols, rows } });
    });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      dataDisposable.dispose();
      resizeDisposable.dispose();
      ws.close();
      terminal.dispose();
    };
  }, [session]);

  return (
    <section className="terminal-shell">
      <div className="terminal-toolbar">
        <div>
          <p className="eyebrow">Live session</p>
          <h3>{session.displayName}</h3>
        </div>
        <div className="terminal-actions">
          <span className={`status-pill status-pill-${status}`}>{status}</span>
          <button className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <div className="terminal-frame" ref={terminalContainerRef} />
      {status === 'error' && error ? <p className="terminal-error">{error}</p> : null}
    </section>
  );
}

export default function App() {
  const [server, setServer] = useState(getDefaultServer());
  const [password, setPassword] = useState('');
  const [hosts, setHosts] = useState<HostItem[]>([]);
  const [selectedHostId, setSelectedHostId] = useState('');
  const [loadingHosts, setLoadingHosts] = useState(false);
  const [message, setMessage] = useState('');
  const [session, setSession] = useState<SessionState | null>(null);
  const [saving, setSaving] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [draft, setDraft] = useState<HostSettings>({
    displayName: '',
    notes: '',
    readOnly: false,
    welcomeMessage: '',
    preferredShell: '',
    preferredCwd: '',
  });

  const selectedHost = hosts.find((host) => host.hostId === selectedHostId) || null;

  useEffect(() => {
    void refreshHosts();
  }, []);

  useEffect(() => {
    if (!selectedHost) {
      return;
    }

    setDraft(selectedHost.settings);
  }, [selectedHost]);

  async function refreshHosts() {
    setLoadingHosts(true);
    setMessage('');

    try {
      const response = await fetch(new URL('/api/hosts', server));
      if (!response.ok) {
        throw new Error(`Failed to load hosts (${response.status})`);
      }

      const payload = (await response.json()) as HostsResponse;
      setHosts(payload.items);

      if (!selectedHostId && payload.items[0]) {
        startTransition(() => {
          setSelectedHostId(payload.items[0].hostId);
        });
      }

      if (selectedHostId && !payload.items.some((item) => item.hostId === selectedHostId)) {
        startTransition(() => {
          setSelectedHostId(payload.items[0]?.hostId || '');
        });
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load hosts');
    } finally {
      setLoadingHosts(false);
    }
  }

  async function saveSettings() {
    if (!selectedHost) {
      setMessage('Select a host first.');
      return;
    }

    if (!password) {
      setMessage('Admin password is required to save settings.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const response = await fetch(new URL(`/api/hosts/${selectedHost.hostId}/settings`, server), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          ...draft,
        }),
      });

      const payload = (await response.json()) as HostResponse | { error?: string };
      if (!response.ok || !('item' in payload)) {
        throw new Error(('error' in payload && payload.error) || 'Failed to save settings');
      }

      setHosts((current) =>
        current.map((host) => (host.hostId === payload.item.hostId ? payload.item : host)),
      );
      setMessage(`Saved settings for ${payload.item.settings.displayName}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  async function openSession() {
    if (!selectedHost) {
      setMessage('Select a host first.');
      return;
    }

    if (!password) {
      setMessage('Admin password is required to issue a client token.');
      return;
    }

    setTokenLoading(true);
    setMessage('');
    try {
      const response = await fetch(
        new URL(`/api/hosts/${selectedHost.hostId}/client-token`, server),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        },
      );
      const payload = (await response.json()) as TokenResponse | { error?: string };
      if (!response.ok || !('token' in payload)) {
        throw new Error(('error' in payload && payload.error) || 'Failed to issue token');
      }

      setSession({
        server,
        hostId: selectedHost.hostId,
        displayName: payload.host.settings.displayName,
        token: payload.token,
      });
      setHosts((current) =>
        current.map((host) => (host.hostId === payload.host.hostId ? payload.host : host)),
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to open session');
    } finally {
      setTokenLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Terminal Tool / Rebuilt control plane</p>
          <h1>Manage hosts, ship tokens, and attach to live shells from one dashboard.</h1>
          <p className="hero-body">
            The original UI only handled one direct login path. This remake adds host discovery,
            stored settings, read-only sessions, and a terminal surface that fits the actual relay
            behavior.
          </p>
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <Wifi className="stat-icon" />
            <strong>{hosts.filter((host) => host.online).length}</strong>
            <span>Hosts online</span>
          </article>
          <article className="stat-card">
            <Activity className="stat-icon" />
            <strong>{hosts.reduce((sum, host) => sum + host.clients, 0)}</strong>
            <span>Client sessions</span>
          </article>
          <article className="stat-card">
            <ShieldCheck className="stat-icon" />
            <strong>{hosts.filter((host) => host.settings.readOnly).length}</strong>
            <span>Read-only hosts</span>
          </article>
        </div>
      </section>

      <section className="control-grid">
        <aside className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Relay access</p>
              <h2>Control surface</h2>
            </div>
          </div>

          <label className="field">
            <span>Relay server</span>
            <input value={server} onChange={(event) => setServer(event.target.value)} />
          </label>

          <label className="field">
            <span>Admin password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Required for tokens and settings"
            />
          </label>

          <div className="action-row">
            <button className="primary-button" onClick={() => void refreshHosts()} disabled={loadingHosts}>
              <RefreshCcw size={16} />
              {loadingHosts ? 'Refreshing...' : 'Refresh hosts'}
            </button>
          </div>

          {message ? <p className="inline-message">{message}</p> : null}

          <div className="host-list">
            {hosts.length === 0 ? <p className="empty-state">No hosts registered yet.</p> : null}
            {hosts.map((host) => (
              <button
                key={host.hostId}
                className={`host-card ${host.hostId === selectedHostId ? 'host-card-active' : ''}`}
                onClick={() => setSelectedHostId(host.hostId)}
              >
                <div className="host-card-top">
                  <div>
                    <strong>{host.settings.displayName}</strong>
                    <p>{host.hostId}</p>
                  </div>
                  <StatusPill online={host.online} readOnly={host.settings.readOnly} />
                </div>
                <div className="host-card-meta">
                  <span>{host.clients} clients</span>
                  <span>Last seen {formatStamp(host.lastSeenAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Host profile</p>
              <h2>{selectedHost?.settings.displayName || 'Select a host'}</h2>
            </div>
            <MonitorSmartphone className="header-icon" />
          </div>

          {selectedHost ? (
            <>
              <div className="details-grid">
                <div className="detail-card">
                  <span className="detail-label">Host ID</span>
                  <strong>{selectedHost.hostId}</strong>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Created</span>
                  <strong>{formatStamp(selectedHost.createdAt)}</strong>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Last client</span>
                  <strong>{formatStamp(selectedHost.lastClientAt)}</strong>
                </div>
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>Display name</span>
                  <input
                    value={draft.displayName}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, displayName: event.target.value }))
                    }
                  />
                </label>

                <label className="field">
                  <span>Preferred shell</span>
                  <input
                    value={draft.preferredShell}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, preferredShell: event.target.value }))
                    }
                    placeholder="/bin/bash"
                  />
                </label>

                <label className="field">
                  <span>Preferred working directory</span>
                  <input
                    value={draft.preferredCwd}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, preferredCwd: event.target.value }))
                    }
                    placeholder="/srv/app"
                  />
                </label>

                <label className="field">
                  <span>Welcome message</span>
                  <input
                    value={draft.welcomeMessage}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, welcomeMessage: event.target.value }))
                    }
                    placeholder="Maintenance host: read output before typing."
                  />
                </label>

                <label className="field field-full">
                  <span>Notes</span>
                  <textarea
                    value={draft.notes}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, notes: event.target.value }))
                    }
                    rows={4}
                  />
                </label>

                <label className="toggle-row field-full">
                  <input
                    type="checkbox"
                    checked={draft.readOnly}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, readOnly: event.target.checked }))
                    }
                  />
                  <div>
                    <strong>Read-only relay mode</strong>
                    <p>Keep the shell visible, but block client keystrokes and resizes.</p>
                  </div>
                </label>
              </div>

              <div className="action-row">
                <button className="secondary-button" onClick={() => void saveSettings()} disabled={saving}>
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save host settings'}
                </button>
                <button className="primary-button" onClick={() => void openSession()} disabled={tokenLoading}>
                  <KeyRound size={16} />
                  {tokenLoading ? 'Issuing token...' : 'Open terminal'}
                </button>
              </div>
            </>
          ) : (
            <p className="empty-state">Select a host from the left column to edit settings.</p>
          )}
        </section>
      </section>

      <section className="terminal-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Remote shell</p>
            <h2>Session runner</h2>
          </div>
          <TerminalSquare className="header-icon" />
        </div>

        {session ? (
          <TerminalSession session={session} onClose={() => setSession(null)} />
        ) : (
          <div className="terminal-placeholder">
            <p>Issue a client token from the host profile to start a session.</p>
          </div>
        )}
      </section>
    </main>
  );
}

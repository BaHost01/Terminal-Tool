import React, { useState, useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { terminal as protocol } from '@terminal-tool/protocol';
import { Monitor, Key, Link as LinkIcon, ShieldAlert, Terminal as TerminalIcon } from 'lucide-react';

// --- Types ---
interface AuthData {
  server: string;
  hostId: string;
  password?: string;
  token?: string;
}

// --- Components ---

const Login: React.FC<{ onLogin: (data: AuthData) => void }> = ({ onLogin }) => {
  const [server, setServer] = useState('http://localhost:3000');
  const [hostId, setHostId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 rounded-xl bg-slate-800 shadow-2xl border border-slate-700">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-600 rounded-lg mb-4">
            <TerminalIcon size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Terminal Tool</h1>
          <p className="text-slate-400 text-sm mt-1">Remote Access Dashboard v2</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin({ server, hostId, password }); }} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Relay Server</label>
            <div className="relative">
              <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" value={server} onChange={(e) => setServer(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="http://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Host ID</label>
            <div className="relative">
              <Monitor size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" value={hostId} onChange={(e) => setHostId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Unique host identifier"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Admin Password</label>
            <div className="relative">
              <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-4 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            Connect
          </button>
        </form>
      </div>
    </div>
  );
};

const TerminalView: React.FC<{ auth: AuthData; onDisconnect: () => void }> = ({ auth, onDisconnect }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('connecting');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize XTerm
    const xterm = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#0f172a', // slate-900
      },
    });
    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.open(terminalRef.current);
    fitAddon.fit();
    xtermRef.current = xterm;

    // Initialize WebSocket
    const wsUrl = new URL(auth.server);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl.pathname = '/ws/client';
    
    const ws = new WebSocket(wsUrl.toString());
    wsRef.current = ws;

    const send = (msg: protocol.IClientMessage) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(protocol.ClientMessage.encode(msg).finish());
      }
    };

    ws.onopen = () => {
      setStatus('connected');
      xterm.writeln('\x1b[32m[Connected to Relay]\x1b[0m');
      send({ registerHost: { hostId: auth.hostId, password: auth.password } });
    };

    ws.onmessage = async (event) => {
      const data = new Uint8Array(await event.data.arrayBuffer());
      try {
        const msg = protocol.ServerMessage.decode(data);
        if (msg.registerHostResponse) {
          if (msg.registerHostResponse.ok) {
            xterm.writeln(`\x1b[32m[Authenticated as client]\x1b[0m`);
          } else {
            setErrorMsg(msg.registerHostResponse.error || 'Registration failed');
            setStatus('error');
          }
        }
        if (msg.ptyOutput) {
          xterm.write(msg.ptyOutput.data || '');
        }
        if (msg.systemMessage) {
          xterm.writeln(`\x1b[34m[System] ${msg.systemMessage.message}\x1b[0m`);
        }
        if (msg.errorMessage) {
          xterm.writeln(`\x1b[31m[Error] ${msg.errorMessage.message}\x1b[0m`);
        }
        if (msg.ptyExit) {
          xterm.writeln(`\n\x1b[33m[Remote process exited with code ${msg.ptyExit.code}]\x1b[0m`);
        }
      } catch (e) {
        console.error('Failed to decode message', e);
      }
    };

    ws.onclose = () => {
      setStatus('disconnected');
      xterm.writeln('\n\x1b[31m[Disconnected from Relay]\x1b[0m');
    };

    ws.onerror = (err) => {
      console.error('WS Error', err);
      setStatus('error');
      setErrorMsg('WebSocket connection error');
    };

    xterm.onData((data) => {
      send({ ptyInput: { data } });
    });

    xterm.onResize(({ cols, rows }) => {
      send({ ptyResize: { cols, rows } });
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ws.close();
      xterm.dispose();
    };
  }, [auth]);

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <header className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <TerminalIcon size={20} className="text-blue-500" />
          <h2 className="font-bold">Session: <span className="text-slate-400 font-mono">{auth.hostId}</span></h2>
          <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
        </div>
        <button 
          onClick={onDisconnect}
          className="bg-slate-700 hover:bg-red-600/20 hover:text-red-500 text-slate-300 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
        >
          Disconnect
        </button>
      </header>
      
      <main className="flex-1 overflow-hidden p-4 relative">
        <div ref={terminalRef} className="h-full w-full rounded-lg overflow-hidden border border-slate-700 bg-black shadow-inner" />
        
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-slate-800 p-8 rounded-xl border border-red-500/30 shadow-2xl max-w-sm text-center">
              <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Connection Error</h3>
              <p className="text-slate-400 mb-6">{errorMsg}</p>
              <button onClick={onDisconnect} className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-bold">Return to Login</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthData | null>(null);

  return (
    <div className="min-h-screen">
      {!auth ? (
        <Login onLogin={setAuth} />
      ) : (
        <TerminalView auth={auth} onDisconnect={() => setAuth(null)} />
      )}
    </div>
  );
};

export default App;

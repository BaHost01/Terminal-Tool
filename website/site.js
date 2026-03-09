const healthElement = document.getElementById("health");
const hostCountElement = document.getElementById("host-count");
const updatedAtElement = document.getElementById("updated-at");
const pingElement = document.getElementById("ping-ms");
const tosListElement = document.getElementById("tos-list");

const terminalForm = document.getElementById("terminal-form");
const commandForm = document.getElementById("command-form");
const disconnectButton = document.getElementById("disconnect");
const statusElement = document.getElementById("terminal-status");
const hostSettingsElement = document.getElementById("host-settings");
const outputElement = document.getElementById("terminal-output");
const hostIdInput = document.getElementById("host-id");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const acceptTosInput = document.getElementById("accept-tos");
const commandInput = document.getElementById("command-input");
const sendCommandButton = document.getElementById("send-command");
const quickActions = document.getElementById("quick-actions");

let socket = null;

function formatTime(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
}

function setTerminalEnabled(enabled) {
  commandInput.disabled = !enabled;
  sendCommandButton.disabled = !enabled;

  hostIdInput.disabled = enabled;
  usernameInput.disabled = enabled;
  passwordInput.disabled = enabled;
  acceptTosInput.disabled = enabled;
}

function appendOutput(text) {
  outputElement.textContent += text;
  outputElement.scrollTop = outputElement.scrollHeight;
}

function resetConnectionState() {
  if (socket) {
    socket.onclose = null;
    socket.close();
    socket = null;
  }
  setTerminalEnabled(false);
}

function wsBase() {
  return window.location.protocol === "https:" ? "wss" : "ws";
}

function describeSettings(settings = {}) {
  const mode = settings.performanceMode || "balanced";
  const uiAllowed = settings.allowUiViewing ? "UI view: allowed" : "UI view: blocked";
  const termux = settings.termuxX11Enabled ? "Termux X11: enabled" : "Termux X11: disabled";
  return `Mode: ${mode} · ${uiAllowed} · ${termux}`;
}

async function loadHealth() {
  const started = performance.now();

  try {
    const response = await fetch("/health");
    const data = await response.json();
    const ping = Math.max(1, Math.round(performance.now() - started));

    healthElement.textContent = data.ok ? "Online" : "Degraded";
    hostCountElement.textContent = `${data.hosts} registered`;
    pingElement.textContent = `${ping} ms`;
    updatedAtElement.textContent = formatTime(Date.now());
  } catch (error) {
    healthElement.textContent = "Unavailable";
    hostCountElement.textContent = "--";
    pingElement.textContent = "timeout";
    updatedAtElement.textContent = `Error: ${error.message}`;
  }
}

async function loadTos() {
  try {
    const response = await fetch("/api/tos");
    const data = await response.json();

    tosListElement.innerHTML = "";
    data.clauses.forEach((clause) => {
      const li = document.createElement("li");
      li.textContent = clause;
      tosListElement.appendChild(li);
    });
  } catch {
    tosListElement.innerHTML = "<li>Unable to load TOS right now.</li>";
  }
}

terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const hostId = hostIdInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!acceptTosInput.checked) {
    statusElement.textContent = "Accept Terms of Service before connecting.";
    return;
  }

  if (!hostId || !username || !password) {
    statusElement.textContent = "Host ID, username, and password are required.";
    return;
  }

  resetConnectionState();
  outputElement.textContent = "";
  hostSettingsElement.textContent = "Host settings unknown.";
  appendOutput(`Connecting to ${hostId}...\n`);

  const params = new URLSearchParams({ hostId, username, password });
  socket = new WebSocket(`${wsBase()}://${window.location.host}/ws/client?${params.toString()}`);

  socket.onopen = () => {
    statusElement.textContent = "Connected. Ready for commands.";
    setTerminalEnabled(true);
    commandInput.focus();
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);

      if (message.settings) {
        hostSettingsElement.textContent = describeSettings(message.settings);
      }

      if (message.type === "output") {
        appendOutput(message.data ?? "");
        return;
      }

      if (message.type === "error") {
        appendOutput(`\n[error] ${message.message}\n`);
        return;
      }

      if (message.type === "system") {
        appendOutput(`\n[system] ${message.message}\n`);
        return;
      }

      if (message.type === "exit") {
        appendOutput(`\n[exit] code=${message.code}\n`);
      }
    } catch {
      appendOutput(`\n[raw] ${event.data}\n`);
    }
  };

  socket.onerror = () => {
    statusElement.textContent = "WebSocket error while connecting terminal.";
  };

  socket.onclose = () => {
    statusElement.textContent = "Disconnected.";
    setTerminalEnabled(false);
    socket = null;
  };
});

function sendCommand(command) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    statusElement.textContent = "Not connected.";
    return;
  }
  socket.send(JSON.stringify({ type: "input", data: `${command}\n` }));
}

commandForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const command = commandInput.value;
  if (!command.trim()) return;

  sendCommand(command);
  commandInput.value = "";
});

quickActions.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-command]");
  if (!button) return;
  sendCommand(button.dataset.command);
});

disconnectButton.addEventListener("click", () => {
  resetConnectionState();
  statusElement.textContent = "Disconnected.";
});

loadHealth();
loadTos();
setInterval(loadHealth, 10000);
setTerminalEnabled(false);

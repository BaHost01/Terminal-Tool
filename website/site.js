const healthElement = document.getElementById("health");
const hostCountElement = document.getElementById("host-count");
const updatedAtElement = document.getElementById("updated-at");

const terminalForm = document.getElementById("terminal-form");
const commandForm = document.getElementById("command-form");
const disconnectButton = document.getElementById("disconnect");
const statusElement = document.getElementById("terminal-status");
const outputElement = document.getElementById("terminal-output");
const hostIdInput = document.getElementById("host-id");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const commandInput = document.getElementById("command-input");
const sendCommandButton = document.getElementById("send-command");

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

async function loadHealth() {
  try {
    const response = await fetch("/health");
    const data = await response.json();

    const relayLabel = data.ok ? "Online" : "Degraded";
    healthElement.textContent = relayLabel;
    hostCountElement.textContent = `${data.hosts} registered`;
    updatedAtElement.textContent = formatTime(Date.now());
  } catch (error) {
    healthElement.textContent = "Unavailable";
    hostCountElement.textContent = "--";
    updatedAtElement.textContent = `Error: ${error.message}`;
  }
}

terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const hostId = hostIdInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!hostId || !username || !password) {
    statusElement.textContent = "Host ID, username, and password are required.";
    return;
  }

  resetConnectionState();
  outputElement.textContent = "";
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

commandForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    statusElement.textContent = "Not connected.";
    return;
  }

  const command = commandInput.value;
  if (!command.trim()) return;

  socket.send(JSON.stringify({ type: "input", data: `${command}\n` }));
  commandInput.value = "";
});

disconnectButton.addEventListener("click", () => {
  resetConnectionState();
  statusElement.textContent = "Disconnected.";
});

loadHealth();
setInterval(loadHealth, 15000);
setTerminalEnabled(false);

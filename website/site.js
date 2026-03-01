const healthElement = document.getElementById("health");
const hostCountElement = document.getElementById("host-count");
const updatedAtElement = document.getElementById("updated-at");

function formatTime(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
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

loadHealth();
setInterval(loadHealth, 15000);

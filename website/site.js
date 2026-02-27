const healthElement = document.getElementById("health");

async function loadHealth() {
  try {
    const response = await fetch("/health");
    const data = await response.json();
    healthElement.textContent = `OK: ${data.ok} | Registered hosts: ${data.hosts}`;
  } catch (error) {
    healthElement.textContent = `Could not load health data: ${error.message}`;
  }
}

loadHealth();

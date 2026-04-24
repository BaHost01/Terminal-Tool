import asyncio
import os
import subprocess
import time
import signal
import sys

def run_relay():
    # Start the relay server from the root directory
    return subprocess.Popen(
        ["node", "dist/index.js"],
        cwd="apps/relay-server",
        env={**os.environ, "PORT": "3005", "ADMIN_PASSWORD": "test"}
    )

async def test_connection():
    print("Starting integration test...")
    relay = run_relay()
    time.sleep(3) # Give relay time to start

    try:
        # Start Host
        print("Starting host...")
        host_proc = subprocess.Popen(
            [sys.executable, "-m", "terminal_tool_py", "host", "--server", "http://localhost:3005", "--host-id", "test-integration", "--password", "test", "--no-discord"],
            cwd="Python-Version",
            env={**os.environ, "PYTHONPATH": "src"}
        )
        time.sleep(2)

        # Start Client and try to capture output
        print("Starting client...")
        # We'll run the client for a few seconds and see if it authenticates
        client_proc = subprocess.Popen(
            [sys.executable, "-m", "terminal_tool_py", "client", "--server", "http://localhost:3005", "--host-id", "test-integration", "--password", "test"],
            cwd="Python-Version",
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env={**os.environ, "PYTHONPATH": "src"},
            text=True
        )

        # Wait for a bit to see if connection holds
        await asyncio.sleep(5)
        
        if client_proc.poll() is None:
            print("SUCCESS: Client and Host are connected.")
            client_proc.terminate()
            host_proc.terminate()
            return True
        else:
            _, err = client_proc.communicate()
            print(f"FAILURE: Client exited early. Error: {err}")
            return False

    finally:
        relay.terminate()
        relay.wait()

if __name__ == "__main__":
    success = asyncio.run(test_connection())
    sys.exit(0 if success else 1)

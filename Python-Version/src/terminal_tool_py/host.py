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
from typing import Dict

import websockets

from .api import update_host_settings
from .common import resolve_shell, to_websocket_url, get_hwid, get_public_ip
from .protocol import (
    ClientMessage,
    HostCapabilities,
    HostMessage,
    PtyExit,
    PtyOutput,
    RegisterHostRequest,
    RegisterHostResponse,
    ServerMessage,
    ToggleAdminStatus,
    ToggleScreenStatus,
    ScreenFrame,
    AuthRequest
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
        as_admin: bool = False
    ) -> None:
        self.client_id = client_id
        self.shell = shell
        self.cwd = cwd
        self.queue = queue
        self.as_admin = as_admin
        self.pid: int | None = None
        self.master_fd: int | None = None
        self.read_task: asyncio.Task[None] | None = None
        self.wait_task: asyncio.Task[None] | None = None

    async def start(self) -> None:
        # On Windows this would be different, on Unix we might use sudo for admin if configured
        actual_shell = self.shell
        if self.as_admin and os.name != 'nt':
            # Simplified: just try to use sudo for the shell if admin toggled
            # In a real app you'd want more robust permission handling
            actual_shell = f"sudo {self.shell}"

        pid, master_fd = pty.fork()
        if pid == 0:
            os.chdir(self.cwd)
            if self.as_admin and os.name != 'nt':
                os.execvpe("sudo", ["sudo", self.shell], os.environ.copy())
            else:
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
    hwid = get_hwid()
    ip = get_public_ip()
    
    # Track local state
    state = {
        "admin_enabled": False,
        "screen_enabled": False
    }

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
        # 1. Register or Authenticate with HWID+IP
        register = HostMessage(
            register_host=RegisterHostRequest(
                host_id=host_id, 
                password=args.password,
                hwid=hwid,
                ip=ip
            ),
        )
        await websocket.send(bytes(register))

        sessions: Dict[str, PtySession] = {}
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
                await websocket.send(bytes(message))

        async def screen_share_loop() -> None:
            # Requires pyautogui and pillow
            try:
                import pyautogui
                from io import BytesIO
            except ImportError:
                print("Screen share requested but pyautogui/pillow not installed", file=sys.stderr)
                return

            while True:
                if state["screen_enabled"]:
                    try:
                        screenshot = pyautogui.screenshot()
                        # Scale down for performance
                        screenshot.thumbnail((1280, 720))
                        img_byte_arr = BytesIO()
                        screenshot.save(img_byte_arr, format='JPEG', quality=70)
                        
                        frame = HostMessage(
                            screen_frame=ScreenFrame(
                                data=img_byte_arr.getvalue(),
                                width=screenshot.width,
                                height=screenshot.height
                            )
                        )
                        await websocket.send(bytes(frame))
                    except Exception as e:
                        print(f"Screen capture error: {e}", file=sys.stderr)
                await asyncio.sleep(0.5) # ~2 FPS for basic sharing

        sender_task = asyncio.create_task(sender_loop())
        screen_task = asyncio.create_task(screen_share_loop())

        try:
            async for payload in websocket:
                client_message = ClientMessage().parse(payload)
                
                # Handle Pty Input/Resize
                if client_message.client_id and (client_message.pty_input or client_message.pty_resize):
                    session = sessions.get(client_message.client_id)
                    if session is None:
                        session = PtySession(
                            client_id=client_message.client_id,
                            shell=shell,
                            cwd=args.cwd,
                            queue=queue,
                            as_admin=state["admin_enabled"]
                        )
                        await session.start()
                        sessions[client_message.client_id] = session

                    if client_message.pty_input:
                        session.write(client_message.pty_input.data)
                    elif client_message.pty_resize:
                        session.resize(client_message.pty_resize.cols, client_message.pty_resize.rows)
                    continue

                # Handle Server Responses/Messages
                server_message = ServerMessage().parse(payload)
                if server_message.register_host_response:
                    resp = server_message.register_host_response
                    if resp.ok:
                        print(f"Host online! Token: {resp.token}")
                        # We could save token to a file here
                    else:
                        print(f"Registration failed: {resp.error}")
                        return 1

                if server_message.system_message:
                    msg = server_message.system_message.message
                    print(f"[System] {msg}")
                    
                    # Simple local command listener for host toggles
                    # In a real app you'd use a local UI or keyboard hooks
                    if "TOGGLE_ADMIN" in msg:
                        state["admin_enabled"] = not state["admin_enabled"]
                        await websocket.send(bytes(HostMessage(toggle_admin=ToggleAdminStatus(enabled=state["admin_enabled"]))))
                    if "TOGGLE_SCREEN" in msg:
                        state["screen_enabled"] = not state["screen_enabled"]
                        await websocket.send(bytes(HostMessage(toggle_screen=ToggleScreenStatus(enabled=state["screen_enabled"]))))

        finally:
            sender_task.cancel()
            screen_task.cancel()
            for session in sessions.values():
                session.close()

    return 0

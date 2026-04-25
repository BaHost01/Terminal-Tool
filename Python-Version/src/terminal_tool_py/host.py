from __future__ import annotations

import asyncio
import contextlib
import fcntl
import os
import signal
import struct
import sys
import termios
from dataclasses import dataclass
from typing import Dict, Any

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

# Cross-platform PTY handling
IS_WINDOWS = os.name == 'nt'

if not IS_WINDOWS:
    import pty
else:
    try:
        from winpty import PtyProcess as WinPtyProcess
    except ImportError:
        WinPtyProcess = None

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
        self.win_proc: Any = None
        self.read_task: asyncio.Task[None] | None = None
        self.wait_task: asyncio.Task[None] | None = None

    async def start(self) -> None:
        if IS_WINDOWS:
            await self._start_windows()
        else:
            await self._start_posix()

    async def _start_windows(self) -> None:
        if WinPtyProcess is None:
            await self.queue.put(SessionEnvelope(
                kind="output", 
                client_id=self.client_id, 
                data="\r\n[error] pywinpty not installed. Run: pip install terminal-tool-py[windows]\r\n"
            ))
            return

        # Windows Admin handling would use runas, but winpty doesn't support it directly easily
        # For now we spawn the shell normally
        self.win_proc = WinPtyProcess.spawn(self.shell, cwd=self.cwd)
        self.read_task = asyncio.create_task(self._read_loop_windows())
        self.wait_task = asyncio.create_task(self._wait_loop_windows())

    async def _start_posix(self) -> None:
        import pty
        pid, master_fd = pty.fork()
        if pid == 0:
            os.chdir(self.cwd)
            if self.as_admin:
                os.execvpe("sudo", ["sudo", self.shell], os.environ.copy())
            else:
                os.execvpe(self.shell, [self.shell], os.environ.copy())

        self.pid = pid
        self.master_fd = master_fd
        self.read_task = asyncio.create_task(self._read_loop_posix())
        self.wait_task = asyncio.create_task(self._wait_loop_posix())

    async def _read_loop_posix(self) -> None:
        assert self.master_fd is not None
        try:
            while True:
                data = await asyncio.to_thread(os.read, self.master_fd, 4096)
                if not data:
                    break
                await self.queue.put(
                    SessionEnvelope(kind="output", client_id=self.client_id, data=data.decode(errors="ignore"))
                )
        except OSError:
            pass

    async def _read_loop_windows(self) -> None:
        try:
            while self.win_proc and self.win_proc.isalive():
                data = await asyncio.to_thread(self.win_proc.read, 4096)
                if not data:
                    break
                await self.queue.put(
                    SessionEnvelope(kind="output", client_id=self.client_id, data=data)
                )
        except Exception:
            pass

    async def _wait_loop_posix(self) -> None:
        assert self.pid is not None
        try:
            _, status = await asyncio.to_thread(os.waitpid, self.pid, 0)
            code = os.waitstatus_to_exitcode(status)
        except ChildProcessError:
            code = 0
        await self.queue.put(SessionEnvelope(kind="exit", client_id=self.client_id, code=code))
        self.close()

    async def _wait_loop_windows(self) -> None:
        while self.win_proc and self.win_proc.isalive():
            await asyncio.sleep(0.1)
        code = self.win_proc.get_exitstatus() if self.win_proc else 0
        await self.queue.put(SessionEnvelope(kind="exit", client_id=self.client_id, code=code))
        self.close()

    def write(self, data: str) -> None:
        if IS_WINDOWS:
            if self.win_proc: self.win_proc.write(data)
        else:
            if self.master_fd is not None: os.write(self.master_fd, data.encode())

    def resize(self, cols: int, rows: int) -> None:
        if IS_WINDOWS:
            if self.win_proc: self.win_proc.set_size(cols, rows)
        else:
            if self.master_fd is None: return
            size = struct.pack("HHHH", rows, cols, 0, 0)
            fcntl.ioctl(self.master_fd, termios.TIOCSWINSZ, size)

    def close(self) -> None:
        if IS_WINDOWS:
            if self.win_proc:
                self.win_proc.terminate()
                self.win_proc = None
        else:
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
    host_id = args.host_id or f"{os.uname().nodename.lower() if hasattr(os, 'uname') else os.environ.get('COMPUTERNAME', 'host').lower()}-{os.getpid()}"
    hwid = get_hwid()
    ip = get_public_ip()
    
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
            try:
                import pyautogui
                from io import BytesIO
            except ImportError:
                return

            while True:
                if state["screen_enabled"]:
                    try:
                        screenshot = pyautogui.screenshot()
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
                    except Exception:
                        pass
                await asyncio.sleep(0.5)

        sender_task = asyncio.create_task(sender_loop())
        screen_task = asyncio.create_task(screen_share_loop())

        try:
            async for payload in websocket:
                client_message = ClientMessage().parse(payload)
                
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

                server_message = ServerMessage().parse(payload)
                if server_message.register_host_response:
                    resp = server_message.register_host_response
                    if resp.ok:
                        print(f"Host online! Token: {resp.token}")
                    else:
                        print(f"Registration failed: {resp.error}")
                        return 1

                if server_message.system_message:
                    msg = server_message.system_message.message
                    if "TOGGLE_ADMIN" in msg:
                        state["admin_enabled"] = not state["admin_enabled"]
                        print(f"[System] Admin mode now: {state['admin_enabled']}. Restarting active sessions...")
                        
                        # Restart all active sessions with the new privilege level
                        for client_id, session in sessions.items():
                            session.close()
                            new_session = PtySession(
                                client_id=client_id,
                                shell=shell,
                                cwd=args.cwd,
                                queue=queue,
                                as_admin=state["admin_enabled"]
                            )
                            await new_session.start()
                            sessions[client_id] = new_session
                        
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

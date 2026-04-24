from __future__ import annotations

import asyncio
import contextlib
import shutil
import signal
import sys
import termios
import tty

import websockets

from .api import issue_client_token
from .common import to_websocket_url
from .protocol import AuthRequest, ClientMessage, PtyInput, PtyResize, ServerMessage


async def run_client(args) -> int:
    token = args.token
    if not token:
        token = issue_client_token(args.server, args.host_id, args.password)

    ws_url = to_websocket_url(args.server, "/ws/client")
    async with websockets.connect(ws_url, max_size=1024 * 1024) as websocket:
        auth = ClientMessage(auth_request=AuthRequest(host_id=args.host_id, token=token))
        await websocket.send(auth.SerializeToString())

        original_attrs = None
        reader_task = None
        resize_handler = None

        async def send_resize() -> None:
            if not sys.stdout.isatty():
                return
            size = shutil.get_terminal_size(fallback=(80, 24))
            message = ClientMessage(
                pty_resize=PtyResize(cols=size.columns, rows=size.lines),
            )
            await websocket.send(message.SerializeToString())

        async def stdin_pump() -> None:
            while True:
                data = await asyncio.to_thread(sys.stdin.buffer.read1, 1024)
                if not data:
                    return
                message = ClientMessage(pty_input=PtyInput(data=data.decode(errors="ignore")))
                await websocket.send(message.SerializeToString())

        try:
            if sys.stdin.isatty():
                original_attrs = termios.tcgetattr(sys.stdin.fileno())
                tty.setraw(sys.stdin.fileno())
                reader_task = asyncio.create_task(stdin_pump())

                def on_resize(*_: object) -> None:
                    asyncio.create_task(send_resize())

                resize_handler = on_resize
                signal.signal(signal.SIGWINCH, on_resize)
            else:
                reader_task = asyncio.create_task(stdin_pump())

            await send_resize()

            async for payload in websocket:
                message = ServerMessage()
                message.ParseFromString(payload)

                if message.HasField("auth_response"):
                    if not message.auth_response.ok:
                        print(
                            f"Authentication failed: {message.auth_response.error}",
                            file=sys.stderr,
                        )
                        return 1
                    continue

                if message.HasField("pty_output"):
                    sys.stdout.write(message.pty_output.data)
                    sys.stdout.flush()
                    continue

                if message.HasField("system_message"):
                    print(f"\n[System] {message.system_message.message}", file=sys.stderr)
                    continue

                if message.HasField("error_message"):
                    print(f"\n[Relay] {message.error_message.message}", file=sys.stderr)
                    continue

                if message.HasField("pty_exit"):
                    print(
                        f"\n[Remote process exited with code {message.pty_exit.code}]",
                        file=sys.stderr,
                    )
                    return 0
        finally:
            if reader_task:
                reader_task.cancel()
                with contextlib.suppress(asyncio.CancelledError):
                    await reader_task
            if original_attrs is not None:
                termios.tcsetattr(sys.stdin.fileno(), termios.TCSADRAIN, original_attrs)
            if resize_handler is not None:
                signal.signal(signal.SIGWINCH, signal.SIG_DFL)

    return 0

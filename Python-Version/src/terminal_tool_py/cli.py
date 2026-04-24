from __future__ import annotations

import argparse
import asyncio
import json
import sys

import requests
import websockets

from .api import list_hosts
from .client import run_client
from .host import run_host


def build_parser() -> argparse.ArgumentParser:
    default_server = "https://terminal-tool.onrender.com"
    parser = argparse.ArgumentParser(prog="term-start")
    subparsers = parser.add_subparsers(dest="command", required=True)

    hosts_parser = subparsers.add_parser("hosts", help="List relay hosts")
    hosts_parser.add_argument("--server", default=default_server)

    client_parser = subparsers.add_parser("client", help="Connect to a remote host")
    client_parser.add_argument("--server", default=default_server)
    client_parser.add_argument("--host-id", required=True)
    client_parser.add_argument("--password")
    client_parser.add_argument("--token")

    host_parser = subparsers.add_parser("host", help="Expose a local shell to the relay")
    host_parser.add_argument("--server", default=default_server)
    host_parser.add_argument("--host-id")
    host_parser.add_argument("--password", required=True)
    host_parser.add_argument("--shell")
    host_parser.add_argument("--cwd", default=".")
    host_parser.add_argument("--display-name")
    host_parser.add_argument("--notes")
    host_parser.add_argument("--welcome-message")
    host_parser.add_argument("--read-only", action="store_true")
    host_parser.add_argument("--no-discord", action="store_true", help="Disable Discord webhook notification")

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command == "host" and not args.no_discord:
        print("!" * 60)
        print("WARNING: Host registration will send a connection notification")
        print("to a public Discord webhook for terminal-tool monitoring.")
        print("Use --no-discord to disable this notification.")
        print("!" * 60)
        print()

    if args.command == "hosts":
        try:
            payload = list_hosts(args.server)
            print(json.dumps(payload, indent=2))
            return 0
        except requests.RequestException as error:
            print(f"Failed to reach relay: {error}", file=sys.stderr)
            return 1

    if args.command == "client":
        if not args.token and not args.password:
            parser.error("client requires --token or --password")
        try:
            return asyncio.run(run_client(args))
        except (requests.RequestException, websockets.WebSocketException, OSError) as error:
            print(f"Client failed: {error}", file=sys.stderr)
            return 1

    if args.command == "host":
        try:
            return asyncio.run(run_host(args))
        except (requests.RequestException, websockets.WebSocketException, OSError) as error:
            print(f"Host failed: {error}", file=sys.stderr)
            return 1

    parser.error(f"unsupported command: {args.command}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

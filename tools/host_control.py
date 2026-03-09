#!/usr/bin/env python3
"""Host control utility for Terminal Tool Relay.

Features:
- Register a host
- Update host settings (performance mode, low latency mode, UI visibility, Termux X11)
- View host metadata
- Read relay Terms of Service
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request


def request_json(url: str, method: str = "GET", payload: dict | None = None) -> dict:
    data = None
    headers = {"Accept": "application/json"}

    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    request = urllib.request.Request(url=url, data=data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            body = response.read().decode("utf-8")
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"HTTP {exc.code}: {body}") from exc
    except urllib.error.URLError as exc:
        raise SystemExit(f"Network error: {exc}") from exc


def build_settings(args: argparse.Namespace) -> dict:
    settings = {
        "performanceMode": args.performance_mode,
        "lowLatencyMode": args.low_latency,
        "allowUiViewing": args.allow_ui_viewing,
        "termuxX11Enabled": args.termux_x11,
    }
    return settings


def register_host(args: argparse.Namespace) -> None:
    payload = {
        "hostId": args.host_id,
        "username": args.username,
        "password": args.password,
        "settings": build_settings(args),
    }
    result = request_json(f"{args.server}/api/register-host", method="POST", payload=payload)
    print(json.dumps(result, indent=2))


def update_settings(args: argparse.Namespace) -> None:
    if not args.host_id:
        raise SystemExit("--host-id is required for update-settings")

    payload = {
        "username": args.username,
        "password": args.password,
        "settings": build_settings(args),
    }
    url = f"{args.server}/api/hosts/{urllib.parse.quote(args.host_id)}/settings"
    result = request_json(url, method="PATCH", payload=payload)
    print(json.dumps(result, indent=2))


def host_info(args: argparse.Namespace) -> None:
    url = f"{args.server}/api/hosts/{urllib.parse.quote(args.host_id)}"
    result = request_json(url)
    print(json.dumps(result, indent=2))


def tos(args: argparse.Namespace) -> None:
    result = request_json(f"{args.server}/api/tos")
    print(json.dumps(result, indent=2))


def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Terminal Tool host settings controller")
    p.add_argument("--server", required=True, help="Relay base URL, e.g. http://127.0.0.1:3000")

    sub = p.add_subparsers(dest="cmd", required=True)

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--host-id", default="", help="Host ID (leave empty to auto-generate on register)")
    common.add_argument("--username", required=True)
    common.add_argument("--password", required=True)
    common.add_argument("--performance-mode", choices=["eco", "balanced", "turbo"], default="balanced")
    common.add_argument("--low-latency", action=argparse.BooleanOptionalAction, default=True)
    common.add_argument("--allow-ui-viewing", action=argparse.BooleanOptionalAction, default=False)
    common.add_argument("--termux-x11", action=argparse.BooleanOptionalAction, default=False)

    reg = sub.add_parser("register", parents=[common], help="Register a host")
    reg.set_defaults(func=register_host)

    upd = sub.add_parser("update-settings", parents=[common], help="Update existing host settings")
    upd.set_defaults(func=update_settings)

    info = sub.add_parser("host-info", help="Read host metadata")
    info.add_argument("--host-id", required=True)
    info.set_defaults(func=host_info)

    tos_parser = sub.add_parser("tos", help="Show relay Terms of Service")
    tos_parser.set_defaults(func=tos)

    return p


def main() -> None:
    args = parser().parse_args()
    args.server = args.server.rstrip("/")
    args.func(args)


if __name__ == "__main__":
    main()

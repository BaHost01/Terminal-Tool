from __future__ import annotations

import os
import shutil
from urllib.parse import urlparse, urlunparse


import uuid
import requests

def get_hwid() -> str:
    return str(uuid.getnode())

def get_public_ip() -> str:
    try:
        return requests.get("https://icanhazip.com", timeout=5).text.strip()
    except:
        return "127.0.0.1"


def to_websocket_url(server: str, path: str) -> str:
    parsed = urlparse(server)
    scheme = "wss" if parsed.scheme == "https" else "ws"
    return urlunparse((scheme, parsed.netloc, path, "", "", ""))


def resolve_shell(shell: str | None) -> str:
    if shell:
        return shell
    if os.name == 'nt':
        return "powershell.exe"
    return os.environ.get("SHELL") or shutil.which("bash") or shutil.which("sh") or "/bin/sh"

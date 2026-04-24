from __future__ import annotations

import os
import shutil
from urllib.parse import urlparse, urlunparse


def to_websocket_url(server: str, path: str) -> str:
    parsed = urlparse(server)
    scheme = "wss" if parsed.scheme == "https" else "ws"
    return urlunparse((scheme, parsed.netloc, path, "", "", ""))


def resolve_shell(shell: str | None) -> str:
    if shell:
        return shell
    return os.environ.get("SHELL") or shutil.which("bash") or shutil.which("sh") or "/bin/sh"

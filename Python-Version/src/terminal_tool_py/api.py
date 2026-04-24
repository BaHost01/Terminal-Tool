from __future__ import annotations

from typing import Any

import requests


def _url(server: str, path: str) -> str:
    return f"{server.rstrip('/')}{path}"


def list_hosts(server: str) -> list[dict[str, Any]]:
    response = requests.get(_url(server, "/api/hosts"), timeout=10)
    response.raise_for_status()
    payload = response.json()
    return payload.get("items", [])


def issue_client_token(server: str, host_id: str, password: str) -> str:
    response = requests.post(
        _url(server, f"/api/hosts/{host_id}/client-token"),
        json={"password": password},
        timeout=10,
    )
    response.raise_for_status()
    payload = response.json()
    return payload["token"]


def update_host_settings(
    server: str,
    host_id: str,
    password: str,
    *,
    display_name: str | None = None,
    notes: str | None = None,
    read_only: bool | None = None,
    welcome_message: str | None = None,
    preferred_shell: str | None = None,
    preferred_cwd: str | None = None,
) -> dict[str, Any]:
    body: dict[str, Any] = {"password": password}
    if display_name is not None:
        body["displayName"] = display_name
    if notes is not None:
        body["notes"] = notes
    if read_only is not None:
        body["readOnly"] = read_only
    if welcome_message is not None:
        body["welcomeMessage"] = welcome_message
    if preferred_shell is not None:
        body["preferredShell"] = preferred_shell
    if preferred_cwd is not None:
        body["preferredCwd"] = preferred_cwd

    response = requests.patch(
        _url(server, f"/api/hosts/{host_id}/settings"),
        json=body,
        timeout=10,
    )
    response.raise_for_status()
    payload = response.json()
    return payload["item"]

# Python Version

`Python-Version` contains the Python packaging target for Terminal Tool.

## Status

This package now includes:

- `term-start host` to expose a local shell to the relay
- `term-start client` to connect to a host through the relay
- `term-start hosts` to inspect registered hosts over the relay HTTP API

## Install

```bash
cd Python-Version
python3 -m pip install .
```

## Examples

```bash
term-start hosts --server http://localhost:3000
term-start host --server http://localhost:3000 --password admin --host-id demo-box
term-start client --server http://localhost:3000 --host-id demo-box --password admin
```

The Python package targets the same relay API and websocket protocol used by the TypeScript apps.

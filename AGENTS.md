# Repository Guidelines

## Project Structure & Module Organization
This repository is a `pnpm` monorepo for a terminal-sharing toolchain. Main apps live in `apps/`: `cli` for the Oclif command-line client, `relay-server` for the Express/WebSocket backend, and `web-ui` for the Vite/React frontend. Shared packages live in `packages/`: `protocol` contains protobuf schemas and generated bindings, and `config` holds shared TypeScript and Prettier settings. Build output is committed under `dist/`; treat it as generated and make source changes in `src/` or `schemas/` instead.

## Build, Test, and Development Commands
Install dependencies with `pnpm install` from the repo root. Use `pnpm build` to build every workspace, `pnpm lint` to run ESLint across app sources, and `pnpm dev` for workspace watch/dev scripts. Target a single package when needed:

- `pnpm --filter @terminal-tool/web-ui dev` runs the Vite frontend locally.
- `pnpm --filter @terminal-tool/relay-server dev` starts the relay server with `tsx`.
- `pnpm --filter @terminal-tool/cli build` compiles the CLI.
- `pnpm --filter @terminal-tool/protocol build` regenerates protobuf artifacts from `packages/protocol/schemas/*.proto`.

## Coding Style & Naming Conventions
TypeScript is strict (`strict: true`) and uses ES module syntax. Follow the shared Prettier preset in `packages/config/prettier-preset.json`: 2-space indentation, semicolons, single quotes, trailing commas, and 100-character lines. ESLint enforces unused-variable checks; prefix intentionally unused parameters with `_`. Keep React components in PascalCase (`App.tsx`), command files lowercase by command name (`src/commands/host.ts`), and avoid editing generated `dist/` files by hand.

## Testing Guidelines
There is no dedicated automated test suite committed yet. Until one is added, contributors should treat `pnpm build` and `pnpm lint` as the required validation baseline and verify changed apps locally when relevant. If you add tests, place them beside the source or in a `tests/` directory and name them `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit subjects such as `Add host settings API...` and `Improve Termux install handling...`. Use that style, keep each commit scoped to one change, and avoid vague messages like `fix stuff`. Pull requests should summarize the affected workspace(s), list validation performed, link any related issue, and include screenshots or terminal output when UI or CLI behavior changes.

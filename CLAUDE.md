# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Flatforge (`hub-meta` repo) is the infrastructure for a Flatpak app repository for
the Linux desktop: a Docker Compose stack (nginx + OSTree repo manager) plus a
React/Vite web frontend that lists submitted apps.

App submissions arrive via pull requests against the `new-sub` orphan branch in
this repo (files land under `apps/<AppID>/`). After acceptance, each app gets its
own repository at `flatforge-hub/<AppID>`; the `apps/` directory here retains the
accepted copies for the web listing.

## Architecture

Three independently-built pieces wired together by `docker-compose.yml`:

1. **`nginx/`** — static file server. Serves the OSTree repo (`./flatpak-repo` →
   `/repo`) and the built web frontend (`./web/dist` → `/`). Binds to
   `127.0.0.1:${HTTP_PORT}` by default; a host nginx is expected to reverse-proxy
   to it (see `docs/DOCKER.md` for the Cloudflare/host-nginx topology).

2. **`repo-manager/`** (`manage.py`) — a CLI run via `docker compose run --rm
   repo-manager <command>` that wraps `ostree`/`flatpak`/`gpg`: initializes the
   archive-mode OSTree repo, imports and GPG-signs built apps (`export-app`),
   regenerates the signed summary (`update-summary`), generates the
   `.flatpakrepo` subscription file, and creates the signing key (`gpg-init`).
   Commands are defined as `cmd_*` functions and wired via argparse subparsers.

3. **`web/`** — Vite + React + TypeScript + Tailwind site listing apps. Routing
   in `src/App.tsx` (`/`, `/app/:id`, `/submit`, `/about`). **Crucially, app data
   is not fetched at runtime** — `scripts/generate-app-data.cjs` runs as a
   pre-build/pre-dev step, reads every `apps/<AppID>/metadata.yaml`, and writes
   the aggregated result to `src/data/apps.json`, which the React app imports
   statically. The `App` shape is defined in `src/types.ts`. The web build runs
   in its own one-shot container (`web-builder`, profile `build`) with `apps/`
   mounted read-only and `APPS_DIR`/`VITE_DOMAIN` env vars passed through.

### Data flow for a new app submission

PR against `new-sub` → CI runs `check-sources` + build + AppStream validation →
core maintainer reviews → on acceptance, maintainer creates `flatforge-hub/<AppID>`
from the org template, copies the files in, and adds the app maintainer. The
submission branch is then deleted from this repo.

For accepted apps, the per-app repo's CI handles ongoing builds and deploy: on
push to `main`, CI builds the Flatpak, rsyncs the OSTree build repo to the VPS,
and runs `repo-manager export-app <AppID> <build-dir>` over SSH. The per-app
CI calls the reusable workflow at `flatforge-hub/.github`. Separately,
`apps/<AppID>/metadata.yaml` (kept in sync manually) feeds the web listing via
`generate-app-data.cjs`.

## Commands

### Web frontend (`cd web`)
```bash
npm install
npm run dev         # regenerates apps.json from ../apps, then starts Vite dev server
npm run build       # regenerate apps.json, typecheck (tsc -b), then vite build → dist/
npm run generate    # just regenerate src/data/apps.json from apps/*/metadata.yaml
npm run typecheck   # tsc -b only
```
Note: `generate-app-data.cjs` resolves `APPS_DIR` relative to itself if the env
var isn't set, so it works run directly from `web/` against the sibling `apps/`.

### Docker stack (from repo root)
```bash
docker compose --profile init run --rm gpg-init        # one-time: generate signing key
docker compose run --rm repo-manager <command>          # init-repo, export-app, update-summary, gen-flatpakrepo, list-keys
docker compose --profile build run --rm web-builder     # build web/dist
docker compose up -d nginx                              # serve
```
See `docs/DOCKER.md` for the full deployment runbook (backups, Cloudflare config,
troubleshooting).

### CI source-compliance check (run locally against a manifest)
```bash
pip install pyyaml
python .github/scripts/check-sources.py apps/<AppID>/<AppID>.json
```
This is what gates PRs in `.github/workflows/build.yml` (`check-sources` job,
matrixed over changed manifests). It enforces: OSI-approved/CC0/Unlicense SPDX
license in `metadata.yaml`, no binary-blob sources, no `type: dir` sources, and
warns on unpinned git refs / suspicious prebuilt-binary archive URLs / simple
buildsystems with no compile step. Edit `OSI_APPROVED`, `BINARY_*` constants, or
`COMPILER_PATTERNS` there to adjust what's flagged.

## Key conventions

- **App layout** (`apps/<AppID>/`): a flatpak-builder manifest
  (`<AppID>.json`/`.yaml`), AppStream `<AppID>.metainfo.xml`, and `metadata.yaml`
  (the web-listing schema — see `docs/SUBMIT.md` for the full field list,
  including the optional `ai_tools_used` disclosure field that drives the "AI"
  badge per `docs/POLICY.md`).
- **Sandbox/licensing policy** (`docs/POLICY.md`, `docs/SECURITY.md`): only
  OSI-approved/CC0/Unlicense licenses; `finish-args` are reviewed for least
  privilege (broad `--filesystem=host`, `--talk-name=*`, etc. are essentially
  never accepted) — keep this in mind when touching `check-sources.py` or any
  manifest-validation logic, since it encodes these policies.
- **CI deploy** lives in per-app repos (not here). It relies on three GitHub
  secrets: `SSH_KEY`, `SSH_HOST` (supports `host:port`), `SSH_USER`. The deploy
  step SSHes into the VPS and shells out to `docker compose run repo-manager
  export-app`. See `templates/org-github-repo/` for the reusable workflow.
- All repo-manager commands are environment-driven (`REPO_PATH`, `GNUPGHOME`,
  `GPG_KEY_ID`, `REPO_DEFAULT_BRANCH`, `DOMAIN`) — see `docker-compose.yml` for
  how `.env` values are threaded through.

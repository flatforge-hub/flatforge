# App submission and maintenance workflow

Inspired by Flathub's model.

## Repository layout

```
flatforge-hub/flatforge          ← hub-meta (this repo): submissions + infrastructure
flatforge-hub/org.example.MyApp  ← per-app repo, created after acceptance
flatforge-hub/org.another.App    ← etc.
```

## Submitting a new app

The submission target is an orphan branch `new-sub` in `flatforge-hub/flatforge`
(no history, no other apps — contributors only see their own files).

```bash
git clone --single-branch --branch new-sub \
    git@github.com:flatforge-hub/flatforge.git
cd flatforge
git checkout -b org.example.MyApp new-sub
# copy org.example.MyApp.json, org.example.MyApp.metainfo.xml, metadata.yaml
git push origin org.example.MyApp
# open PR against new-sub
```

CI runs `check-sources.py` + build on every PR targeting `new-sub`.

## After acceptance

1. Core maintainer creates `flatforge-hub/org.example.MyApp` from the org template repo.
2. App files are copied in; app maintainer gets write access.
3. Branch protection on `main` is configured (see below).
4. The submission branch is deleted from `flatforge-hub/flatforge`.

## Per-app repo: branch protection

```
# .github/CODEOWNERS
org.example.MyApp.json    @flatforge-hub/core
```

Rules on `main`:
- All changes require a PR (no direct push to `main`).
- CODEOWNERS review required for the flatpak-builder manifest (`*.json` / `*.yaml`) — this covers `finish-args` and all sandbox permissions.
- `metadata.yaml` and `*.metainfo.xml` auto-merge after CI passes.

In practice, routine updates (metadata, AppStream) merge automatically within
minutes. Manifest changes wait for a core maintainer — functionally equivalent
to the maintainer pushing directly for non-sensitive files.

## CI workflows

Current `build.yml` splits into two parts:

### 1. Submission workflow (`flatforge-hub/flatforge`)

Triggers on PRs targeting `new-sub` (not `main`). No deploy step.

```yaml
on:
  pull_request:
    branches: [new-sub]
    paths: ["apps/**"]
```

Jobs: `detect` → `check-sources` → `build`. Deploy is removed — it belongs
only in per-app repos.

### 2. Per-app reusable workflow (`flatforge-hub/.github`)

Stored once in the org-level repo; each app repo calls it with one line:

```yaml
jobs:
  check:
    uses: flatforge-hub/.github/.github/workflows/check-app.yml@main
```

Differences from the submission workflow:
- Manifest is at repo root (`org.example.MyApp.json`), not under `apps/<AppID>/`
- `detect` job looks for changed `.json`/`.yaml` files at root level
- `check-sources.py` path adjusts accordingly
- Deploy job is present — triggers on push to `main` (i.e. after PR merge)

`check-sources.py` itself does not change.

## Setting up the `new-sub` orphan branch (one-time)

```bash
git switch --orphan new-sub
git commit --allow-empty -m "submission base"
git push origin new-sub
```

## TODO (not yet implemented)

- [x] Create org template repo for per-app repos → `flatforge-hub/app-template`
- [x] Create `new-sub` orphan branch in `flatforge-hub/flatforge`
- [x] Deploy reusable workflow to `flatforge-hub/.github`
- [x] Update `docs/SUBMIT.md` to reflect the new submission workflow
- [ ] Decide: auto-merge bot (GitHub Actions) or manual merge by core maintainer
      for non-sensitive changes (`metadata.yaml`, `*.metainfo.xml`)

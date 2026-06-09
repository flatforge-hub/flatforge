# Submitting an App to Flatforge

## Repository layout

```
flatforge-hub/flatforge           ← this repo: submissions + infrastructure
flatforge-hub/org.example.MyApp   ← per-app repo, created after acceptance
```

New submissions go into this repo via the `new-sub` orphan branch. After
acceptance, your app gets its own repository where ongoing maintenance happens.

## Submitting a new app

```bash
git clone --single-branch --branch new-sub \
    git@github.com:flatforge-hub/flatforge.git
cd flatforge
git checkout -b org.example.MyApp
# add your three files under apps/org.example.MyApp/
git add apps/org.example.MyApp/
git push origin org.example.MyApp
# open a PR against the new-sub branch
```

Your PR must target **`new-sub`**, not `main`.

## Required files

```
apps/
  org.example.MyApp/
    org.example.MyApp.json          # flatpak-builder manifest (or .yaml) — docs.flatpak.org/en/latest/manifests.html
    org.example.MyApp.metainfo.xml  # AppStream metadata — freedesktop.org/software/appstream/docs
    metadata.yaml                   # Flatforge web listing metadata
```

### metadata.yaml schema

```yaml
id: org.example.MyApp          # must match manifest app-id
name: My App                   # display name
summary: Short one-line desc   # ≤ 80 characters
description: |                 # Markdown supported
  Longer description.
developer: Jane Doe
website: https://example.com
source: https://github.com/example/myapp  # public source repository or archive
license: GPL-3.0               # SPDX identifier — see spdx.org/licenses
icon: https://example.com/icon.png  # 256×256 or larger PNG/SVG
screenshots:
  - https://example.com/screenshot1.png
  - https://example.com/screenshot2.png
categories:
  - Utility                    # see specifications.freedesktop.org/menu-spec
ai_tools_used: "Claude Code"   # optional; omit if no AI tools used
```

`version` and `release_date` are read automatically from the `<releases>` element
in your `*.metainfo.xml` — do not duplicate them here. Example metainfo.xml entry:

```xml
<releases>
  <release version="1.0.0" date="2026-06-01"/>
</releases>
```

## What CI checks

Every PR to `new-sub` runs:

1. **Source compliance** — verifies your `metadata.yaml` license is OSI-approved
   and your manifest sources are not binary blobs or unreproducible paths.
2. **Build** — full `flatpak-builder` build inside the Flathub container.
3. **AppStream validation** — `appstreamcli validate` on your `*.metainfo.xml`.

## Test locally before opening a PR

```bash
# Build and lint
flatpak-builder --force-clean --repo /tmp/test-repo /tmp/build-dir \
  apps/org.example.MyApp/org.example.MyApp.json
flatpak-builder-lint manifest apps/org.example.MyApp/org.example.MyApp.json

# Source compliance (same check CI runs)
pip install pyyaml
python .github/scripts/check-sources.py \
  apps/org.example.MyApp/org.example.MyApp.json
```

## Review criteria

- OSI-approved open-source licence
- `source` field linking to the publicly accessible source repository or archive
- Valid AppStream metadata (icon, description, screenshots)
- Minimal sandbox permissions — no unnecessary `finish-args`
- App builds cleanly from the manifest
- No malware, spyware, or adware
- Name, icon, and description do not impersonate or imply affiliation with another project;
  unofficial wrappers must say so explicitly (e.g. "Unofficial …")

## After acceptance

A core maintainer will:

1. Create `flatforge-hub/org.example.MyApp` from the org template.
2. Copy your files in and grant you write access.
3. Delete your submission branch from this repo.

From that point on, updates go via PRs in your per-app repo. Manifest changes
(`*.json` / `*.yaml`) require a core maintainer review; `metadata.yaml` and
`*.metainfo.xml` auto-merge once CI passes.

## AI tools disclosure

If you used AI assistants, fill in `ai_tools_used` in `metadata.yaml` and
mention it in the PR description. Appreciated for transparency, not required.

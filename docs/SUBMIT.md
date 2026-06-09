# Submitting an App to Flatforge

## Repository layout

```
flatforge-hub/flatforge           ← this repo: submissions + infrastructure
flatforge-hub/org.example.MyApp   ← per-app repo, created after acceptance
```

New submissions go into this repo via the `new-sub` orphan branch. After
acceptance, your app gets its own repository where ongoing maintenance happens.

## Before you open a PR

- **One app per PR** — each submission PR must contain exactly one application.
- **Submission limit** — your GitHub account may have at most 2 open submission
  PRs at a time. A third PR will be closed automatically without review.
- **App ID** — you must own or control the namespace in your App ID before submitting.
  See [App ID](#app-id) below and [POLICY.md — App ID verification](POLICY.md#app-id-verification).

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

## App ID

Your App ID must be in reverse-DNS format and reflect a namespace you own or control.

| ID format | Requirement |
|---|---|
| `io.github.USERNAME.AppName` | Source URL in manifest must be under `github.com/USERNAME/` — CI verifies this automatically |
| `io.gitlab.USERNAME.AppName` | Source URL must be under `gitlab.com/USERNAME/` — CI verifies this automatically |
| `com.example.AppName` | Add a DNS TXT record `_flatforge.example.com TXT "github=USERNAME"` or a file at `https://example.com/.well-known/flatforge-verify` containing `github=USERNAME`; state the method in your PR description |
| `org.gnome.*`, `org.kde.*`, etc. | Contact a Flatforge maintainer for written approval before submitting |

See [POLICY.md — App ID verification](POLICY.md#app-id-verification) for the full rules,
including namespace squatting policy.

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
status: unmaintained           # optional; set when the app is no longer maintained
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

## Review timeline

Review is done on a volunteer basis. There is no guaranteed timeline; a submission
may take weeks or months and may require several rounds of back-and-forth with the
submitter. Expedited review cannot be demanded. A PR that receives no activity from
the submitter's side for 90 days will be closed as stale.

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

# Submitting an App to Flatforge

## Repository structure

There are two GitHub repositories:

| Repository | Purpose |
|---|---|
| `flatforge/hub-meta` | Infrastructure, web frontend, deployment |
| `flatforge/hub-apps` | App submissions — manifests, metadata |

Submit your app by opening a pull request against **`flatforge/hub-apps`**.

## Directory layout for your app

```
apps/
  org.example.MyApp/
    org.example.MyApp.json       # flatpak-builder manifest (or .yaml)
    org.example.MyApp.metainfo.xml  # AppStream metadata
    metadata.yaml                # Flatforge web listing metadata
```

### metadata.yaml schema

```yaml
id: org.example.MyApp           # Must match manifest app-id
name: My App                    # Display name
summary: Short one-line desc    # ≤ 80 characters
description: |                  # Markdown supported
  Longer description.
developer: Jane Doe
website: https://example.com
license: GPL-3.0                # SPDX identifier, must be OSI-approved
icon: https://example.com/icon.png   # 256×256 or larger PNG/SVG
screenshots:
  - https://example.com/ss1.png
categories:
  - Utility                     # See: https://specifications.freedesktop.org/menu-spec
ai_tools_used: "Claude Code"    # Optional; omit if no AI tools used
version: "1.0.0"
release_date: "2026-06-01"      # ISO 8601
```

## Submission steps

1. Fork `flatforge/hub-apps` on GitHub
2. Create a branch: `git checkout -b submit/org.example.MyApp`
3. Add your app directory under `apps/`
4. Test locally:
   ```bash
   flatpak-builder --force-clean --repo /tmp/test-repo /tmp/build-dir \
     apps/org.example.MyApp/org.example.MyApp.json
   flatpak-builder-lint manifest apps/org.example.MyApp/org.example.MyApp.json
   ```
5. Push and open a PR — GitHub Actions will build and lint automatically

## Review criteria

- OSI-approved open-source licence
- Valid AppStream metadata (icon, description, screenshots)
- Minimal sandbox permissions — no unnecessary `finish-args`
- App builds cleanly from the manifest
- No malware, spyware, or adware

## Tools

Flatforge accepts apps built with any tools. If you used AI assistants, fill in
the `ai_tools_used` field in `metadata.yaml` and mention it briefly in the PR
description. Appreciated for transparency, not required.

## Updates

Submit updates the same way — modify the existing directory and open a new PR.
Bump the `version` in `metadata.yaml`.

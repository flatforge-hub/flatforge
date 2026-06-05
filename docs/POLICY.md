# Flatforge Policy

## Mission

Flatforge is a Flatpak repository for the Linux desktop. We accept open-source
applications regardless of which tools were used to build them.

Quality is required. Slop is not.

## Acceptance criteria

### Required

- **Open-source licence** — must be OSI-approved, CC0, or Unlicense (SPDX identifier required)
- **AppStream metadata** — valid `metainfo.xml` with description, icon, and at least one screenshot
- **Correct App ID** — reverse-DNS format, must match a domain the developer controls or a well-known
  project namespace (e.g. `io.github.username.AppName`)
- **Working Flatpak** — builds from the submitted manifest without patches by maintainers
- **Reasonable sandbox** — `finish-args` must be justified; gratuitous permissions are rejected

### Encouraged

- Wayland support (`--socket=wayland`)
- Portal-based file access instead of broad `--filesystem=` flags
- Dark mode support

## Tools disclosure

Flatforge does not restrict which tools you use to write your application.
If you used AI tools, mention them in the `ai_tools_used` field of `metadata.yaml`
and briefly in the PR description. This is appreciated for transparency, but not
a condition for acceptance.

Applications with a filled `ai_tools_used` field receive an "AI" badge on their listing page.

## What we reject

- Proprietary applications
- Malware, spyware, adware, or any deceptive application
- Applications that crash on launch or are non-functional
- Duplicate applications with no differentiation from existing entries
- Applications with misleading App IDs (impersonating other projects)
- Applications with no genuine utility ("slop") — regardless of how they were built
- Custom or unreviewed licences — use MIT, Apache-2.0, GPL, CC0, or another established licence instead

## Sandbox policy

We review `finish-args` on every submission. The following require written justification:

| Permission | Justification required |
|---|---|
| `--filesystem=home` | Almost always replaceable with XDG portals |
| `--filesystem=host` | Almost never acceptable |
| `--share=network` | Must be core to the application's function |
| `--socket=session-bus` | Describe which D-Bus interfaces and why |
| `--device=all` | Use `--device=dri` for GPU; document any other need |
| `--talk-name=*` | Wildcard bus access is not acceptable |

## Updates

Updates must:
- Bump the version in `metadata.yaml`
- Build cleanly from the new manifest
- Not introduce new elevated permissions without new justification

## Enforcement

Violations of this policy (post-merge) will result in:
1. Issue opened requesting a fix within 14 days
2. Application marked as "under review" on the website
3. Removal from the repository if no response

We do not have the resources to audit every application continuously.
Security issues should be reported via `SECURITY.md`.

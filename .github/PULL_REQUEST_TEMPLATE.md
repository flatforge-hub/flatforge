# App Submission

> This PR should target the **`new-sub`** branch.
> Updates to accepted apps go via the per-app repository, not here.

## Application

- **App ID:** `org.example.MyApp`
- **Name:**
- **Version:**
- **Type:** [ ] New app   [ ] Metadata-only change (pre-acceptance revision)

---

## Checklist

### Flatpak manifest
- [ ] App ID uses reverse-DNS format (e.g. `org.example.MyApp`)
- [ ] `runtime` and `sdk` versions are current (≥ 23.08)
- [ ] Sources reference specific commits or checksums (no `branch: master`)
- [ ] `flatpak-builder-lint manifest` passes locally

### Sandbox permissions (`finish-args`)
- [ ] Only necessary permissions requested — no `--filesystem=home` without justification
- [ ] `--share=network` is absent, or justified below
- [ ] `--socket=session-bus` is absent, or justified below
- [ ] `--device=all` is absent, or justified below
- [ ] `--device=dri` is used instead of `--device=all` where GPU access is needed

### AppStream metadata
- [ ] `*.metainfo.xml` is valid (`appstreamcli validate` passes)
- [ ] App has a description (> 80 characters)
- [ ] App has at least one screenshot
- [ ] App has an icon (≥ 128×128)
- [ ] `<releases>` contains at least one entry with a date

### Sandbox behaviour
- [ ] App runs correctly in sandbox (`flatpak run --user`)
- [ ] No files are written outside `$XDG_DATA_HOME`, `$XDG_CONFIG_HOME`, `$XDG_CACHE_HOME`

### metadata.yaml (web listing)
- [ ] `metadata.yaml` present with all required fields
- [ ] `license` is an SPDX identifier (e.g. `GPL-3.0`, `MIT`, `Apache-2.0`)

---

## AI tools disclosure

> Flatforge explicitly welcomes AI-assisted development.  
> Please describe which tools you used (or write "None").

**AI tools used:**


---

## Justifications for elevated permissions (if any)

> If you need `--share=network`, `--socket=session-bus`, `--device=all`, or broad
> filesystem access, explain why here. PRs with unexplained elevated permissions will be
> blocked by CI and require manual review.

_None_

---

## Testing

Describe how you tested the Flatpak:

- [ ] Built successfully with `flatpak-builder`
- [ ] Installed and launched with `flatpak install` + `flatpak run`
- [ ] Core functionality works as expected
- [ ] No obvious regressions vs previous version (updates only)

---

## Contact & licence

- **Your name / handle:**
- **App licence:** (must be OSI-approved open-source)
- **Upstream repository:**

---

_Thank you for contributing to Flatforge!_

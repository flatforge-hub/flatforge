# Security

## What Flatforge checks

### Sandbox integrity

Every submitted application is reviewed for `finish-args` in its Flatpak manifest.
We enforce the principle of least privilege: apps should request only the permissions
they genuinely need.

`flatpak-builder-lint` is run automatically on every PR via GitHub Actions.

### GPG signing

The OSTree repository and its summary file are GPG-signed. Users who add the Flatforge
remote via the `.flatpakrepo` file automatically receive the public key and their Flatpak
client will verify signatures on install.

The signing key is generated during initial deployment and the private key never leaves
the VPS. The public key is embedded in `flatforge.flatpakrepo`.

### Build provenance

All applications in Flatforge are built from source in GitHub Actions using the submitted
`flatpak-builder` manifest. We do not accept pre-built binaries.

## Build provenance

Every build on push to `main` generates a signed SLSA provenance attestation
(via `actions/attest-build-provenance`) linking the distributed artifact to the
exact source commit and CI run that produced it. Verify with:

```bash
gh attestation verify <artifact.tar.gz> --repo flatforge-hub/<AppID>
```

The OSTree commit hash of each deployed build is also logged as a CI notice,
creating a traceable record from the OSTree object in the repository back to
the GitHub Actions run.

## What we do NOT check (yet)

- Automated static analysis of application source code
- Bit-for-bit reproducible builds (depends on upstream app build determinism)
- Runtime behaviour monitoring

These are goals for future development.

## Reporting a security issue

If you find a security issue with:

- **An application in the repository** — open a GitHub issue with the label `security`
  in `flatforge/hub-apps`. If sensitive, email the maintainers privately first.
- **The Flatforge infrastructure** — open a GitHub issue with the label `security`
  in `flatforge-hub/flatforge`.

Please include:
- Which application or component is affected
- Steps to reproduce
- Potential impact

We aim to respond within 7 days and resolve critical issues within 30 days.

## Incident response

If a malicious or compromised application is discovered post-merge:

1. The application is immediately removed from the repository
2. The OSTree summary is updated and re-signed
3. Users who installed the affected version are notified via a GitHub issue
4. A post-mortem is published

## Responsible disclosure

We follow a 90-day coordinated disclosure timeline for infrastructure vulnerabilities.

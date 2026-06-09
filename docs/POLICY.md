# Flatforge Policy

## Mission

Flatforge is a Flatpak repository for the Linux desktop. We accept open-source
applications regardless of which tools were used to build them.

Quality is required. Slop is not.

## Acceptance criteria

### Required

- **Open-source licence** — must be OSI-approved, CC0, or Unlicense (SPDX identifier required)
- **Source code URL** — a `source` field in `metadata.yaml` pointing to the publicly accessible
  source repository or archive; required for GPL/LGPL compliance and general transparency
- **AppStream metadata** — valid `metainfo.xml` with description, icon, and at least one screenshot
- **Correct App ID** — reverse-DNS format, must match a domain the developer controls or a
  well-known project namespace (e.g. `io.github.username.AppName`);
  see [App ID verification](#app-id-verification)
- **Working Flatpak** — builds from the submitted manifest without patches by maintainers
- **Reasonable sandbox** — `finish-args` must be justified; gratuitous permissions are rejected

### Encouraged

- Wayland support (`--socket=wayland`)
- Portal-based file access instead of broad `--filesystem=` flags
- Dark mode support

## Quality

Applications must be functional and complete — not a demo, skeleton, experiment, or
proof of concept. An application must serve a genuine user need and be usable without
guidance from the developer. If it has a UI, the UI must work.

There is no minimum line count or feature set. The bar is: would a reasonable person
use this? Applications that exist only to occupy a namespace, test the pipeline, or
pad a portfolio will be declined.

## App ID verification

The App ID encodes ownership. Before a submission is accepted, maintainers verify that
the submitter controls the namespace the App ID claims.

### GitHub or GitLab namespace

For `io.github.USERNAME.AppName` or `io.gitlab.USERNAME.AppName`:

- The `url` of the main source module in the manifest must be hosted under
  `github.com/USERNAME/` or `gitlab.com/USERNAME/` respectively.
- CI checks this automatically. A mismatch blocks the PR.
- The PR author must have push access to that source repository.

### Custom domain

For `com.example.AppName` or any other domain-based ID:

- Add a DNS TXT record at `_flatforge.example.com` with the value `github=USERNAME`
  (where `USERNAME` is your GitHub username), **or**
- Serve a plain-text file at `https://example.com/.well-known/flatforge-verify`
  containing the single line `github=USERNAME`.

A maintainer verifies this before merging. State the verification method in your PR
description.

### Other namespaces

App IDs outside the above patterns (e.g. `org.gnome.*`, `org.kde.*`,
`org.freedesktop.*`) require explicit written approval from a Flatforge maintainer
before submission. Contact us first.

### Namespace squatting

Claiming an App ID for software you did not write, or reserving an ID for software
that does not yet exist, is not permitted regardless of intent.

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

## Editorial discretion

Maintainers may decline any submission at their discretion, including for reasons not
listed in this policy, and are not required to provide a detailed explanation.

This safeguard is necessary. Open repositories are a natural target for submission
floods — including mass-submitted AI-generated applications of marginal quality.
Maintainers may act quickly to protect the review queue and the repository's integrity
without entering extended discussions for every rejected submission.

### Submission limits

To protect the review process:

- Each GitHub account may have at most **2 open submission PRs** at a time. A third
  PR will be closed automatically without review.
- After a rejection, the same account must wait **30 days** before opening a new
  submission PR.
- Accounts found to be coordinating submissions across multiple GitHub accounts
  may have all associated submissions closed.

Maintainers may grant exceptions for established contributors.

### Review timeline

Review is done on a volunteer basis. There is no guaranteed or promised timeline.
A submission may sit in queue for weeks or months and may require several rounds of
back-and-forth. **Expedited review cannot be demanded.** A PR that receives no
activity from the submitter's side for **90 days** will be closed as stale.

### Submission freeze

Maintainers may suspend the acceptance of new submissions at any time and for any
duration, without notice or explanation. During a freeze, new submission PRs will be
declined. An active freeze will be noted in the repository README.

## Trademarks and impersonation

App IDs must match a domain or namespace the developer controls (see acceptance
criteria above). Beyond that:

- **Names** — the `name` field and AppStream `<name>` must not use a trademarked
  name in a way that implies official affiliation unless the submitter is the
  upstream developer or has written authorisation from the trademark holder.
  Example: an app named "Firefox" or "Visual Studio Code" submitted by a third
  party will be rejected.

- **Unofficial wrappers and companions** — apps that wrap, extend, or companion
  another project must clearly identify themselves as unofficial. The name or
  summary must include a qualifier such as "Unofficial", "Third-party", or
  "Community". Example: "Unofficial Discord Client" is acceptable; "Discord" is not.

- **Icons** — app icons must be original or licensed for use. Reproducing a
  trademarked icon (e.g. another project's logo) without authorisation is not
  acceptable, even in modified form.

- **Descriptions** — marketing language that implies endorsement or official
  status from another project or organisation will be rejected.

If in doubt, err on the side of being explicit about the app's independent
status. Maintainers will flag ambiguous cases during review.

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

## Forks

A fork is acceptable when it constitutes a distinct project with genuine code
divergence from upstream and uses an App ID in the submitter's own namespace
(not the upstream ID). Document what makes the fork distinct in the PR description.

Repackaging upstream software under a different App ID without meaningful code changes
is not a fork — it is a duplicate and will be rejected.

## Updates

Updates must:
- Bump the version in `metadata.yaml`
- Build cleanly from the new manifest
- Not introduce new elevated permissions without new justification

## Abandoned applications

An application is considered abandoned when its per-app repository has had no commits
for **12 months** and the maintainer has not responded to a maintenance-check issue
within **30 days** of it being opened.

A scheduled GitHub Actions workflow runs monthly, detects stale repositories, and
opens maintenance-check issues automatically.

An abandoned application will be marked `status: unmaintained` in its `metadata.yaml`
and shown with an "Unmaintained" badge on the website. If no response or remediation
follows within a further **60 days**, the application may be removed.

**Maintainers may self-declare** an application as unmaintained at any time by setting
`status: unmaintained` in `metadata.yaml` via a PR to their per-app repository. This
is encouraged — it is more honest than silence.

## Transferring an application

If you can no longer maintain an application, open an issue in the per-app repository
with the label `transfer-request`. Include the GitHub username of the proposed new
maintainer (who must have already agreed). A Flatforge core maintainer will update
repository access accordingly.

If no successor is available, set `status: unmaintained` in `metadata.yaml` or open
an issue asking a maintainer to do so.

## Enforcement

Violations of this policy (post-merge) will result in:
1. Issue opened requesting a fix within 14 days
2. Application marked as "under review" on the website
3. Removal from the repository if no response

We do not have the resources to audit every application continuously.
Security issues should be reported via `SECURITY.md`.
Copyright infringement claims should be submitted per `COPYRIGHT.md`.
Terms of use and liability disclaimer are in `TERMS.md`.

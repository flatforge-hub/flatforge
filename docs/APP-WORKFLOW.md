# App submission and maintenance workflow

Inspired by Flathub's model.

## Repository layout

```
flatforge-hub/flatforge          ← hub-meta (this repo): submissions + infrastructure
flatforge-hub/org.example.MyApp  ← per-app repo, created after acceptance
flatforge-hub/.github            ← org-level reusable CI workflow
flatforge-hub/app-template       ← template used when creating per-app repos
```

## Submitting a new app

The submission target is the `new-sub` orphan branch in `flatforge-hub/flatforge`
(no history, no other apps — contributors only see their own files).

```bash
git clone --single-branch --branch new-sub \
    git@github.com:flatforge-hub/flatforge.git
cd flatforge
git checkout -b org.example.MyApp
# copy org.example.MyApp.json, org.example.MyApp.metainfo.xml, metadata.yaml
# under apps/org.example.MyApp/
git add apps/org.example.MyApp/
git push origin org.example.MyApp
# open PR against new-sub
```

CI runs `check-sources.py` + build on every PR targeting `new-sub`.

## After acceptance — maintainer checklist

When a submission PR is approved, a core maintainer does the following:

### 1. Create the per-app repo

Go to **github.com/organizations/flatforge-hub/repositories/new**, select
`flatforge-hub/app-template` as the template, and name the repo after the App ID
(e.g. `org.example.MyApp`).

### 2. Configure branch protection on `main`

In the new repo: **Settings → Branches → Add rule** for `main`:

| Setting | Value |
|---|---|
| Require a pull request before merging | ✅ |
| Require status checks to pass | ✅ |
| Require review from Code Owners | ✅ |
| Allow force pushes | ✗ |
| Allow deletions | ✗ |

This means:
- Manifest changes (`*.json`/`*.yaml`) → CODEOWNERS rule blocks merge until
  `@flatforge-hub/core` approves.
- `metadata.yaml` and `*.metainfo.xml` → no CODEOWNERS entry → no review
  required; auto-merges once CI passes.

### 3. Enable auto-merge on the repo

**Settings → General → Pull Requests → Allow auto-merge** ✅

Maintainers can then click "Enable auto-merge" on metadata-only PRs and they
will merge automatically as soon as all required checks pass.

### 4. Add org secrets

The deploy job reads three org-level secrets — make sure the new repo can
access them: **Settings → Secrets and variables → Actions → Manage org secrets**:
`SSH_KEY`, `SSH_HOST`, `SSH_USER`.

### 5. Copy app files and add maintainer

```bash
git clone git@github.com:flatforge-hub/org.example.MyApp.git
cd org.example.MyApp
# copy the three files from the accepted submission branch
git add .
git commit -m "Initial import from submission"
git push
```

Go to **Settings → Collaborators** and add the app maintainer's GitHub account
with **Write** access.

### 6. Clean up the submission branch

In `flatforge-hub/flatforge`, delete the submission branch
(`org.example.MyApp`) and close/merge the PR.

---

## Per-app repo: branch protection details

```
# .github/CODEOWNERS
*.json    @flatforge-hub/core
*.yaml    @flatforge-hub/core
*.yml     @flatforge-hub/core
metadata.yaml
```

The last line overrides the `*.yaml` rule for `metadata.yaml` (GitHub CODEOWNERS:
last matching rule wins), so it has no required reviewer.

Rules on `main`:
- All changes require a PR (no direct push to `main`).
- CODEOWNERS review required for manifests — covers `finish-args` and all
  sandbox permissions.
- `metadata.yaml` and `*.metainfo.xml` auto-merge after CI passes.
- If `finish-args` are added, CI fails with an explicit error listing each new
  permission — a core maintainer must justify and approve.

---

## CI workflows

### 1. Submission workflow (`flatforge-hub/flatforge`)

Triggers on PRs targeting `new-sub`. No deploy step.

```yaml
on:
  pull_request:
    branches: [new-sub]
    paths: ["apps/**"]
```

Jobs: `detect` → `check-sources` → `build`.

### 2. Per-app reusable workflow (`flatforge-hub/.github`)

Stored once in the org-level repo; each app repo calls it with one line:

```yaml
jobs:
  check:
    uses: flatforge-hub/.github/.github/workflows/check-app.yml@main
    secrets: inherit
```

Differences from the submission workflow:
- Manifest is at repo root, not under `apps/<AppID>/`
- `check-permissions` job diffs `finish-args` against the base branch; errors
  if permissions were added (requires core review)
- Deploy job present — triggers on push to `main`

`check-sources.py` itself does not change between the two workflows.

---

## Setting up the `new-sub` orphan branch (one-time, already done)

```bash
git switch --orphan new-sub
git commit --allow-empty -m "submission base"
git push origin new-sub
```

---

## TODO

- [ ] Decide: auto-approve bot for `metadata.yaml`/`*.metainfo.xml` PRs, or
      rely on maintainers clicking "Enable auto-merge" manually (current approach)

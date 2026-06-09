#!/usr/bin/env python3
"""
Flatforge source compliance checker.

Validates that a Flatpak manifest uses only open-source, source-code-based
inputs. Exits non-zero if any error-level finding is present.

Checks:
  1. metadata.yaml: license field is OSI-approved (SPDX)
  2. Sources: no binary blobs (type: file with binary extensions)
  3. Sources: no pre-compiled archive releases (binary URL patterns)
  4. Sources: no type: dir (local path, cannot be reproduced in CI)
  5. Sources: git sources have a pinned commit or tag (reproducibility)
  6. Build: buildsystem=simple with only install steps and real file sources
             (warns that a binary may be getting bundled)
"""

import argparse
import json
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore[assignment]

# ---------------------------------------------------------------------------
# OSI-approved SPDX identifiers (common subset) + CC0/Unlicense per policy.
# Full list: https://spdx.org/licenses/
# ---------------------------------------------------------------------------
OSI_APPROVED: set[str] = {
    "AFL-2.0", "AFL-2.1", "AFL-3.0",
    "AGPL-3.0", "AGPL-3.0-only", "AGPL-3.0-or-later",
    "Apache-1.0", "Apache-1.1", "Apache-2.0",
    "Artistic-1.0", "Artistic-1.0-Perl", "Artistic-2.0",
    "BSD-1-Clause", "BSD-2-Clause", "BSD-2-Clause-Patent",
    "BSD-3-Clause", "BSD-4-Clause",
    "BSL-1.0",
    "CC0-1.0",  # per Flatforge policy
    "CDDL-1.0",
    "CECILL-2.1",
    "CPL-1.0",
    "CPAL-1.0",
    "ECL-2.0",
    "EFL-2.0",
    "EPL-1.0", "EPL-2.0",
    "EUPL-1.1", "EUPL-1.2",
    "GPL-2.0", "GPL-2.0-only", "GPL-2.0-or-later",
    "GPL-3.0", "GPL-3.0-only", "GPL-3.0-or-later",
    "HPND",
    "IPA",
    "IPL-1.0",
    "ISC",
    "LGPL-2.0", "LGPL-2.0-only", "LGPL-2.0-or-later",
    "LGPL-2.1", "LGPL-2.1-only", "LGPL-2.1-or-later",
    "LGPL-3.0", "LGPL-3.0-only", "LGPL-3.0-or-later",
    "LPL-1.02",
    "MIT", "MIT-0",
    "MPL-1.0", "MPL-1.1", "MPL-2.0",
    "MS-PL", "MS-RL",
    "NASA-1.3",
    "NPOSL-3.0",
    "OFL-1.1",
    "OSL-1.0", "OSL-1.1", "OSL-2.0", "OSL-2.1", "OSL-3.0",
    "PHP-3.0", "PHP-3.01",
    "PostgreSQL",
    "Python-2.0",
    "QPL-1.0",
    "RPSL-1.0",
    "SPL-1.0",
    "Sleepycat",
    "Unlicense",  # per Flatforge policy
    "UPL-1.0",
    "VSL-1.0",
    "W3C",
    "Xnet",
    "ZPL-2.0", "ZPL-2.1",
    "Zlib",
    "gnuplot",
    "wxWindows",
}

# Shorthand aliases people commonly write (mapped to canonical form).
SPDX_ALIASES: dict[str, str] = {
    "GPL-2.0+": "GPL-2.0-or-later",
    "GPL-3.0+": "GPL-3.0-or-later",
    "LGPL-2.0+": "LGPL-2.0-or-later",
    "LGPL-2.1+": "LGPL-2.1-or-later",
    "LGPL-3.0+": "LGPL-3.0-or-later",
    "AGPL-3.0+": "AGPL-3.0-or-later",
}

# ---------------------------------------------------------------------------
# Binary detection
# ---------------------------------------------------------------------------

# type: file sources with these extensions are almost certainly binary blobs.
BINARY_FILE_EXTENSIONS: frozenset[str] = frozenset({
    ".so", ".a", ".o", ".ko", ".dylib", ".dll", ".exe", ".bin",
    ".whl", ".jar", ".class", ".pyc", ".pyd", ".node",
    ".deb", ".rpm", ".AppImage", ".flatpak", ".snap",
})

# type: archive sources with these URL suffixes are binary packages.
BINARY_ARCHIVE_SUFFIXES: frozenset[str] = frozenset({
    ".deb", ".rpm", ".AppImage", ".snap", ".flatpak",
})

# type: archive URL patterns that suggest a pre-compiled binary release.
# These fire as warnings (not errors) because some are ambiguous.
BINARY_URL_PATTERNS: list[str] = [
    r"-(?:x86_64|x64|aarch64|arm64|armv7l?|i386|i686)-linux\.",
    r"-linux-(?:x86_64|x64|aarch64|arm64|armv7l?|i386|i686)\.",
    r"_(?:x86_64|amd64|aarch64|arm64|i386|i686)\.tar",
    r"-bin\.",
    r"-binary\.",
    r"-prebuilt",
]

# Patterns that override the above — if present in the URL it's a source archive
# despite having a platform string.
SOURCE_URL_INDICATORS: list[str] = [
    r"[_\-]source\.",
    r"[_\-]src\.",
    r"\.orig\.",
]

# Commands that indicate real compilation is happening.
COMPILER_PATTERNS: list[str] = [
    r"\bmake\b", r"\bcmake\b", r"\bmeson\b", r"\bninja\b",
    r"\bcargo\s+build\b", r"\bgo\s+build\b",
    r"\bgcc\b", r"\bg\+\+\b", r"\bclang\b", r"\bclang\+\+\b",
    r"\bcc\s+-[co]\b", r"\b\./configure\b",
    r"\bwaf\b", r"\bscons\b",
    r"\bpython[23]?\s.*setup\.py\s+build\b",
    r"\bnpm\s+(?:run\s+)?build\b", r"\byarn\s+build\b",
    r"\bmvn\b", r"\bgradle\b", r"\bant\b",
    r"\bcabal\s+build\b", r"\bstack\s+build\b",
    r"\bpython[23]?\s+-m\s+build\b",
    r"\bpip\s+install\b",
    r"\bcargo\s+install\b",
]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

Issue = tuple[str, str]  # (level, message)  level ∈ {"error", "warning"}


def _binary_url(url: str) -> bool:
    for indicator in SOURCE_URL_INDICATORS:
        if re.search(indicator, url, re.IGNORECASE):
            return False
    for pattern in BINARY_URL_PATTERNS:
        if re.search(pattern, url, re.IGNORECASE):
            return True
    return False


def _file_is_binary(name: str) -> bool:
    if re.search(r"\.so\.\d", name):
        return True
    return Path(name).suffix.lower() in BINARY_FILE_EXTENSIONS


# ---------------------------------------------------------------------------
# Per-source check
# ---------------------------------------------------------------------------

def check_source(source: dict, module_name: str) -> list[Issue]:
    issues: list[Issue] = []
    src_type = source.get("type", "archive")

    if src_type == "dir":
        issues.append((
            "error",
            f"Module '{module_name}': source type 'dir' is a local path "
            "and cannot be reproduced in CI — use type: git or type: archive",
        ))

    elif src_type == "file":
        url = source.get("url", "")
        dest = source.get("dest-filename") or (Path(url).name if url else "")
        if dest and _file_is_binary(dest):
            issues.append((
                "error",
                f"Module '{module_name}': source file '{dest}' looks like a "
                "binary blob — ship source code, not compiled artifacts",
            ))

    elif src_type == "archive":
        url = source.get("url", "")
        if url:
            bare = url.split("?")[0]
            for suffix in BINARY_ARCHIVE_SUFFIXES:
                if bare.endswith(suffix):
                    issues.append((
                        "error",
                        f"Module '{module_name}': archive '{url}' is a binary "
                        f"package ({suffix}) — provide a source archive instead",
                    ))
                    break
            else:
                if _binary_url(url):
                    issues.append((
                        "warning",
                        f"Module '{module_name}': archive URL '{url}' looks like "
                        "a pre-compiled binary release — verify this is a source archive",
                    ))

    elif src_type == "git":
        if not source.get("commit") and not source.get("tag"):
            branch = source.get("branch", "unspecified")
            issues.append((
                "warning",
                f"Module '{module_name}': git source has no commit or tag "
                f"(branch: {branch}) — builds are not reproducible without a pinned ref",
            ))

    # type: script, type: patch, type: inline → always fine

    return issues


# ---------------------------------------------------------------------------
# Build-command check
# ---------------------------------------------------------------------------

def check_build_commands(module: dict) -> list[Issue]:
    """Warn when buildsystem=simple has no compilation and real file sources."""
    if module.get("buildsystem") != "simple":
        return []

    sources = module.get("sources", [])
    has_external_source = any(
        s.get("type", "archive") in ("git", "archive", "file")
        for s in sources
    )
    if not has_external_source:
        return []

    commands = " ".join(module.get("build-commands", []))
    if not commands:
        return []

    for pattern in COMPILER_PATTERNS:
        if re.search(pattern, commands):
            return []

    return [(
        "warning",
        f"Module '{module.get('name', '?')}': buildsystem=simple with no "
        "compilation step detected — confirm you are building from source, "
        "not installing a pre-compiled binary",
    )]


# ---------------------------------------------------------------------------
# metadata.yaml check
# ---------------------------------------------------------------------------

def check_metadata(metadata_path: Path) -> list[Issue]:
    issues: list[Issue] = []

    if not metadata_path.exists():
        issues.append(("error", f"metadata.yaml not found at {metadata_path}"))
        return issues

    if yaml is None:
        issues.append(("error", "PyYAML not installed — cannot validate metadata.yaml"))
        return issues

    with metadata_path.open() as f:
        data = yaml.safe_load(f)

    if not data:
        issues.append(("error", "metadata.yaml is empty or invalid YAML"))
        return issues

    source = data.get("source", "")
    if not source:
        issues.append(("error", "metadata.yaml: 'source' field is missing — provide a URL to the public source repository or archive"))
    elif not str(source).startswith(("https://", "http://")):
        issues.append(("error", f"metadata.yaml: 'source' must be a URL (got '{source}')"))

    raw = data.get("license", "")
    if not raw:
        issues.append(("error", "metadata.yaml: 'license' field is missing"))
        return issues

    canonical = SPDX_ALIASES.get(raw, raw)

    if canonical != raw:
        issues.append((
            "warning",
            f"metadata.yaml: license '{raw}' — prefer canonical SPDX form '{canonical}'",
        ))

    if canonical not in OSI_APPROVED:
        lower_map = {k.lower(): k for k in OSI_APPROVED}
        if canonical.lower() in lower_map:
            issues.append((
                "warning",
                f"metadata.yaml: license '{raw}' — use canonical capitalisation "
                f"'{lower_map[canonical.lower()]}'",
            ))
        else:
            issues.append((
                "error",
                f"metadata.yaml: '{raw}' is not an OSI-approved SPDX identifier. "
                "See https://spdx.org/licenses/ — Flatforge requires an OSI-approved "
                "licence, CC0-1.0, or Unlicense",
            ))

    return issues


# ---------------------------------------------------------------------------
# Manifest loading + module traversal
# ---------------------------------------------------------------------------

def load_manifest(path: Path) -> dict:
    with path.open() as f:
        content = f.read()
    if path.suffix == ".json":
        return json.loads(content)
    if yaml is None:
        print("::error::PyYAML not installed — cannot parse YAML manifest. "
              "Run: pip install pyyaml")
        sys.exit(1)
    return yaml.safe_load(content)


def collect_modules(manifest: dict) -> list[dict]:
    modules: list[dict] = []

    def walk(mod_list: list) -> None:
        for mod in mod_list:
            if isinstance(mod, dict):
                modules.append(mod)
                if "modules" in mod:
                    walk(mod["modules"])

    walk(manifest.get("modules", []))
    return modules


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Check Flatpak manifest for open-source source compliance"
    )
    parser.add_argument("manifest", help="Path to Flatpak manifest (.json/.yaml/.yml)")
    args = parser.parse_args()

    manifest_path = Path(args.manifest)
    if not manifest_path.exists():
        print(f"::error::Manifest not found: {manifest_path}")
        sys.exit(1)

    app_dir = manifest_path.parent
    metadata_path = app_dir / "metadata.yaml"

    errors = 0
    warnings = 0

    def report(level: str, msg: str) -> None:
        nonlocal errors, warnings
        prefix = (
            f"::error file={manifest_path}::"
            if level == "error"
            else f"::warning file={manifest_path}::"
        )
        print(prefix + msg)
        if level == "error":
            errors += 1
        else:
            warnings += 1

    for level, msg in check_metadata(metadata_path):
        report(level, msg)

    try:
        manifest = load_manifest(manifest_path)
    except Exception as exc:
        print(f"::error file={manifest_path}::Failed to parse manifest: {exc}")
        sys.exit(1)

    for module in collect_modules(manifest):
        for source in module.get("sources", []):
            for level, msg in check_source(source, module.get("name", "?")):
                report(level, msg)
        for level, msg in check_build_commands(module):
            report(level, msg)

    if errors:
        print(f"::error::check-sources: {errors} error(s), {warnings} warning(s) — PR blocked")
        sys.exit(1)
    elif warnings:
        print(f"::notice::check-sources: 0 errors, {warnings} warning(s) — manual review advised")
    else:
        print(f"::notice::check-sources: all checks passed for {manifest_path.parent.name}")


if __name__ == "__main__":
    main()

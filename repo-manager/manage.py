#!/usr/bin/env python3
"""Flatforge OSTree repository manager."""
import argparse
import os
import subprocess
import sys
from pathlib import Path

REPO_PATH = Path(os.getenv("REPO_PATH", "/repo"))
GPG_DIR = Path(os.getenv("GNUPGHOME", "/gpg/gnupg"))
GPG_KEY_ID = os.getenv("GPG_KEY_ID", "")
DEFAULT_BRANCH = os.getenv("REPO_DEFAULT_BRANCH", "stable")
DOMAIN = os.getenv("DOMAIN", "flatforge.org")


def run(cmd, env=None, **kwargs):
    print(f"+ {' '.join(str(c) for c in cmd)}", flush=True)
    merged_env = {**os.environ, **(env or {})}
    return subprocess.run(cmd, check=True, env=merged_env, **kwargs)


def gpg_env():
    return {"GNUPGHOME": str(GPG_DIR)}


# ── Commands ──────────────────────────────────────────────────────────────────

def cmd_init_repo(args):
    """Initialise a new archive-mode OSTree repository."""
    REPO_PATH.mkdir(parents=True, exist_ok=True)
    run(["ostree", "init", "--mode=archive", f"--repo={REPO_PATH}"])
    print(f"Initialised OSTree repo at {REPO_PATH}")


def cmd_export_app(args):
    """
    Commit a flatpak-builder output repo into the main repository and sign it.

    flatpak-builder should have been run with --repo=<build_dir> so that
    <build_dir> is itself a valid OSTree repo.
    """
    build_dir = Path(args.build_dir)
    if not build_dir.exists():
        sys.exit(f"Build dir does not exist: {build_dir}")
    if not GPG_KEY_ID:
        sys.exit("GPG_KEY_ID is not set. Export it in .env and restart the container.")

    # Pull all refs from the build repo into the main repo
    run([
        "ostree", "pull-local",
        f"--repo={REPO_PATH}",
        str(build_dir),
    ])

    # Re-sign all refs that belong to this app
    result = subprocess.run(
        ["ostree", "refs", f"--repo={REPO_PATH}"],
        capture_output=True, text=True, check=True,
    )
    refs = [r for r in result.stdout.splitlines() if args.app_id in r]
    for ref in refs:
        run([
            "ostree", "gpg-sign",
            f"--repo={REPO_PATH}",
            f"--gpg-homedir={GPG_DIR}",
            ref,
            GPG_KEY_ID,
        ], env=gpg_env())

    print(f"Exported {args.app_id} ({len(refs)} refs)")
    cmd_update_summary(args)


def cmd_update_summary(args):
    """Regenerate and GPG-sign the OSTree summary file."""
    if not GPG_KEY_ID:
        print("WARNING: GPG_KEY_ID not set — summary will be unsigned.", flush=True)
        run(["flatpak", "build-update-repo", str(REPO_PATH)])
    else:
        run([
            "flatpak", "build-update-repo",
            f"--gpg-sign={GPG_KEY_ID}",
            f"--gpg-homedir={GPG_DIR}",
            str(REPO_PATH),
        ], env=gpg_env())
    print("Repository summary updated.")


def cmd_gen_flatpakrepo(args):
    """Generate a .flatpakrepo subscription file."""
    domain = args.domain or DOMAIN
    gpg_b64 = ""

    if GPG_KEY_ID:
        import base64
        result = subprocess.run(
            ["gpg", "--export", GPG_KEY_ID],
            capture_output=True, env={**os.environ, **gpg_env()},
        )
        if result.returncode == 0 and result.stdout:
            gpg_b64 = base64.b64encode(result.stdout).decode()
        else:
            print("WARNING: could not export GPG key — repo file will have no GPGKey.")

    content = f"""[Flatpak Repo]
Title=Flatforge
Url=https://{domain}/repo/
Homepage=https://{domain}/
Comment=AI-friendly Flatpak repository
Description=Flatpak applications including AI-assisted projects. Quality required, slop rejected.
Icon=https://{domain}/icon.svg
GPGKey={gpg_b64}
"""
    out = Path("flatforge.flatpakrepo")
    out.write_text(content)
    print(f"Generated {out.resolve()}")


def cmd_gpg_init(args):
    """Generate a 4096-bit RSA signing key in the GPG keyring."""
    GPG_DIR.mkdir(parents=True, mode=0o700, exist_ok=True)

    key_email = os.getenv("GPG_KEY_EMAIL", "repo@flatforge.org")
    key_name = os.getenv("GPG_KEY_NAME", "Flatforge Repository")

    batch = GPG_DIR / "keygen-batch"
    batch.write_text(f"""\
%echo Generating Flatforge repository signing key
Key-Type: RSA
Key-Length: 4096
Subkey-Type: RSA
Subkey-Length: 4096
Name-Real: {key_name}
Name-Email: {key_email}
Expire-Date: 0
%no-protection
%commit
%echo Done
""")

    run(["gpg", "--batch", "--gen-key", str(batch)], env=gpg_env())
    batch.unlink()

    result = subprocess.run(
        ["gpg", "--list-keys", "--keyid-format=long", key_email],
        capture_output=True, text=True,
        env={**os.environ, **gpg_env()},
    )
    print("\nKey generated successfully!")
    print(result.stdout)

    pubkey = GPG_DIR.parent / "flatforge.gpg"
    raw = subprocess.run(
        ["gpg", "--export", key_email],
        capture_output=True,
        env={**os.environ, **gpg_env()},
    )
    pubkey.write_bytes(raw.stdout)
    print(f"Public key exported to: {pubkey}")
    print("\n>> Add GPG_KEY_ID= to your .env file.")
    print(">> Run:  docker compose run --rm repo-manager list-keys")


def cmd_list_keys(args):
    """List GPG keys in the signing keyring."""
    run(["gpg", "--list-keys", "--keyid-format=long"], env=gpg_env())


# ── CLI wiring ────────────────────────────────────────────────────────────────

def main():
    p = argparse.ArgumentParser(description="Flatforge repository manager")
    sub = p.add_subparsers(dest="command", metavar="COMMAND")

    sub.add_parser("init-repo", help="Initialise a new OSTree repository") \
       .set_defaults(func=cmd_init_repo)

    ea = sub.add_parser("export-app", help="Import flatpak-builder output into repo")
    ea.add_argument("app_id", help="App ID, e.g. org.example.MyApp")
    ea.add_argument("build_dir", help="flatpak-builder --repo output directory")
    ea.set_defaults(func=cmd_export_app)

    sub.add_parser("update-summary", help="Regenerate and sign the OSTree summary") \
       .set_defaults(func=cmd_update_summary)

    gfr = sub.add_parser("gen-flatpakrepo", help="Generate .flatpakrepo file")
    gfr.add_argument("domain", nargs="?", help="Domain override (default: $DOMAIN)")
    gfr.set_defaults(func=cmd_gen_flatpakrepo)

    sub.add_parser("gpg-init", help="Generate a new GPG signing key") \
       .set_defaults(func=cmd_gpg_init)

    sub.add_parser("list-keys", help="List GPG keys in the keyring") \
       .set_defaults(func=cmd_list_keys)

    args = p.parse_args()
    if not args.command:
        p.print_help()
        sys.exit(1)
    args.func(args)


if __name__ == "__main__":
    main()

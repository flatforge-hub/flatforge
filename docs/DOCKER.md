# Docker Deployment Guide

## Prerequisites

- Docker Engine 24+ or Docker Desktop
- Docker Compose v2 (`docker compose` — note: no hyphen)
- A VPS running Debian 12 / Ubuntu 22.04+ (or equivalent)
- A domain pointed at the VPS (Cloudflare recommended as CDN/proxy)
- nginx running on the host as a reverse proxy (recommended) **or** no web server on the host

## Deployment modes

### Behind a host nginx (recommended for a shared VPS)

The Docker nginx container binds only to `127.0.0.1:8080`. The host nginx
acts as a virtual-host router and reverse proxies to it.

```
Internet → Cloudflare → host nginx (port 80) → Docker nginx (127.0.0.1:8080)
```

Copy the example vhost config and reload:

```bash
sudo cp nginx-vhost.conf.example /etc/nginx/sites-available/flatforge.org
# Edit server_name if needed
sudo ln -s /etc/nginx/sites-available/flatforge.org /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Standalone (no host nginx)

Set in `.env`:
```
LISTEN_ADDR=0.0.0.0
HTTP_PORT=80
```
Then proceed with the setup below.

## First-time setup

### 1. Clone and configure

```bash
git clone https://github.com/flatforge-hub/hub-meta /opt/docker/flatforge
cd /opt/docker/flatforge
cp .env.example .env
$EDITOR .env   # set DOMAIN, GPG_KEY_EMAIL, GPG_KEY_NAME
```

### 2. Generate the GPG signing key

```bash
docker compose --profile init run --rm gpg-init
```

This creates `./gpg/gnupg/` with the keyring and exports `./gpg/flatforge.gpg`.

Find your key ID:

```bash
docker compose run --rm repo-manager list-keys
```

Copy the 16-character key ID (e.g. `ABC1234567890DEF`) into `.env`:

```
GPG_KEY_ID=ABC1234567890DEF
```

### 3. Initialise the OSTree repository

```bash
docker compose run --rm repo-manager init-repo
```

### 4. Build the web frontend

```bash
docker compose --profile build run --rm web-builder
```

Output lands in `./web/dist/`.

### 5. Generate the .flatpakrepo subscription file

```bash
docker compose run --rm repo-manager gen-flatpakrepo
```

Copy `flatforge.flatpakrepo` to `./flatpak-repo/` so nginx serves it at `/flatforge.flatpakrepo`.

### 6. Start nginx

```bash
docker compose up -d nginx
```

Check: `curl http://localhost/healthz` should return `ok`.

---

## Day-to-day operations

### Rebuild the web after metadata changes

```bash
docker compose --profile build run --rm web-builder
# nginx serves from ./web/dist — no restart needed
```

### Manually add an app (without CI)

```bash
# Build the flatpak locally (or copy a build repo from somewhere)
flatpak-builder --repo ./build-repo ./build-dir manifests/org.example.MyApp/org.example.MyApp.json

docker compose run --rm \
  -v $(pwd)/build-repo:/tmp/build-repo:ro \
  repo-manager export-app org.example.MyApp /tmp/build-repo
```

### Update OSTree summary only

```bash
docker compose run --rm repo-manager update-summary
```

### View nginx logs

```bash
docker compose logs -f nginx
```

---

## Backups

Back up these directories:

| Path | Contents |
|---|---|
| `./flatpak-repo/` | OSTree repository — all app data |
| `./gpg/` | GPG keyring — **critical**, loss means re-signing everything |
| `./.env` | Secrets and configuration |

The `./web/dist/` directory is regenerated from source — no backup needed.

Recommended backup strategy:

```bash
# Daily backup to an S3-compatible bucket
tar czf - flatpak-repo gpg .env | \
  aws s3 cp - s3://your-bucket/flatforge-backup-$(date +%Y%m%d).tar.gz
```

---

## Updating the stack

```bash
cd /opt/docker/flatforge
git pull
docker compose build          # rebuild nginx image if default.conf changed
docker compose up -d nginx    # rolling restart
```

---

## Cloudflare configuration

Flatforge is designed to sit behind Cloudflare:

- Cloudflare terminates TLS — nginx only needs port 80 internally
- OSTree object URLs (`/repo/objects/`) should be **cached** (edge TTL: 1 year)
- OSTree summary URL (`/repo/summary`) must be **bypassed** (Cache-Control: no-cache is set in nginx)
- Set Cloudflare SSL/TLS mode to **Full** (not Full Strict, since the origin has no cert)

Cloudflare Page Rules:
1. `flatforge.org/repo/summary` → Cache Level: Bypass
2. `flatforge.org/repo/summary.sig` → Cache Level: Bypass
3. `flatforge.org/repo/objects/*` → Cache Level: Cache Everything, Edge TTL: 1 year

---

## Troubleshooting

### nginx won't start: `./web/dist` is missing

Run the web builder first:
```bash
docker compose --profile build run --rm web-builder
```

### GPG signing fails: "key not found"

Verify `GPG_KEY_ID` in `.env` matches the output of `docker compose run --rm repo-manager list-keys`.

### OSTree pull fails in export-app

Make sure the source build repo directory is a valid OSTree archive repo
(`flatpak-builder --repo=<dir>` creates one automatically).

### Port 80 already in use

Change `HTTP_PORT` in `.env`:
```
HTTP_PORT=8080
```
Then `docker compose up -d nginx`.

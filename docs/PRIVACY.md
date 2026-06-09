# Privacy

This document describes the data processing practices of a Flatforge instance and
provides guidance for operators on maintaining GDPR compliance.

## Data collected

| Data | Source | Stored as |
|---|---|---|
| Truncated IP address | nginx access log | Last octet zeroed (IPv4) / `/48` prefix (IPv6) |
| Request URL, timestamp, HTTP status | nginx access log | Plain text |
| User-Agent string | nginx access log | Plain text |

Full IP addresses are never written to disk. The nginx configuration uses a `map`
block to anonymize addresses before logging. See `nginx/default.conf`.

No cookies, analytics scripts, or tracking pixels are used. No user accounts exist.

## Legal basis

Server access logs: **legitimate interest** (Article 6(1)(f) GDPR) — server
operations, error diagnosis, and abuse detection.

## Third parties

**GitHub** — app submissions and issue tracking. Governed by the GitHub Privacy
Statement; Flatforge has no control over data processed there.

If the deployment uses a CDN or reverse proxy (e.g. Cloudflare), add it here and
ensure a Data Processing Addendum is in place with that provider.

## Log retention

Default: 90 days. Logs live in two places:

**Docker nginx** (access logs with anonymized IPs) — rotated by Docker's json-file
driver. Set in `docker-compose.yml` under the `nginx` service:

```yaml
logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "90"
```

Takes effect after the next container recreation (`docker compose up -d --force-recreate nginx`).

**Host nginx** (error log only — access log is disabled to avoid logging full IPs) —
rotated by logrotate. Create `/etc/logrotate.d/flatforge`:

```
/var/log/nginx/flatforge.error.log {
    daily
    rotate 90
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        invoke-rc.d nginx rotate >/dev/null 2>&1
    endscript
}
```

## Contact

Privacy inquiries: evtcsuha5@mozmail.com

## Web privacy notice

The public-facing privacy notice is served at `/privacy` on the web frontend
(`web/src/pages/Privacy.tsx`). Update it if you change retention periods, add
third-party services, or deploy to a different domain.

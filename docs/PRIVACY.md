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

**Cloudflare** — acts as a CDN and reverse proxy in front of the VPS. Cloudflare
processes real IP addresses before requests reach nginx. Operators who use
Cloudflare should ensure they have accepted Cloudflare's standard Data Processing
Addendum (available in the Cloudflare dashboard).

**GitHub** — app submissions and issue tracking. Governed by the GitHub Privacy
Statement; Flatforge has no control over data processed there.

## Log retention

Default: 90 days. Operators should configure log rotation accordingly:

```bash
# /etc/logrotate.d/flatforge-nginx
/opt/docker/flatforge/logs/nginx/*.log {
    daily
    rotate 90
    compress
    delaycompress
    missingok
    notifempty
    sharedscripts
    postrotate
        docker compose -f /opt/docker/flatforge/docker-compose.yml kill -s USR1 nginx
    endscript
}
```

## Contact

Privacy inquiries: evtcsuha5@mozmail.com

## Web privacy notice

The public-facing privacy notice is served at `/privacy` on the web frontend
(`web/src/pages/Privacy.tsx`). Update it if you change retention periods, add
third-party services, or deploy to a different domain.

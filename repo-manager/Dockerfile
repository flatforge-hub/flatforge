FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        ostree \
        flatpak \
        flatpak-builder \
        gnupg \
        gnupg2 \
        python3 \
        rsync \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create directories with correct permissions
RUN mkdir -p /repo /gpg/gnupg /app \
    && chmod 700 /gpg/gnupg

COPY manage.py /app/manage.py
RUN chmod +x /app/manage.py

ENV REPO_PATH=/repo
ENV GNUPGHOME=/gpg/gnupg

ENTRYPOINT ["python3", "/app/manage.py"]
CMD ["--help"]

# Deploy with Package Manager

:::info
Supports Windows, Linux, Mac OS, etc. Recommended for testing environments and personal use scenarios; production-level environments please use [Docker Deployment](/en/deploy/langbot/docker.html).
:::

LangBot is packaged and released to PyPI. Please install [uv](https://docs.astral.sh/uv/getting-started/installation/), and then run the following command in an empty directory:

```bash
uvx langbot@latest
```

This will set the current directory as the working directory, and you can access `http://localhost:5300` to start using it.
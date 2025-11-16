# 使用包管理器部署

:::info
支持 Windows、Linux、Mac OS 等系统，推荐在测试环境、个人用途场景使用；生产级环境请使用[Docker部署](/zh/deploy/langbot/docker.html)。
:::

LangBot 已打包发布至 PyPI。请安装[uv](https://docs.astral.sh/uv/getting-started/installation/)，然后在空目录下运行以下命令：

```bash
uvx langbot@latest
```

这将把该目录作为工作目录，访问 `http://localhost:5300` 即可开始使用。

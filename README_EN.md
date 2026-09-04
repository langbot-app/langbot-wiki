# [LangBot](https://github.com/langbot-app/LangBot) Official Documentation

> This repository is the documentation repository for LangBot. Code repository:  
> [LangBot Code Repository](https://github.com/langbot-app/LangBot)  
> This is the documentation for LangBot 4.0. For 3.0 documentation, please see the `v3` branch

## Contributing to Documentation

The documentation is built with [Fumapress](https://press.fumadocs.dev/) and [Fumadocs](https://fumadocs.dev/). Local development requires Node.js 24 or later.

Clone this repository and execute the following command in the directory to install dependencies:

```bash
npm ci
```

After completion, you can modify the documentation. After modifications, use the following command to start locally:

```bash
npm run dev
```

### Using Images

Place images in the `images` directory, then reference them using the absolute path (relative to the project root), such as:

```markdown
![image](/images/xxx.png)
```

### Deployment Details

The documentation is built as a static site in `dist/public` and hosted on Cloudflare Pages. Type checking, documentation contract tests, and a full static build run before deployment.

### Some Standardization Guidelines

- Folder and file naming: **Use all lowercase, separate words with `-`, such as** `plugin-intro.mdx`
- Sub-file (folder) naming: **No prefix** (i.e., the folder name), such as: in the `deploy` folder, the folder `langbot`, the `manual` file in the `langbot` folder is called `manual.mdx`
- Documentation files should use `.mdx`; the build adapter converts existing Mintlify-compatible components into Fumadocs-renderable markup.
- Configure sidebar navigation structure in `docs.json`.

---

**[中文版 README](README.md)**

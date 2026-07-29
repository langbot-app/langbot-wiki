from __future__ import annotations

import importlib.util
import tempfile
import unittest
from pathlib import Path, PurePosixPath

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "build-github-wiki.py"
SPEC = importlib.util.spec_from_file_location("build_github_wiki", MODULE_PATH)
assert SPEC and SPEC.loader
wiki = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(wiki)


class BuildGitHubWikiTest(unittest.TestCase):
    def test_converts_frontmatter_callout_links_and_images(self) -> None:
        source = PurePosixPath("zh/insight/guide.mdx")
        title, output = wiki.convert_mdx(
            source,
            '''---
title: "开始使用"
description: "ignored"
---
<Tip title="提示">
阅读[模型文档](/zh/usage/models/readme)。
</Tip>

![界面](/images/ui.png)
''',
        )
        self.assertEqual(title, "开始使用")
        self.assertTrue(output.startswith("# 开始使用\n"))
        self.assertNotIn("description:", output)
        self.assertIn("> [!TIP]", output)
        self.assertIn("> **提示**", output)
        self.assertIn("[模型文档](zh-usage-models-readme)", output)
        self.assertIn(
            "https://raw.githubusercontent.com/langbot-app/langbot-wiki/main/images/ui.png",
            output,
        )

    def test_resolves_relative_document_links(self) -> None:
        source = PurePosixPath("en/usage/mcp/readme.mdx")
        self.assertEqual(
            wiki.resolve_doc_target(source, "../models/readme#tools"),
            "en-usage-models-readme#tools",
        )
        self.assertEqual(
            wiki.resolve_doc_target(source, "../../deploy/settings.html"),
            "en-deploy-settings",
        )
        self.assertEqual(
            wiki.resolve_doc_target(source, "/en/deploy/pipelines/readme#request-variables"),
            "en-usage-pipelines-readme#request-variables",
        )

    def test_build_creates_flat_pages_and_navigation(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            for language in wiki.LANGUAGES:
                path = root / language / "guide.mdx"
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(f"---\ntitle: {language} Guide\n---\nContent\n", encoding="utf-8")
            output = root / "out"
            count = wiki.build(root, output)
            self.assertEqual(count, 3)
            self.assertTrue((output / "zh-guide.md").is_file())
            self.assertIn("[zh Guide](zh-guide)", (output / "_Sidebar.md").read_text())
            self.assertTrue((output / "Home.md").is_file())


if __name__ == "__main__":
    unittest.main()

#!/usr/bin/env python3
"""Build a GitHub Wiki-compatible mirror from the Mintlify MDX sources."""

from __future__ import annotations

import argparse
import re
import shutil
from pathlib import Path, PurePosixPath
from urllib.parse import urlsplit, urlunsplit

LANGUAGES = {"zh": "简体中文", "en": "English", "ja": "日本語"}
DOC_EXTENSIONS = (".md", ".mdx", ".html")
CALLOUTS = {"Info": "NOTE", "Note": "NOTE", "Tip": "TIP", "Warning": "WARNING"}
MOVED_SECTIONS = {"platforms", "models", "pipelines", "knowledge", "mcp"}


def page_name(path: PurePosixPath) -> str:
    return path.with_suffix("").as_posix().replace("/", "-")


def extract_frontmatter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}, text
    metadata: dict[str, str] = {}
    for line in text[4:end].splitlines():
        key, separator, value = line.partition(":")
        if separator:
            metadata[key.strip()] = value.strip().strip('"\'')
    return metadata, text[end + 5 :]


def resolve_doc_target(source: PurePosixPath, target: str) -> str | None:
    parsed = urlsplit(target)
    if parsed.scheme or parsed.netloc or target.startswith("#"):
        return None
    raw_path = parsed.path
    if not raw_path:
        return None
    resolved = PurePosixPath(raw_path.lstrip("/")) if raw_path.startswith("/") else source.parent / raw_path
    parts: list[str] = []
    for part in resolved.parts:
        if part in ("", "."):
            continue
        if part == "..":
            if parts:
                parts.pop()
        else:
            parts.append(part)
    if not parts or parts[0] not in LANGUAGES:
        return None
    normalized = PurePosixPath(*parts)
    suffix = normalized.suffix.lower()
    if suffix in DOC_EXTENSIONS:
        normalized = normalized.with_suffix("")
    elif suffix:
        return None
    # Mintlify redirects these sections from their old deploy location. Apply the
    # same redirect in the flat Wiki mirror so historical source links still work.
    if len(normalized.parts) >= 3 and normalized.parts[1] == "deploy" and normalized.parts[2] in MOVED_SECTIONS:
        normalized = PurePosixPath(normalized.parts[0], "usage", *normalized.parts[2:])
    return urlunsplit(("", "", page_name(normalized), parsed.query, parsed.fragment))


def rewrite_url(source: PurePosixPath, target: str, *, image: bool = False) -> str:
    parsed = urlsplit(target)
    if parsed.scheme or parsed.netloc or target.startswith(("#", "mailto:")):
        return target
    if image:
        path = parsed.path.lstrip("/") if parsed.path.startswith("/") else (source.parent / parsed.path).as_posix()
        return urlunsplit(("https", "raw.githubusercontent.com", f"/langbot-app/langbot-wiki/main/{path}", parsed.query, parsed.fragment))
    return resolve_doc_target(source, target) or target


def convert_callouts(text: str) -> str:
    pattern = re.compile(
        r"<(Info|Note|Tip|Warning)(?:\s+title=(?:\"([^\"]*)\"|'([^']*)'))?\s*>(.*?)</\1>",
        re.DOTALL,
    )

    def replace(match: re.Match[str]) -> str:
        component = match.group(1)
        title = match.group(2) or match.group(3) or ""
        body = match.group(4).strip()
        lines = [f"> [!{CALLOUTS[component]}]"]
        if title:
            lines.append(f"> **{title}**")
        lines.extend(">" if not line else f"> {line}" for line in body.splitlines())
        return "\n".join(lines)

    previous = None
    while previous != text:
        previous = text
        text = pattern.sub(replace, text)
    return text


def convert_mdx(source: PurePosixPath, text: str) -> tuple[str, str]:
    metadata, body = extract_frontmatter(text)
    title = metadata.get("title") or source.stem.replace("-", " ").title()
    body = convert_callouts(body)
    body = re.sub(
        r'<Accordion\s+title=(?:"([^"]*)"|\'([^\']*)\')\s*>',
        lambda m: f"\n<details>\n<summary><strong>{m.group(1) or m.group(2)}</strong></summary>\n",
        body,
    )
    body = body.replace("</Accordion>", "\n</details>")
    body = re.sub(r"</?AccordionGroup\s*>", "", body)
    body = re.sub(
        r"(!\[[^\]]*\]\()([^)\s]+)([^)]*\))",
        lambda m: m.group(1) + rewrite_url(source, m.group(2), image=True) + m.group(3),
        body,
    )
    body = re.sub(
        r"(?<!!)\[([^\]]+)\]\(([^)\s]+)([^)]*)\)",
        lambda m: f"[{m.group(1)}]({rewrite_url(source, m.group(2))}{m.group(3)})",
        body,
    )
    body = re.sub(
        r'(<img\b[^>]*?\bsrc=["\'])([^"\']+)(["\'])',
        lambda m: m.group(1) + rewrite_url(source, m.group(2), image=True) + m.group(3),
        body,
        flags=re.IGNORECASE,
    )
    body = body.replace("<br />", "<br>")
    body = re.sub(r"\n{3,}", "\n\n", body).strip()
    return title, f"# {title}\n\n{body}\n"


def discover_documents(root: Path) -> list[Path]:
    return sorted(path for language in LANGUAGES for path in (root / language).rglob("*.mdx"))


def build(root: Path, output: Path) -> int:
    documents = discover_documents(root)
    if not documents:
        raise SystemExit("No MDX documents found")
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)
    index: dict[str, list[tuple[str, str]]] = {language: [] for language in LANGUAGES}
    for path in documents:
        source = PurePosixPath(path.relative_to(root).as_posix())
        title, converted = convert_mdx(source, path.read_text(encoding="utf-8"))
        name = page_name(source)
        (output / f"{name}.md").write_text(converted, encoding="utf-8")
        index[source.parts[0]].append((name, title))
    home = [
        "# LangBot Documentation",
        "",
        "This GitHub Wiki is automatically synchronized from [langbot-app/langbot-wiki](https://github.com/langbot-app/langbot-wiki).",
        "",
    ]
    sidebar = ["## LangBot Documentation", ""]
    for language, label in LANGUAGES.items():
        pages = index[language]
        home.extend((f"## {label}", "", f"[{pages[0][1]}]({pages[0][0]})", ""))
        sidebar.extend((f"### {label}", ""))
        sidebar.extend(f"- [{title}]({name})" for name, title in pages)
        sidebar.append("")
    (output / "Home.md").write_text("\n".join(home).rstrip() + "\n", encoding="utf-8")
    (output / "_Sidebar.md").write_text("\n".join(sidebar).rstrip() + "\n", encoding="utf-8")
    (output / "_Footer.md").write_text(
        "Automatically synchronized from [langbot-app/langbot-wiki](https://github.com/langbot-app/langbot-wiki).\n",
        encoding="utf-8",
    )
    return len(documents)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--output", type=Path, default=Path("dist/github-wiki"))
    args = parser.parse_args()
    count = build(args.root.resolve(), args.output.resolve())
    print(f"Built {count} GitHub Wiki pages in {args.output}")


if __name__ == "__main__":
    main()

#!/usr/bin/env node

import { writeFile } from "node:fs/promises";

const base = "https://docs.langbot.app";
const source = process.env.SITEMAP_SOURCE ?? `${base}/sitemap.xml`;
const output = new URL("../sitemap-alternates.xml", import.meta.url);
const locales = ["en", "zh", "ja"];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const response = await fetch(source, {
  headers: { "user-agent": "LangBot docs alternate-sitemap generator" },
});
if (!response.ok) {
  throw new Error(`Unable to fetch ${source}: ${response.status}`);
}

const sitemap = await response.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
  match[1].replaceAll("&amp;", "&"),
);
const groups = new Map();

for (const url of urls) {
  for (const locale of locales) {
    const prefix = `${base}/${locale}/`;
    if (!url.startsWith(prefix)) continue;
    const suffix = url.slice(prefix.length);
    const group = groups.get(suffix) ?? {};
    group[locale] = url;
    groups.set(suffix, group);
    break;
  }
}

const translatedGroups = [...groups.values()]
  .filter((group) => group.en && group.zh)
  .sort((left, right) => left.en.localeCompare(right.en));
const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
];

for (const group of translatedGroups) {
  const alternates = [
    ["en", group.en],
    ["zh-CN", group.zh],
    ...(group.ja ? [["ja", group.ja]] : []),
    ["x-default", group.zh],
  ];
  for (const locale of locales) {
    if (!group[locale]) continue;
    lines.push("  <url>", `    <loc>${escapeXml(group[locale])}</loc>`);
    for (const [language, href] of alternates) {
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(href)}" />`,
      );
    }
    lines.push("  </url>");
  }
}
lines.push("</urlset>");

await writeFile(output, `${lines.join("\n")}\n`);
console.log(
  `Wrote ${translatedGroups.length} reciprocal language groups to ${output.pathname}`,
);

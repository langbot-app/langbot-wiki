import assert from "node:assert/strict";
import { access, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { collectMdxDocuments } from "../scripts/prepare-fumapress.mjs";

const root = path.resolve(import.meta.dirname, "..");
const publicRoot = path.join(root, "dist/public");

async function collectHtmlRoutes(directory) {
  const routes = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) routes.push(...await collectHtmlRoutes(target));
    else if (entry.name === "index.html") routes.push(target);
  }
  return routes;
}

function staticHtmlForCanonicalDocument(document) {
  const parts = document.replace(/\.mdx$/, "").split("/");
  if (parts.at(-1) === "index") parts.pop();
  return path.join(publicRoot, ...parts, "index.html");
}

test("all 302 canonical localized documents have static HTML", async () => {
  const documents = await collectMdxDocuments(root);
  assert.equal(documents.length, 302);
  const missing = [];
  for (const document of documents) {
    try {
      await access(staticHtmlForCanonicalDocument(document));
    } catch {
      missing.push(document);
    }
  }
  assert.deepEqual(missing, []);
});

test("every fixed redirect destination resolves to generated output", async () => {
  const redirects = (await readFile(path.join(publicRoot, "_redirects"), "utf8"))
    .trim().split("\n").map((line) => line.split(/\s+/));
  for (const [source, destination] of redirects) {
    if (destination.includes(":splat")) continue;
    const target = destination.replace(/^\//, "").replace(/\/$/, "");
    await access(path.join(publicRoot, target, "index.html"), undefined, `${source} -> ${destination}`);
  }
});

test("static routes never repeat their locale prefix", async () => {
  for (const locale of ["en", "zh", "ja"]) {
    await assert.rejects(access(path.join(publicRoot, locale, locale)), { code: "ENOENT" });
  }
});

test("representative localized guides and canonical host are emitted", async () => {
  for (const locale of ["en", "zh", "ja"]) {
    await access(path.join(publicRoot, locale, "insight/guide/index.html"));
  }
  const sitemap = await readFile(path.join(publicRoot, "sitemap.xml"), "utf8");
  const robots = await readFile(path.join(publicRoot, "robots.txt"), "utf8");
  assert.match(sitemap, /https:\/\/docs\.langbot\.dev\//);
  assert.doesNotMatch(sitemap, /https:\/\/docs\.langbot\.app\//);
  assert.match(robots, /https:\/\/docs\.langbot\.dev\/sitemap\.xml/);
  assert.doesNotMatch(robots, /https:\/\/docs\.langbot\.app\//);
});

test("all locales emit the OpenAPI surface with endpoint semantics", async () => {
  const representatives = {
    en: ["Get system information", "GET", "/api/v1/system/info"],
    zh: ["获取系统信息", "GET", "/api/v1/system/info"],
    ja: ["获取系统信息", "GET", "/api/v1/system/info"],
  };
  const sitemap = await readFile(path.join(publicRoot, "sitemap.xml"), "utf8");

  for (const [locale, semantics] of Object.entries(representatives)) {
    const apiRoot = path.join(publicRoot, locale, "api-reference");
    const routes = await collectHtmlRoutes(apiRoot);
    assert.ok(routes.length >= 50, `${locale} emitted only ${routes.length} API routes`);

    const representative = path.join(apiRoot, "api/v1/system/info/get/index.html");
    const html = await readFile(representative, "utf8");
    for (const semantic of semantics) assert.ok(html.includes(semantic), `${locale} page is missing ${semantic}`);
    assert.ok(sitemap.includes(`https://docs.langbot.dev/${locale}/api-reference/api/v1/system/info/get`));
  }
});


const locales = ["en", "zh", "ja"];
const hreflangByLocale = { en: "en", zh: "zh-CN", ja: "ja" };
const zhOnlyRoutes = [
  "develop/adapter/discord/README",
  "develop/adapter/discord/api_reference",
  "develop/adapter/discord/design",
  "develop/adapter/discord/quick_start",
  "develop/adapter/discord/troubleshooting",
  "tob/contact",
  "tob/index",
  "tob/platform",
  "tob/provider",
  "usage/pipelines/tbox",
  "usage/platforms/qq/official",
  "usage/platforms/wechat/wechatpad",
  "workshop/shengsuanyun-integration",
  "workshop/tokenpony-integration",
];

function routeFromHtml(file) {
  const relative = path.relative(publicRoot, path.dirname(file)).split(path.sep).join("/");
  return `/${relative}`.replace(/\/$/, "");
}

function extractHeadLinks(html, rel) {
  return [...html.matchAll(/<link\s+([^>]+)>/g)]
    .map((match) => match[1])
    .filter((attributes) => new RegExp(`(?:^|\\s)rel="${rel}"(?:\\s|$)`).test(attributes))
    .map((attributes) => ({
      href: attributes.match(/(?:^|\s)href="([^"]+)"/)?.[1]?.replaceAll("&amp;", "&"),
      hreflang: attributes.match(/(?:^|\s)hrefLang="([^"]+)"/i)?.[1],
    }));
}

test("rendered navbar uses each locale's docs.json labels and hrefs", async () => {
  const expected = {
    en: ["Home", "https://langbot.app/en", "Roadmap", "https://langbot.app/en/roadmap"],
    zh: ["首页", "https://langbot.app/zh", "路线图", "https://langbot.app/zh/roadmap"],
    ja: ["ホーム", "https://langbot.app/ja", "ロードマップ", "https://langbot.app/ja/roadmap"],
  };
  for (const locale of locales) {
    const html = await readFile(path.join(publicRoot, locale, "insight/guide/index.html"), "utf8");
    for (const value of expected[locale]) assert.ok(html.includes(value), `${locale} navbar missing ${value}`);
    for (const languageName of ["English", "简体中文", "日本語"]) {
      assert.ok(html.includes(languageName), `${locale} language selector missing ${languageName}`);
    }
    for (const other of locales.filter((item) => item !== locale)) {
      assert.ok(!html.includes(expected[other][1]), `${locale} navbar includes ${other} home link`);
    }
  }
});

test("the exact 14 zh-only sources publish no fallback en or ja routes", async () => {
  const documents = await collectMdxDocuments(root);
  const byLocale = Object.fromEntries(locales.map((locale) => [
    locale,
    new Set(documents.filter((item) => item.startsWith(`${locale}/`)).map((item) => item.slice(3).replace(/\.mdx$/, ""))),
  ]));
  const actual = [...byLocale.zh].filter((route) => !byLocale.en.has(route) && !byLocale.ja.has(route)).sort();
  assert.deepEqual(actual, zhOnlyRoutes);

  const searchableOutputs = await Promise.all(
    ["sitemap.xml", "llms.txt", "llms-full.txt", "api/search"].map((file) => readFile(path.join(publicRoot, file), "utf8")),
  );
  for (const sourceRoute of zhOnlyRoutes) {
    const route = sourceRoute === "index" ? "" : sourceRoute.replace(/\/index$/, "");
    await access(path.join(publicRoot, "zh", route, "index.html"));
    for (const locale of ["en", "ja"]) {
      await assert.rejects(access(path.join(publicRoot, locale, route, "index.html")), { code: "ENOENT" });
      for (const output of searchableOutputs) {
        assert.doesNotMatch(
          output,
          new RegExp(`/${locale}/${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z0-9_-])`),
          `${locale}/${route} leaked into an index`,
        );
      }
    }
  }
});

test("every page emits a canonical and reciprocal available hreflangs", async () => {
  const sitemap = await readFile(path.join(publicRoot, "sitemap.xml"), "utf8");
  const routes = new Set([...sitemap.matchAll(/<loc>https:\/\/docs\.langbot\.dev(\/[^<]+)<\/loc>/g)].map((match) => match[1].replace(/\/$/, "")));
  const allFiles = await collectHtmlRoutes(publicRoot);
  const localized = allFiles.filter((file) => routes.has(routeFromHtml(file)));
  for (const file of localized) {
    const route = routeFromHtml(file);
    const html = await readFile(file, "utf8");
    const canonical = extractHeadLinks(html, "canonical");
    assert.deepEqual(canonical, [{ href: `https://docs.langbot.dev${route}`, hreflang: undefined }], route);

    const [, locale, ...suffixParts] = route.split("/");
    const suffix = suffixParts.join("/");
    const expected = {};
    for (const candidate of locales) {
      const candidateRoute = `/${candidate}/${suffix}`.replace(/\/$/, "");
      if (routes.has(candidateRoute)) expected[hreflangByLocale[candidate]] = `https://docs.langbot.dev${candidateRoute}`;
    }
    expected["x-default"] = expected.en ?? expected["zh-CN"] ?? expected.ja;
    const actual = Object.fromEntries(
      extractHeadLinks(html, "alternate")
        .filter((item) => item.hreflang)
        .map((item) => [item.hreflang, item.href]),
    );
    assert.deepEqual(actual, expected, route);
  }
});

test("alternate sitemap is complete, reciprocal, and advertised", async () => {
  const sitemap = await readFile(path.join(publicRoot, "sitemap-alternates.xml"), "utf8");
  const robots = await readFile(path.join(publicRoot, "robots.txt"), "utf8");
  assert.match(robots, /^Sitemap: https:\/\/docs\.langbot\.dev\/sitemap\.xml$/m);
  assert.match(robots, /^Sitemap: https:\/\/docs\.langbot\.dev\/sitemap-alternates\.xml$/m);

  const blocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
  const groups = new Map();
  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const links = Object.fromEntries([...block.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((match) => [match[1], match[2]]));
    assert.ok(loc && links.en && links["zh-CN"] && links.ja && links["x-default"]);
    const key = [links.en, links["zh-CN"], links.ja].join("\n");
    groups.set(key, [...(groups.get(key) ?? []), loc]);
  }
  assert.ok(groups.size >= 155, `only ${groups.size} shared groups`);
  for (const [key, locations] of groups) assert.deepEqual(locations.sort(), key.split("\n").sort());
  for (const slug of [
    "articles",
    "articles/langbot-cloud-multi-user-workspaces",
    "articles/langbot-v4100-sandbox-skills",
    "articles/langbot-v490-rag-plugin-architecture",
    "articles/langbot-plugin-system-deep-dive",
    "articles/langtars-remote-pc-control-dify-n8n",
    "articles/connect-deepseek-to-wechat",
    "articles/deploy-ai-bot-in-5-minutes",
    "articles/dify-agent-discord-telegram-slack",
    "articles/langflow-drag-and-drop-ai-bot",
    "articles/n8n-multi-platform-ai-chatbot",
    "articles/dify-langbot-rag-knowledge-base",
    "articles/welcome",
  ]) assert.ok(sitemap.includes(`https://docs.langbot.dev/en/${slug}`), `alternate sitemap missing ${slug}`);
});

test("generated pages contain no internal .html route links", async () => {
  const offenders = [];
  for (const file of await collectHtmlRoutes(publicRoot)) {
    const html = await readFile(file, "utf8");
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1].replaceAll("&amp;", "&");
      if (/^(?:https?:|mailto:|tel:|#|\/\/)/.test(href)) continue;
      const pathname = href.split(/[?#]/, 1)[0];
      if (pathname.endsWith(".html")) offenders.push([routeFromHtml(file), href]);
    }
    for (const match of html.matchAll(/href="(\/[^"?#]+\.html)(?:[?#][^"]*)?"/g)) offenders.push([routeFromHtml(file), match[1]]);
  }
  assert.deepEqual(offenders, []);
});


test("static search stays within Cloudflare Pages' 25 MiB file limit", async () => {
  const search = await stat(path.join(publicRoot, "api/search"));
  assert.ok(search.size <= 25 * 1024 * 1024, `search artifact is ${search.size} bytes`);
});

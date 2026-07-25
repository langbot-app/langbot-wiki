import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const repoRoot = new URL("../", import.meta.url);
const cjk = /[\u3400-\u4DBF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/u;

test("repository-only English README is excluded from Mintlify publishing", async () => {
  const mintignore = await readFile(new URL(".mintignore", repoRoot), "utf8");
  const patterns = mintignore
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  let ignored = false;
  for (const pattern of patterns) {
    if (pattern === "README_EN.md") ignored = true;
    if (pattern === "!README_EN.md") ignored = false;
  }

  assert.equal(ignored, true);
});

test("the historical README_EN URL keeps its permanent canonical redirect", async () => {
  const docs = JSON.parse(await readFile(new URL("docs.json", repoRoot), "utf8"));
  const redirects = docs.redirects.filter(
    (item) => item.source === "/README_EN",
  );

  assert.equal(redirects.length, 1);
  assert.equal(redirects[0].destination, "/en/insight/guide");
  assert.notEqual(redirects[0].permanent, false);
});

test("custom robots policy is served from the Mintlify project root", async () => {
  const robots = await readFile(new URL("robots.txt", repoRoot), "utf8");
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/_next\/$/m);
  assert.match(
    robots,
    /^Sitemap: https:\/\/docs\.langbot\.app\/sitemap\.xml$/m,
  );
  assert.match(
    robots,
    /^Sitemap: https:\/\/docs\.langbot\.app\/sitemap-alternates\.xml$/m,
  );
});

test("alternate sitemap declares reciprocal en, zh-CN, ja and x-default links", async () => {
  const sitemap = await readFile(
    new URL("sitemap-alternates.xml", repoRoot),
    "utf8",
  );
  const blocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
    (match) => match[1],
  );
  assert.ok(blocks.length > 0);

  const groups = new Map();
  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    assert.ok(loc);
    const links = Object.fromEntries(
      [...block.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map(
        (match) => [match[1], match[2]],
      ),
    );
    assert.ok(links.en);
    assert.ok(links["zh-CN"]);
    assert.equal(links["x-default"], links["zh-CN"]);
    const reciprocalUrls = [links.en, links["zh-CN"], links.ja].filter(Boolean);
    const key = reciprocalUrls.join("\n");
    groups.set(key, [...(groups.get(key) ?? []), loc]);
  }

  assert.ok(groups.size > 0);
  for (const [key, locations] of groups) {
    assert.deepEqual(locations.sort(), key.split("\n").sort());
  }
});

test("English Service API specification contains no CJK copy", async () => {
  const source = await readFile(
    new URL("openapi/service-api-en.json", repoRoot),
    "utf8",
  );
  assert.doesNotThrow(() => JSON.parse(source));
  const matches = [...source.matchAll(new RegExp(cjk.source, "gu"))];
  assert.equal(matches.length, 0, `found ${matches.length} CJK code points`);
});

test("translated English API routes preserve every historical Chinese URL", async () => {
  const docs = JSON.parse(await readFile(new URL("docs.json", repoRoot), "utf8"));
  const redirects = docs.redirects.filter((item) =>
    item.source.startsWith("/en/api-reference/") && cjk.test(item.source),
  );
  cjk.lastIndex = 0;

  assert.equal(redirects.length, 57);
  assert.equal(new Set(redirects.map((item) => item.source)).size, 57);
  for (const redirect of redirects) {
    assert.equal(redirect.permanent, true);
    assert.match(redirect.destination, /^\/en\/api-reference\//);
    assert.doesNotMatch(redirect.destination, cjk);
    cjk.lastIndex = 0;
  }
});

test("every Markdown image in the English guide has descriptive alt text", async () => {
  const guide = await readFile(
    new URL("en/insight/guide.mdx", repoRoot),
    "utf8",
  );
  const images = [...guide.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
  assert.ok(images.length > 0, "expected at least one Markdown image");

  for (const [, alt, src] of images) {
    assert.ok(alt.trim().length >= 8, `${src} is missing descriptive alt text`);
  }
});

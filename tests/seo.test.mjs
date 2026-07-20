import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const repoRoot = new URL("../", import.meta.url);

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

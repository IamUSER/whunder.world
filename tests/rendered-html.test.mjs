import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("exports a complete static WhunderWorld home page", async () => {
  const html = await readFile(new URL("dist/client/index.html", root), "utf8");

  assert.match(html, /WhunderWorld \| Terraria Fan Server/i);
  assert.match(html, /aria-label="WhunderWorld"/);
  assert.match(html, /A Terraria fan server since 2012/);
  assert.match(html, /From the Guide/);
  assert.match(html, /class="bunny-sprite"/);
  assert.doesNotMatch(html, /guide-sprite|guide-hat|guide-head|guide-body/);
  assert.match(html, /Campfire Notes/);
  assert.match(html, /Coming soon/);
  assert.match(html, /The message board is being crafted/);
  assert.doesNotMatch(html, /campfire-name|campfire-message|Notes on this device/);
  assert.match(html, /The World Vault/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the build portable and database-free", async () => {
  const [hosting, workflow, page, layout, packageJson] = await Promise.all([
    readFile(new URL("dist/.openai/hosting.json", root), "utf8"),
    readFile(new URL(".github/workflows/pages.yml", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  const config = JSON.parse(hosting);
  assert.equal(config.d1, null);
  assert.equal(config.r2, null);
  assert.match(workflow, /dist\/client/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(page, /downloads\/archive-manifest\.txt/);
  assert.match(page, /import Link from "next\/link"/);
  assert.equal(page.match(/href=["']#[^"']+["']/g)?.length, 8);
  assert.equal(page.match(/prefetch=\{false\}/g)?.length, 8);
  assert.doesNotMatch(page, /<a[^>]*href=["']#/);
  assert.doesNotMatch(page, /\shref=["']\//);
  assert.doesNotMatch(layout, /codex-preview|Starter Project/i);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("dist/client/downloads/archive-manifest.txt", root));
  await access(new URL("dist/client/og.png", root));
});

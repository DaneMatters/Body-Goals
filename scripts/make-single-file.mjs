/**
 * Inlines the LOCAL_BUILD Vite output (dist/local) into one self-contained
 * index.html with no external assets, suitable for Cloudflare's
 * "Upload your static files" flow or opening directly in a browser.
 *
 * Usage: LOCAL_BUILD=1 vite build && node scripts/make-single-file.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist/local");
const OUT_DIR = path.join(ROOT, "dist/single");
const OUT_FILE = path.join(OUT_DIR, "index.html");

let html = readFileSync(path.join(DIST, "index.html"), "utf-8");

html = html.replace(
  /<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g,
  (_match, src) => {
    const js = readFileSync(path.join(DIST, src.replace(/^\//, "")), "utf-8");
    return `<script type="module">${js}</script>`;
  },
);

html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_match, href) => {
  const css = readFileSync(path.join(DIST, href.replace(/^\//, "")), "utf-8");
  return `<style>${css}</style>`;
});

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, html);
console.log(`Wrote ${OUT_FILE} (${(html.length / 1024).toFixed(0)} KB)`);

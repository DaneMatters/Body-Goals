import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

// LOCAL_BUILD=1 produces a serverless build: the API layer is swapped for the
// localStorage backend (src/api.local.ts) and the Cloudflare worker plugin is
// skipped, so `scripts/make-single-file.mjs` can inline it into one HTML file.
const localBuild = process.env.LOCAL_BUILD === "1";

export default defineConfig({
  plugins: localBuild ? [react()] : [react(), cloudflare({ inspectorPort: false })],
  resolve: localBuild
    ? {
        alias: [
          {
            find: /^\.\.?\/api$/,
            replacement: path.resolve(import.meta.dirname, "src/api.local.ts"),
          },
        ],
      }
    : undefined,
  build: localBuild ? { outDir: "dist/local" } : undefined,
});

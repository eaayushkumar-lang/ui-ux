import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { readFileSync } from "node:fs";
import path from "node:path";

// Layout-only self-contained preview: one dist-preview/index.html with JS +
// CSS inlined. The CloudFront video, Google Fonts, and portrait remain
// external and are blocked by the artifact CSP - this shows structure /
// glass UI / type layout only, not the cinematic video design.
function inlineFavicon(faviconPath: string): Plugin {
  return {
    name: "inline-favicon",
    transformIndexHtml(html) {
      const svg = readFileSync(faviconPath, "utf8");
      const uri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      return html.replace(/href="\.?\/?favicon\.svg"/, `href="${uri}"`);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), inlineFavicon(path.resolve(__dirname, "public/favicon.svg")), viteSingleFile()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    outDir: "dist-preview",
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});

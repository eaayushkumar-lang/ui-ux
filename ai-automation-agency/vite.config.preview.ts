import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Preview-only build: emits ONE self-contained `dist-preview/index.html`
 * with the JS, CSS, and fonts all inlined, for hosts that block every
 * external request (the Artifact CSP, an email-able file, an offline demo).
 * The normal `vite.config.ts` build keeps code-splitting; this one folds
 * everything into one file, which a single HTML can't code-split.
 */
function inlineHtmlRefs(title: string, faviconPath: string): Plugin {
  return {
    name: "preview-inline-html-refs",
    transformIndexHtml(html) {
      const favicon = readFileSync(faviconPath, "utf8");
      const faviconUri = `data:image/svg+xml,${encodeURIComponent(favicon)}`;
      return html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
        .replace(/href="\.?\/?favicon\.svg"/, `href="${faviconUri}"`);
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    inlineHtmlRefs("Automation Agency Landing", path.resolve(__dirname, "public/favicon.svg")),
    viteSingleFile(),
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    outDir: "dist-preview",
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});

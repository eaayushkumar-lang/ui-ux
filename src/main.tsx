import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import outfitFontUrl from "@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2?url";

// Preload the variable Outfit font as early as possible - it's the body
// font for the entire site, so the browser would otherwise only discover
// it after parsing index.css's @import. The hashed build URL isn't known
// until build time, hence a Vite `?url` import rather than a static
// <link> in index.html.
const fontPreload = document.createElement("link");
fontPreload.rel = "preload";
fontPreload.as = "font";
fontPreload.type = "font/woff2";
fontPreload.href = outfitFontUrl;
fontPreload.crossOrigin = "anonymous";
document.head.appendChild(fontPreload);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { cloudflare } from "@cloudflare/vite-plugin";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [paraglideVitePlugin({
    project: "./project.inlang",
    outdir: "./src/paraglide",
    strategy: ["localStorage", "preferredLanguage", "baseLocale"],
  }), devtools(), tailwindcss(), tanstackStart(), viteReact(), cloudflare({
    viteEnvironment: {
      name: "ssr"
    }
  })],
});

export default config;
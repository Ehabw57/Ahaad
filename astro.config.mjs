// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://ahaad.tools",
  devToolbar: {
    enabled: false,
  },
  integrations: [
    icon({
      iconDir: "src/assets/icons",
    }),
    preact(),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@jsquash/oxipng"],
    },
  },
});

// @ts-check
import { defineConfig, fontProviders, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://thewasteatlas.com",
  trailingSlash: "never",
  output: "static",
  compressHTML: false,

  env: {
    schema: {
      DIRECTUS_URL: envField.string({
        context: "server",
        access: "public",
        default: "https://directus.thewasteatlas.com",
        optional: true,
      }),
      DIRECTUS_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },

  image: {
    domains: ["directus.thewasteatlas.com", "placehold.co"],
  },

  experimental: {
    fonts: [
      {
        provider: "local",
        name: "Switzer",
        cssVariable: "--font-switzer",
        fallbacks: ["system-ui", "sans-serif"],
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/Switzer-Variable.woff2"],
          },
        ],
      },
      {
        provider: "local",
        name: "Erode",
        cssVariable: "--font-erode",
        fallbacks: [
          "Charter",
          "Bitstream Charter",
          "Sitka Text",
          "Cambria",
          "serif",
        ],
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/Erode-Variable.woff2"],
          },
        ],
      },
    ],
  },

  vite: {
    build: {
      minify: false,
      cssMinify: false,
    },
    plugins: [tailwindcss()],
  },
});

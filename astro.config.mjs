// @ts-check
import { defineConfig, fontProviders, envField } from 'astro/config';

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  env: {
      schema: {
          DIRECTUS_URL: envField.string({context: "server", access: "public", default: "https://directus.thewasteatlas.com"}),
          DIRECTUS_TOKEN: envField.string({context: "server", access: "secret", optional: true})
      }
  },

  experimental: {
      fonts: [
          {
              provider: fontProviders.fontshare(),
              name: "switzer",
              cssVariable: "--font-switzer"
          },
          {
              provider: fontProviders.fontshare(),
              name: "erode",
              cssVariable: "--font-erode",
          }
      ]    
  },

  adapter: node({
    mode: "standalone"
  })
});

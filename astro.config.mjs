// @ts-check
import { defineConfig, fontProviders, envField } from 'astro/config';

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    env: {
        schema: {
            DIRECTUS_URL: envField.string({ context: "server", access: "public", default: "https://directus.thewasteatlas.com" }),
            DIRECTUS_TOKEN: envField.string({ context: "server", access: "secret", optional: true })
        }
    },

    experimental: {
        fonts: [
            {
                provider: "local",
                name: "Switzer",
                cssVariable: "--font-switzer",
                variants: [
                    {
                        weight: "100 900",
                        style: "normal",
                        src: ["./src/assets/fonts/Switzer-Variable.woff2"],
                    }
                ]
            },
            {
                provider: "local",
                name: "Erode",
                cssVariable: "--font-erode",
                variants: [
                    {
                        weight: "100 900",
                        style: "normal",
                        src: ["./src/assets/fonts/Erode-Variable.woff2"]
                    }
                ]
            }
        ]
    },

    adapter: node({
        mode: "standalone"
    }),

    vite: {
        build: {
          minify: false,
          cssMinify: false,
        },
      },
    compressHTML: false,
});

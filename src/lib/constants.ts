import type { CollectionEntry } from "astro:content"

type Category = CollectionEntry<"wastes">["data"]["category"]

export const categoryColors = {
  domestic: {
    sub: "#FF0080",
    banner: "#FF0080",
    bg: "#FF0080",
  },
  construction: {
    sub: "#FF0000",
    banner: "#FF0000",
    bg: "#FF0000",
  },
  agricultural: {
    sub: "#08FF18",
    banner: "#08FF18",
    bg: "#08FF18",
  },
  industrial: {
    sub: "#0810FF",
    banner: "#0810FF",
    bg: "#0810FF",
  },
  unknown: {
    sub: "#D8B4FE",
    banner: "#C084FC",
    bg: "#C084FC",
  },
} as const satisfies Record<Category, { sub: string; banner: string; bg: string }>

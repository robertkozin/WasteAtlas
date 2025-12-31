import type { CollectionEntry } from "astro:content";

type Category = CollectionEntry<"wastes">["data"]["category"];

export const categoryColors = {
  domestic: {
    sub: "#9967C9",
    banner: "#9B67CC",
    bg: "#9967CA",
  },
  construction: {
    sub: "#FD4109",
    banner: "#FC4008",
    bg: "#FC4008",
  },
  agricultural: {
    sub: "#979C35",
    banner: "#979C35",
    bg: "#979C35",
  },
  industrial: {
    sub: "#B6B4BF",
    banner: "#A1A1A1",
    bg: "#A1A1A1",
  },
  unknown: {
    sub: "#D8B4FE",
    banner: "#C084FC",
    bg: "#C084FC",
  },
} as const satisfies Record<
  Category,
  { sub: string; banner: string; bg: string }
>;

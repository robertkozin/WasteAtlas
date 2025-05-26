import { defineCollection, z, reference } from "astro:content";
import directus from "./lib/directus";
import { readItems, readFiles } from "@directus/sdk";
import { optional } from "astro:schema";
import type {
  Loader,
  LoaderContext,
  DataStore,
  MetaStore,
} from "astro/loaders";

import {
  findPoint,
  findPolygon,
  isGeometryCollection,
  isPoint,
  isPolygon,
  onlyCoords,
} from "./utils";
import { randomPosition } from "@turf/turf";

function wasteLoader(): Loader {
  return {
    name: "waste-loader",
    load: async (context) => {
      let {store, meta, logger} = context
      let lastModified = meta.get("lastModified") ?? new Date(0).toISOString();
      logger.info(`lastModified: ${lastModified}`);

      directus
        .request(
          readItems("waste", {
            fields: ["*"],
            filter: { date_updated: { _gte: lastModified } },
            sort: ["name", "location"],
          })
        )
        .then((waste) =>
          waste.map((waste, idx) => {
            let point = waste.point
              ? onlyCoords(findPoint(waste.point))
              : randomPosition([-56.678467, 20.231275, -25.389404, 40.522151]);
            let blob = waste.point ? onlyCoords(findPolygon(waste.point)) : [];

            let cat = waste.category;
            let colour =
              cat === "domestic"
                ? "#9967CA"
                : cat === "commercial"
                ? "#FC4008"
                : cat === "agricultural"
                ? "#979C35"
                : cat === "industrial"
                ? "#A1A1A1"
                : "pink";

            return { ...waste, blob, point, colour, order: idx };
          })
        )
        .then((waste) => set(context, waste));
    },
    schema: z.object({
      id: z.number().int(),
      name: z.string(),
      location: z.string(),
      category: z.string().default("unknown"),
      slug: z.optional(z.string()),
      characteristics: z.string().default(""),
      image: z.optional(reference("images")),
      projects: z.array(reference("projects")).default([]),
      point: z.array(z.number()).length(2),
      blob: z.array(z.array(z.number()).length(2)),
      order: z.number().int(),
    }),
  };
}

function imageLoader(): Loader {
  return {
    name: "image-loader",
    load: async (context) => {
      let {store, meta, logger} = context
      let lastModified = meta.get("lastModified") ?? new Date(0).toISOString();
      logger.info(`lastModified: ${lastModified}`);

      directus
        .request(
          readFiles({
            fields: ["*"],
            // TODO: filter image type
            filter: { modified_on: { _gte: lastModified } },
          })
        )
        .then((images) => set(context, images));
    },
    schema: z.object({
      id: z.string(),
      filename_disk: z.optional(z.string()),
      filename_download: z.string(),
      title: z.optional(z.string()),
      type: z.optional(z.string()),
      width: z.optional(z.number()),
      height: z.optional(z.number()),
      filesize: z.optional(z.number()),
      description: z.optional(z.string()),
      location: z.optional(z.string()),
      tags: z.optional(z.array(z.string())),
      metadata: z.optional(z.record(z.any())),
    }),
  };
}

function set<T>(ctx: LoaderContext, items: T[]) {
  let setCount = 0
  for (const item of items) {
    ctx.store.set({
      id: item.id.toString(),
      data: item,
    }) ? setCount += 1 : undefined;
  }
  ctx.meta.set("lastModified", new Date().toISOString());
  ctx.logger.info(`setCount: ${setCount}`)
}

const wastes = defineCollection({
  loader: wasteLoader(),
})

const images = defineCollection({
  loader: imageLoader(),
})

export const collections = { wastes, images };

import { defineCollection, z, reference } from "astro:content";
import directus, {
  directusLoader,
  idsToString,
  idToString,
} from "./lib/directus";
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
import { circle, randomPoint, randomPosition } from "@turf/turf";
import type { Point, Polygon } from "geojson";

const wastes = defineCollection({
  loader: directusLoader({
    command: (lastModified) =>
      readItems("waste", {
        fields: ["*"],
        filter: {
          _or: [
            { date_created: { _gte: lastModified } },
            { date_updated: { _gte: lastModified } },
          ],
        },
        sort: ["name", "location"],
      }),
    map: (waste, idx) => {
      let point = findPoint(waste.point);
      let blob = findPolygon(waste.point);
      if (!point) {
        point = randomPoint(1, {
          bbox: [-56.678467, 20.231275, -25.389404, 40.522151],
        }).features[0].geometry;
      }
      if (!blob) {
        blob = circle(point, 30).geometry;
      }

      let image = idToString(waste.image);
      let projects = idsToString(waste.projects);

      return { ...waste, image, projects, point, blob, order: idx };
    },
  }),
  schema: z.object({
    id: z.number().int(),
    name: z.string(),
    location: z.string(),
    category: z.string().nullable().default("unknown"),
    slug: z.string().nullable(),
    characteristics: z.string().default(""),
    image: reference("images").nullable(),
    projects: z.array(reference("projects")).default([]),
    point: z
      .any()
      .optional()
      .transform((val) => val as Point),
    blob: z
      .any()
      .optional()
      .transform((val) => val as Polygon),
    order: z.number().int(),
  }),
});

const projects = defineCollection({
  loader: directusLoader({
    command: (lastModified) =>
      readItems("project", {
        fields: ["*"],
        filter: {
          _or: [
            { date_created: { _gte: lastModified } },
            { date_updated: { _gte: lastModified } },
          ],
        },
      }),
    map: (project) => {
      return {
        ...project,
        images: idsToString(project.images),
        wastes: idsToString(project.wastes),
      };
    },
  }),
  schema: z.object({
    id: z.number().int(),
    status: z.string(),
    name: z.string(),
    description: z.string().optional(),
    images: z.array(reference("images")).default([]),
    wastes: z.array(reference("wastes")).default([]),
  }),
});

const images = defineCollection({
  loader: directusLoader({
    command: (lastModified) =>
      readFiles({
        fields: ["*"],
        // TODO: filter for only images?
        filter: {
          _or: [
            { created_on: { _gte: lastModified } },
            { modified_on: { _gte: lastModified } },
          ],
        },
      }),
    map: (file) => file,
  }),
  schema: z.object({
    id: z.string(),
    filename_disk: z.string().nullish(),
    filename_download: z.string(),
    title: z.string().nullish(),
    type: z.string().nullish(),
    width: z.number().nullish(),
    height: z.number().nullish(),
    filesize: z.number().nullish(),
    description: z.string().nullish(),
    location: z.string().nullish(),
    tags: z.array(z.string()).nullish(),
    metadata: z.record(z.any()).nullish(),
  }),
});

export const collections = { projects, wastes, images };

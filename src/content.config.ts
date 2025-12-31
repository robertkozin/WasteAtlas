import { readFiles, readItems } from "@directus/sdk";
import { defineCollection, reference, z } from "astro:content";
import { directusLoader, getAssetUrl } from "./lib/directus";

import { circle, randomPoint } from "@turf/turf";
import type { Point, Polygon } from "geojson";
import { findPoint, findPolygon } from "./lib/geojson";

const wastes = defineCollection({
  loader: directusLoader({
    command: (lastModified) =>
      readItems("waste", {
        fields: ["*", "projects.project_id"],
        filter: {
          slug: { _nnull: true },
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

      return {
        ...waste,
        image_ref: waste.image,
        image_url: getAssetUrl(waste.image),
        project_refs: waste.projects.map((proj) => String(proj.project_id)),
        point,
        blob,
        order: idx,
      };
    },
  }),
  schema: z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string().default(""),
    location: z.string(),
    status: z
      .enum(["published", "ready", "draft", "archived", "unknown"])
      .catch("unknown"),
    category: z
      .enum([
        "domestic",
        "industrial",
        "agricultural",
        "construction",
        "unknown",
      ])
      .catch("unknown"),
    slug: z.string(),
    characteristics: z.string().default(""),
    image_ref: reference("images").nullable(),
    image_url: z.string().nullable(),
    project_refs: z.array(reference("projects")).default([]),
    point: z.any().transform((val) => val as Point),
    blob: z.any().transform((val) => val as Polygon),
    order: z.number().int(),
  }),
});

const projects = defineCollection({
  loader: directusLoader({
    command: (lastModified) =>
      readItems("project", {
        fields: ["*", "images.directus_files_id", "waste.waste_id"],
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
        image_refs: project.images.map((img) => img.directus_files_id),
        image_urls: project.images.map((img) =>
          getAssetUrl(img.directus_files_id),
        ),
        waste_refs: project.waste.map((w) => String(w.waste_id)),
      };
    },
  }),
  schema: z.object({
    id: z.number().int(),
    status: z.string(),
    name: z.string(),
    description: z.string().optional(),
    image_refs: z.array(reference("images")).default([]),
    image_urls: z.array(z.string()).default([]),
    waste_refs: z.array(reference("wastes")).default([]),
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
    map: (img) => ({
      ...img,
      url: getAssetUrl(img.id),
    }),
  }),
  schema: z.object({
    id: z.string(),
    url: z.string(),
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

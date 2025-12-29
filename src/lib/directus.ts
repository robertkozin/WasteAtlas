import {
  createDirectus,
  rest,
  staticToken,
  type DirectusClient,
  type IfAny,
  type RestCommand,
  readFiles,
} from "@directus/sdk";
import type { Loader, LoaderContext } from "astro/loaders";

let directus = createDirectus(import.meta.env.DIRECTUS_URL).with(rest());

if (import.meta.env.DIRECTUS_TOKEN) {
  directus = directus.with(staticToken(import.meta.env.DIRECTUS_TOKEN));
} else {
  console.warn("no DIRECTUS_TOKEN defined, using public access policy");
}

export default directus;

type Obj = Record<string, any>;

export function directusLoader<U extends Obj>(options: {
  command: (lastModified: string) => RestCommand<Obj[], any>;
  map: (value: Obj, index: number, array: Obj[]) => U;
}): Loader {
  return {
    name: "directus-loader",
    load: async ({
      collection,
      store,
      logger,
      parseData,
      meta,
      generateDigest,
    }): Promise<void> => {
      let lastModified = meta.get("lastModified") ?? new Date(0).toISOString();
      logger.info(`${collection} lastModified: ${lastModified}`);

      const items = await directus
        .request(options.command(lastModified))
        .then((items) => items.map(options.map));
      for (const item of items) {
        if (!("id" in item)) {
          throw new Error(
            `directus-loader item for collection '${collection}' is missing an id field: ${JSON.stringify(item)}`,
          );
        }
        const id = String(item.id);
        const data = await parseData({ id, data: item });
        const digest = generateDigest(data);
        store.set({ id, data, digest });
      }

      meta.set("lastModified", new Date().toISOString());
    },
  };
}

export function idToString(id: number | null | undefined): string | null {
  if (id == null || id == undefined) {
    return null;
  }
  return String(id);
}

export function idsToString(ids: number[] | null | undefined): string[] {
  if (ids == null || ids == undefined) {
    return [];
  }

  return ids.map((id) => String(id));
}

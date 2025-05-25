import { defineCollection, z } from 'astro:content';
import directus from "../lib/directus";
import { readItems } from "@directus/sdk";
import { optional } from 'astro:schema';
import type { Loader, LoaderContext } from 'astro/loaders';



// function wasteLoader(): Loader {
//     return {

//     }
// }

// const waste = defineCollection({
//     loader: async ({store, logger, meta}) => {
//         return directus.request(
//             readItems("waste", {
//                 fields: [
//                   "id",
//                   "name",
//                   "location",
//                   "point",
//                   "outline",
//                   "category",
//                   "slug",
//                   "characteristics",
//                   "image",
//                 ],
//                 filter: {},
//                 sort: ["name", "location"],
//               })
//         )
//     },
//     schema: z.object({
//         id: z.number(),
//         name: z.string(),
//         location: z.string(),
//         point: z.string()
//     })
// })
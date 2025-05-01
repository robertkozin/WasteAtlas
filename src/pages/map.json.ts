import type { APIContext } from "astro";
import directus from "../lib/directus";
import { readItems } from "@directus/sdk";

export async function GET({params, request}: APIContext) {
    const waste = await directus.request(
        readItems("waste", {
            fields: ["id", "name", "location", "point", "category", "slug"],
            filter: {}
        })
    )

    // TODO: thumbnail url, category, slug
    // DEfault coords instead

    const geojson = {
        type: "FeatureCollection",
        features: waste.filter(waste => waste.point && waste.point.coordinates).map(waste => ({
            type: "Feature",
            id: waste.id,
            geometry: {
                type: "Point",
                coordinates: waste.point?.coordinates ?? [-120, 50]
            },
            properties: {
                name: waste.name,
                location: waste.location,
                category: waste.category,
                slug: waste.slug,
            }
        }))
    }

    return new Response(JSON.stringify(geojson))
}

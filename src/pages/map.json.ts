import type { APIContext } from "astro";
import directus from "../lib/directus";
import { readItems } from "@directus/sdk";

export async function GET({params, request}: APIContext) {
    const waste = await directus.request(
        readItems("waste", {
            fields: ["id", "name", "location", "point"]
        })
    )

    const geojson = {
        type: "FeatureCollection",
        features: waste.filter(waste => waste.point && waste.point.coordinates).map(waste => ({
            type: "Feature",
            id: waste.id,
            geometry: {
                type: "Point",
                coordinates: waste.point.coordinates 
            },
            properties: {
                name: waste.name,
                location: waste.location,
            }
        }))
    }

    return new Response(JSON.stringify(geojson))
}

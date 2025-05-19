import type { APIContext } from "astro";
import directus from "../lib/directus";
import { readItems } from "@directus/sdk";

export async function GET({params, request}: APIContext) {
    const waste = await directus.request(
        readItems("waste", {
            fields: ["id", "name", "location", "point", "category", "slug", "image"],
            filter: {}
        })
    )

    // Generate stable random coordinates based on ID
    function generateStableCoordinates(id: string | number) {
        // Create a seeded random number generator based on id
        const seed = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Pseudo-random number generator with seed
        const pseudoRandom = () => {
            // Simple LCG algorithm with parameters for good distribution
            const a = 1664525;
            const c = 1013904223;
            const m = Math.pow(2, 32);
            let z = (a * seed + c) % m;
            return z / m; // Normalized to [0, 1]
        };
        
        // Generate coordinates in the mid-Atlantic Ocean
        // Longitude range: -50 to -20 (mid-Atlantic)
        // Latitude range: -10 to 30 (tropical to subtropical Atlantic)
        const lng = -50 + pseudoRandom() * 30; // -50 to -20
        const lat = -10 + pseudoRandom() * 40; // -10 to 30
        
        return [lng, lat];
    }

    const geojson = {
        type: "FeatureCollection",
        features: waste.map(waste => {
            // Determine coordinates: use actual coordinates if they exist, otherwise generate stable random ones
            const coordinates = (waste.point && waste.point.coordinates) 
                ? waste.point.coordinates 
                : generateStableCoordinates(waste.id);
                
            // Handle image URL construction, checking for both null image and actual image object structure
            let imageUrl = null;
            if (waste.image && typeof waste.image === 'object') {
                imageUrl = `${import.meta.env.DIRECTUS_URL}/assets/${waste.image.id}?width=200&height=200&fit=cover`;
            }
                
            return {
                type: "Feature",
                id: waste.id,
                geometry: {
                    type: "Point",
                    coordinates: coordinates
                },
                properties: {
                    name: waste.name,
                    location: waste.location,
                    category: waste.category,
                    slug: waste.slug,
                    imageUrl: imageUrl
                }
            };
        })
    };

    return new Response(JSON.stringify(geojson))
}

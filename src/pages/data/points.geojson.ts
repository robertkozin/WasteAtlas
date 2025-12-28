import { getCollection } from "astro:content";

export async function GET() {
  const waste = await getCollection("wastes").then((wastes) =>
    wastes.map((waste) => {
      const point = waste.data.point;
      return {
        type: "Feature",
        id: waste.id || "",
        geometry: {
          type: "Point",
          coordinates: point.coordinates.map((n) => n.toFixed(3)),
        },
        properties: {
          category: waste.data.category,
        },
      };
    }),
  );

  const geoJson = {
    type: "FeatureCollection",
    features: waste,
  };

  return new Response(JSON.stringify(geoJson));
}

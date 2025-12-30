import { featureCollection, point, truncate } from "@turf/turf";
import { getCollection, type CollectionEntry } from "astro:content";
import type { Feature, Point } from "geojson";

function toPoint(waste: CollectionEntry<"wastes">): Feature<Point> {
  return point(
    waste.data.point.coordinates,
    { category: waste.data.category },
    { id: waste.data.id },
  );
}

export async function GET() {
  return getCollection("wastes")
    .then((wastes) => wastes.map(toPoint))
    .then((points) => truncate(featureCollection(points), { precision: 3 }))
    .then((geoJson) => new Response(JSON.stringify(geoJson)));
}

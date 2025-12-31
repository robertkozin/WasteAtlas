import { getCollection, type CollectionEntry } from "astro:content"

import {
  bbox,
  pointGrid,
  polygonSmooth,
  explode,
  polygonToLine,
  lineChunk,
  multiPoint,
  featureCollection,
  coordAll,
  truncate,
} from "@turf/turf"
import type { Feature, MultiPoint } from "geojson"

function toBlob(waste: CollectionEntry<"wastes">): Feature<MultiPoint> {
  let outline = waste.data.blob
  let smooth = polygonSmooth(outline, { iterations: 3 })
  let smoothBbox = bbox(smooth)

  let smoothGrid = pointGrid(smoothBbox, 10, {
    mask: smooth.features[0],
  })
  let smoothOutlinePoints = explode(lineChunk(polygonToLine(smooth.features[0]), 10))

  smoothGrid.features.push(...smoothOutlinePoints.features)

  return multiPoint(coordAll(smoothGrid), { cat: waste.data.category, w: waste.data.id }, { id: waste.data.id })
}

export async function GET() {
  return getCollection("wastes")
    .then(wastes => wastes.map(toBlob))
    .then(blobs => truncate(featureCollection(blobs), { precision: 3 }))
    .then(geoJson => new Response(JSON.stringify(geoJson)))
}

import type { Geometry, Point, Polygon, GeometryCollection } from "geojson";

export function isPoint(geometry: Geometry): geometry is Point {
  return geometry.type === "Point";
}

export function isGeometryCollection(
  geometry: Geometry,
): geometry is GeometryCollection {
  return geometry.type === "GeometryCollection";
}

export function isPolygon(geometry: Geometry): geometry is Polygon {
  return geometry.type === "Polygon";
}

export function findPoint(geo: Geometry): Point | undefined {
  if (isPoint(geo)) {
    return geo;
  } else if (isGeometryCollection(geo)) {
    let point = geo.geometries.find(isPoint);
    if (point) return point;
  }
}

export function findPolygon(geo: Geometry): Polygon | undefined {
  if (isPolygon(geo)) {
    return geo;
  } else if (isGeometryCollection(geo)) {
    let poly = geo.geometries.find(isPolygon);
    if (poly) return poly;
  }
}

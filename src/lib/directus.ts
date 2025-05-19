import { createDirectus, rest, staticToken, withToken } from '@directus/sdk';
import type { DirectusFile } from '@directus/sdk'
import type { GeoJsonObject } from 'geojson';

type Waste = {
  id: number;
  status: string;
  name: string;
  location: string;
  slug?: string;
  category?: string;
  characteristics?: string;
  image?: DirectusFile;
  description?: string;
  point?: GeoJSON.Point;
  outline?: GeoJSON.Polygon;
  submitted_on?: string;
  projects?: Project[];
  submitters?: Submitter[];
}

type Project = {

}

type Submitter = {

}

type Schema = {
  waste: Waste[];
  projects: Project[];
  Submitters: Submitter[];
}

let directus = createDirectus<Schema>(import.meta.env.DIRECTUS_URL).with(rest())

if (import.meta.env.DIRECTUS_TOKEN) {
  directus = directus.with(staticToken(import.meta.env.DIRECTUS_TOKEN))
} else {
  console.warn("no DIRECTUS_TOKEN defined, using public access policy")
}

export default directus;

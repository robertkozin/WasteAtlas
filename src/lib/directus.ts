import { createDirectus, rest, staticToken, withToken, } from '@directus/sdk';

type Waste = {
  id: number;
  status: string;
  name: string;
  location: string;
  slug?: string;
  category?: string;
  characteristics?: string;
  description?: string;
  point?: Point;
  submitted_on?: string;
  projects?: Project[];
  submitters?: Submitter[];
}

type Project = {

}

type Submitter = {

}

type Point = {
  type: string;
  coordinates: number[];
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

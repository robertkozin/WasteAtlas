import { createDirectus, rest, staticToken } from '@directus/sdk';

let directus = createDirectus(import.meta.env.DIRECTUS_URL).with(rest())

if (import.meta.env.DIRECTUS_TOKEN) {
  directus = directus.with(staticToken(import.meta.env.DIRECTUS_TOKEN))
} else {
  console.warn("no DIRECTUS_TOKEN defined, using public access policy")
}

export default directus;

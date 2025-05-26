import { getCollection } from 'astro:content';


export async function GET() {
    const waste = await getCollection("waste").then(waste => waste.map(w => w.data));

    return new Response(
      JSON.stringify(waste.map(w => w.blob)),
    );
  }
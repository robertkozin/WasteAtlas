import { getCollection } from 'astro:content';


export async function GET() {
    const collection = await getCollection("waste");

    return new Response(
      JSON.stringify(collection),
    );
  }
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: 'kwax2pg0',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-03-29', // use today's date
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

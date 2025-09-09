'use server'

import { client } from '@/sanity/sanityClient';

export const getAllBanners = async () => {
  const query = `*[_type == 'banners'] | order(_createdAt desc)`;

  const data = await client.fetch(query);
  return data;
}
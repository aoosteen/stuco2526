"use server";

import { client } from "@/sanity/sanityClient";

export interface GalleryType {
  _id: string;
  term: string;
  description: string;
  title: string;
  date: string;
  highlights: any[];
  studentsCollection: any[];
  miscellaneous: any[];
  BTS: any[];
  specialImage: string;
}

export const countGalleryTotal = async () => {
  const query = `count(*[_type == 'gallery'])`;
  const data = await client.fetch(
    query,
    {},
    {
      next: {
        tags: ["gallery"],
      },
    }
  );
  return data as number;
};
export const getAllGalleryTerms = async () => {
  const query = `*[_type == 'gallery']{
        term
    } | order(_createdAt desc)`;
  const data = await client.fetch(
    query,
    {},
    {
      next: {
        tags: ["gallery"],
      },
    }
  );
  const terms = Array.from(
    new Set(data.map((item: { term: string }) => item.term))
  ) as string[];
  return terms.sort((a, b) => {
    const numA = parseInt(a.replace("term", ""));
    const numB = parseInt(b.replace("term", ""));
    return numA - numB;
  }) as string[];
};

export const getAllGaleries = async () => {
  const query = `*[_type == 'gallery']| order(date asc)`;
  const data = await client.fetch(
    query,
    {},
    {
      next: {
        tags: ["gallery"],
      },
    }
  );
  return data as GalleryType[];
};
export const getGalleriesforTerm = async (term: string) => {
  const query = `*[_type == 'gallery' && term == '${term}']{
    _id,
    term,
    description,
    title,
    date,
    highlights,
    specialImage
  } | order(date asc)`;
  const data = await client.fetch(
    query,
    {},
    {
      next: {
        tags: ["gallery"],
      },
    }
  );
  return data as GalleryType[];
};

export const getGalllery = async (id: string) => {
  const query = `*[_type == 'gallery' && _id == '${id}']{
    _id,
    term,
    description,
    title,
    date,
    highlights,
    studentsCollection,
    miscellaneous,
    BTS,
    specialImage
  }`;
  const data = await client.fetch(
    query,
    {},
    {
      next: {
        tags: ["gallery"],
      },
    }
  );
  return data[0] as GalleryType;
};

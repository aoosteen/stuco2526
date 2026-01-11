"use server";

import { client } from "@/sanity/sanityClient";
import { BlogType } from "./types";
import { sanitizeForGroq } from "./helpers";

export const getAllBlogs = async () => {
  const query = `*[_type == 'Blogs']{
  title,
    author,
    tags,
    coverImage,
    blog,
    _createdAt,
    _id,
    description
} | order(_createdAt desc)`;

  const data = await client.fetch(query);
  return data as BlogType[];
};


export const getOtherblogs = async (currentId: string) => {


  const getCursorBlog = async () => {
    // const index = (10-page) * 5 - 1;
    const query = `*[_type == 'Blogs' && _id == '${currentId}']{
  _updatedAt
  }`;
    const data = await client.fetch(query);
    return data[0] as { _updatedAt: string };
  };

  const cursorBlog = await getCursorBlog();
  const query = `*[_type == 'Blogs' && _updatedAt > '${cursorBlog._updatedAt}']{
  title,
    author,
    tags,
    coverImage,
    blog,
    _createdAt,
    _id,
    description
} | order(_createdAt desc)[0..2]`;

const query2 = `*[_type == 'Blogs' && _updatedAt < '${cursorBlog._updatedAt}']{
  title,
    author,
    tags,
    coverImage,
    blog,
    _createdAt,
    _id,
    description
} | order(_createdAt desc)[0..2]`;

  const data =  client.fetch(query);
  const data2 =  client.fetch(query2);

  const datas = await Promise.all([data,data2])
  return [...datas[1],...datas[0]] as BlogType[];
}

export const getAllPaginatedBlogs = async (
  tags: string[] | undefined,
  order: string,
  search: string,
  cursor: string, 

) => {
  

  const safeLiteral = sanitizeForGroq(search);

  const getCursorBlog = async () => {
    // const index = (10-page) * 5 - 1;
    const query = `*[_type == 'Blogs' && _id == '${cursor}']{
  _updatedAt
  }`;
    const data = await client.fetch(query);
    return data[0] as { _updatedAt: string };
  };

  const cursorBlog = await getCursorBlog();

  const cursorQuery = cursor !== ''
  ? `&& _updatedAt ${order === 'desc' ? '<' : '>'} '${cursorBlog._updatedAt}'`
    : "";

  const tagsQuery = tags
    ? tags.map((tag) => `"${tag}" in tags`).join(" && ") ?? ""
    : "";
  const orderQuery =
    order === "desc" ? "order(_updatedAt desc)" : "order(_updatedAt asc)";
  const searchQuery = search
    ? `title match ${safeLiteral} || author match ${safeLiteral}`
    : "";


    
  const query = `*[_type == 'Blogs' ${cursorQuery} ] {
  title,
    author,
    tags,
    coverImage,
    blog,
    _createdAt,
    _updatedAt,
    _id,
    description
}[${tagsQuery}][${searchQuery}]  | ${orderQuery}   [0...5]
`;

  // console.log(query);
  const data = await client.fetch(query);
  return data as BlogType[];
};

export const getAllLatestBlogs = async () => {
  const query = `*[_type == 'Blogs']{
  title,
    author,
    tags,
    coverImage,
    blog,
    _createdAt,
    _id,
    description
} | order(_createdAt desc)[0..2]`;

  const data = await client.fetch(query,{},{
    next:{
      revalidate: 3600
    }
  });
  return data as BlogType[];
};

export const getCurrentBlog = async (id: string) => {
  const query = `*[_type == 'Blogs' && _id == '${id}']{
  title,
    author,
    tags,
    coverImage,
    blog,
    _createdAt,
    _updatedAt,
    _id,
    description
}`;

  const data = await client.fetch(query);
  return data[0] as BlogType;
};

export const countAllBlogs = async () => {
  const query = `count(*[_type == 'Blogs'])`;
  const data = await client.fetch(query);
  return data as number;
};

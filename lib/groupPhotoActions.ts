"use server";

import { client } from "@/sanity/sanityClient";
import crypto from "crypto";
export type groupPhotoType = {
  image: any;
  className?: string;
};
export const getLRPhotos = async () => {
  const query = `*[_type == 'group' && position == 'LR']{
        image
      }| order(_createdAt desc)`;
  const data = (await client.fetch(query)) as { image: any }[];

  const classnames = [
    {
      className: "-rotate-10",
    },
    {
      className: "rotate-6",
    },
    {
      className: "rotate-8",
    },
    {
      className: "-rotate-3",
    },
    {
      className: "",
    },
  ];

  // const rotations = ['-rotate-10', 'rotate-6', 'rotate-8', '-rotate-3', ''];

  const res = data.map((item, index) => {
    return {
      ...item,
      className:
        classnames[index % (classnames.length + crypto.randomInt(-2, 2))]
          ?.className,
    };
  });
  return res as groupPhotoType[];
};

export const getMajPosPhotos = async () => {
  const query = `*[_type == 'group' && position == 'MP']{
        image
      } | order(_createdAt desc)`;
  const data = (await client.fetch(query)) as groupPhotoType[];

  const leftMPClassnames = [
    {
      className: "-rotate-10 ",
    },
    {
      className: "rotate-6 ",
    },
    {
      className: "rotate-8 ",
    },
    {
      className: "-rotate-5",
    },
  ];

  const left = data.map((item, index) => {
    return {
      ...item,
      className:
        leftMPClassnames[
          (index % leftMPClassnames.length) + crypto.randomInt(-1, 1)
        ]?.className,
    };
  });

  return left as groupPhotoType[];
};

export const getGroupPhotos = async () => {
  const query = `*[_type == 'group' && position == 'all']{
        image
        } | order(_createdAt desc)`;

  const data = (await client.fetch(query)) as groupPhotoType[];
  const className = [
    {
      className: "-rotate-10 ",
    },
    {
      className: "rotate-6 ",
    },
    {
      className: "rotate-8 ",
    },
    {
      className: "-rotate-3",
    },
  ];
  const res = data.map((item, index) => {
    return {
      ...item,
      className:
        className[index]
          ?.className,
    };
  });
  
  return res as groupPhotoType[];
};

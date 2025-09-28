"use server";

import { client } from "@/sanity/sanityClient";
export type MemberType = {
    _id: string;
    name: string;
    position: string;
    description: string;
    events: string[];
    image: any;
}
export const getMembers = async () => {
  const query = `*[_type == 'members']{
  _id,
    name,
    position,
    description,
    events,
    image
}`;
  const data = await client.fetch(query);
  return data as MemberType[];
};

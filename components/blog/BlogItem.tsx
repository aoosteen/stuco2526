"use client";
import Image from "next/image";
import React from "react";
import { Badge } from "../ui/badge";
import { BlogType } from "@/lib/types";
import { urlFor } from "@/sanity/sanityClient";
import { useDeviceWidth } from "@/hooks/useDeviceWidth";
import { useRouter } from "next/navigation";
import { useCurrentSelectedBlog } from "@/hooks/useCurrentSelectedBlog";
import { motion } from "framer-motion";
const BlogItem = ({ blog, index ,pattern }: { blog: BlogType; index: number, pattern:number }) => {
  const deviceWidth = useDeviceWidth();
  const router = useRouter();
  const { setCurrentSelectedBlog } = useCurrentSelectedBlog();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: (index % pattern) * 0.1,
        ease: "easeInOut",
        duration: 0.3,
      }}
      onClick={() => {
        deviceWidth < 1280
          ? router.push(`/blog/${blog._id}`)
          : setCurrentSelectedBlog(blog);
      }}
      className="p-4  pb-8 pl-0 flex flex-col sm:flex-row gap-4 border-b-sky-900 border-b-1 cursor-pointer lg:cursor-default"
    >
      <Image
        src={urlFor(blog.coverImage).url()}
        alt="Blog cover image"
        width={100}
        height={100}
        priority
        className=" aspect-square h-30  object-cover"
      />
      <div className="flex flex-col gap-2 py-2">
        <div className="flex gap-2 flex-wrap">
          {blog.tags.map((tag) => (
            <Badge key={tag} variant={"blue"}>
              <p className="!text-sm capitalize">{tag}</p>
            </Badge>
          ))}
        </div>
        <h1 className="text-sky-800 text-2xl font-bold">{blog.title}</h1>
        <p className="text-sky-800 capitalize">By {blog.author}</p>
      </div>
    </motion.div>
  );
};

export default BlogItem;

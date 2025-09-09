"use client";

import { BlogType } from "@/lib/types";
import React, { useEffect, useState, useTransition } from "react";
import BlogItem from "./BlogItem";
import { useInView } from "react-intersection-observer";
import {  getAllPaginatedBlogs } from "@/lib/BlogActions";
import {  useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const BlogItemsClient = ({ data }: { data: BlogType[] }) => {
  const [blogs, setBlogs] = useState<BlogType[]>(data);
  const [full, setFull] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const sp = new URLSearchParams(searchParams);
  // console.log(sp.getAll("tag"));
  useEffect(() => {
    setBlogs(data);
  }, [data]);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      startTransition(async () => {
        // fetch more data here and append to blogs
        if (full) return;

        const moreBlogs = await getAllPaginatedBlogs(
          [sp.getAll("tag")].flat().filter(Boolean) as string[],
          sp.get("order") ?? "desc",
          sp.get("search") ?? "",
          blogs[blogs.length - 1]?._id,
        );

        setBlogs((prevBlogs) => [...prevBlogs, ...moreBlogs]);
        if (blogs.length >= data.length + moreBlogs.length - 1) {
          setFull(true);
          return;
        }

        // if (full) {
        //   setBlogs((prevBlogs) => [...prevBlogs, ...data]);
        // }
      });
    }
  }, [inView]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ease: "easeInOut",
        duration: 0.3,
      }}
      className="py-4 flex flex-col gap-4 min-h-[60vh]"
      ref={containerRef}
    >
      {blogs.map((blog: BlogType, index) => {
        return (
          <BlogItem
            blog={blog}
            key={index}
            index={index}
            pattern={data.length}
          />
        );
      })}
      {blogs.length === 0 && (
        <div className="flex h-[50vh] w-full justify-center items-center">
          <p>No Blogs Found :{"("}</p>
        </div>
      )}
      {blogs.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            ease: "easeInOut",
            duration: 0.3,
          }}
          ref={ref}
          className="text-center mt-4 "
        >
          {full
            ? "No more blogs :("
            : isPending
            ? "Loading more..."
            : "Scroll down to load more"}
        </motion.p>
      )}
    </motion.div>
  );
};

export default BlogItemsClient;

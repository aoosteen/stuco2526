"use client";
import React from "react";
import BlogFrame from "../main/blog/BlogFrame";
import { useCurrentSelectedBlog } from "@/hooks/useCurrentSelectedBlog";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
const BlogPreview = () => {
  const { currentSelectedBlog } = useCurrentSelectedBlog();
  return (
    <div
      className=" bg-[url(/blogs/WhiteFrame.png)] bg-contain bg-no-repeat  shrink-0 justify-center items-center hidden lg:flex  lg:flex-col "
      style={{
        aspectRatio: "436/676",
      }}
    >
      <Link href={`/blog/${currentSelectedBlog?._id ?? ""}`}>
        <BlogFrame
          className="shrink-0 translate-y-1/15 "
          src="/blogs/BlogPaper.png"
          ratio="436/676"
          showTags
          bgClassName="scale-x-85 scale-y-105 shrink-0 object-cover"
          headerSrc={true}
          showDate
          data={currentSelectedBlog ?? undefined}
          contentClassName=" pt-12 pb-0 shrink-0 w-fit  w-[80%] translate-x-1/8"
          disableScramble
        />
      </Link>
      <AnimatePresence mode="wait">
        {currentSelectedBlog && (
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="text-white"
          >
            Click the preview to see the full blog
          </motion.p>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default BlogPreview;

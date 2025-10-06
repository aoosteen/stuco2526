"use client";
import React from "react";
import BlogFrame from "../main/blog/BlogFrame";
import { useCurrentSelectedBlog } from "@/hooks/useCurrentSelectedBlog";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
const BlogPreview = () => {
  const { currentSelectedBlog } = useCurrentSelectedBlog();
  return (
    <>
    
    <div
      className=" bg-[url(/blogs/WhiteFrame.png)] relative   shrink-0 justify-center items-center hidden lg:flex    scale-80  lg:flex-col  bg-cover bg-repeat-round px-4 "
      style={{
        // aspectRatio: "436/676",
      }}
    >
      <Link href={`/blog/${currentSelectedBlog?._id ?? ""}`} className="h-full">
        <BlogFrame
          className="shrink-0  h-fit scale-90   "
          src="/blogs/BlogPaper.png"
          ratio="436/676"
          showTags
          // bgClassName=" shrink-0 object-cover h-full "
          headerSrc={true}
          showDate
          data={currentSelectedBlog ?? undefined}
          contentClassName=" pt-12  shrink-0 w-fit  w-[80%] translate-x-1/8"
          disableScramble
        />
      </Link>
   
      
    </div>
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
            className="text-white text-center -translate-y-12 text-sm! "
          >
            Click the preview to see the full blog
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlogPreview;

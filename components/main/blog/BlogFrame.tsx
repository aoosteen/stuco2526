"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { scrambleWord } from "@/lib/helpers";
import { BlogType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/sanityClient";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface BlogFrameProps {
  className?: string;
  bgClassName?: string;
  contentClassName?: string;
  data?: BlogType;
  src: string;
  ratio: string;
  button?: boolean;
  headerSrc?: boolean;
  showTags?: boolean;
  showDate?: boolean;
  disableScramble?: boolean;
}

const BlogFrame = ({
  className,
  data,
  src,
  button,
  ratio,
  bgClassName,
  contentClassName,
  headerSrc,
  showTags,
  showDate,
  disableScramble,
}: BlogFrameProps) => {
  const [over, setOver] = useState(false);
  const [rotateState, setRotateState] = useState("rotate-0");

  useEffect(() => {
    if (over) {
      const interval = setInterval(() => {
        if (rotateState === "rotate-0") {
          setRotateState("rotate-180");
        } else {
          setRotateState("rotate-0");
        }
      }, 300);
      return () => clearInterval(interval);
    }
  });

  const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return (
    <div
      className={cn(
        "relative hidden h-full  shadow-sm sm:block bg-contain  blogFrame  ",
        className
      )}
      style={{
        // backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        aspectRatio: ratio,
        backgroundSize: "cover",
      }}
    >
      <Image
        src={src}
        alt="blog paper"
        height={500}
        width={500}
        priority
        className={cn("object-cover w-full ", rotateState, bgClassName)}
      />

      <div
        className={cn(
          "p-8  absolute top-0 left-0  overflow-hidden",
          headerSrc ? "bottom-12" : "",
          contentClassName
        )}
        onMouseOver={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
      >
        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              key={data._id}
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {headerSrc && (
                <Image
                  src={urlFor(data.coverImage).url()}
                  alt="Blog cover image"
                  width={200}
                  height={200}
                  priority
                  className="w-full object-cover h-34"
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(700, 475)
                  )}`}
                />
              )}
              {showTags && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {data.tags.slice(0, 5).map((tag) => (
                    <Badge key={tag} variant={"blue"}>
                      <p className="!text-sm capitalize">{tag}</p>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-1.5 ">
                <h1 className="text-sky-800 text-2xl font-normal line-clamp-2">
                  {data.title}
                </h1>
                <p className="capitalize text-sky-800 text-sm line-clamp-2">
                  By {data.author}
                </p>
                {showDate && (
                  <p className="text-sky-800">
                    {format(new Date(data._createdAt), "dd MMMM yyyy")}
                  </p>
                )}
              </div>
              <Image
                src={"/blogs/BlogFrameSeperator.svg"}
                alt="seperator"
                width={100}
                height={100}
                priority
                className="object-contain w-full  pr-6 "
              />
              <p
                className={cn(
                  "text-sky-800 line-clamp-10 md:line-clamp-7",
                  headerSrc ? "lg:line-clamp-5" : "lg:line-clamp-7"
                )}
              >
                {disableScramble
                  ? data.description
                  : scrambleWord(data.description)}
              </p>
              <div className="flex justify-center md:mt-8 lg:mt-3 xl:mt-12">
                {button && (
                  <Link href={`/blog/${data._id}`}>
                    <Button variant={"blueOutline"} className="">
                      Read article
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!data && <p className="text-center">Select a blog to preview...</p>}
      </div>
    </div>
  );
};

export default BlogFrame;

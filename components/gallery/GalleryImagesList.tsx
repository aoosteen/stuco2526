"use client";
import { GalleryType } from "@/lib/GalleryActions";
import { urlFor } from "@/sanity/sanityClient";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Polaroid from "./Polaroid";
import { AnimatePresence, motion } from "framer-motion";

type GalleryTab = "highlights" | "BTS" | "studentsCollection" | "miscellaneous";

const GalleryImagesList = ({ data }: { data: GalleryType }) => {
  const [current, setCurrent] = useState<GalleryTab>("highlights");
  const searchParams = useSearchParams();
  const sp = new URLSearchParams(searchParams);
  useEffect(() => {
    const currentTab = sp.get("tab");
    if (currentTab === "Highlights") {
      setCurrent("highlights");
    }

    if (currentTab === "Behind The Scenes") {
      setCurrent("BTS");
    }

    if (currentTab === "Student's Collection") {
      setCurrent("studentsCollection");
    }

    if (currentTab === "Miscellaneous") {
      setCurrent("miscellaneous");
    }
  }, [sp.get("tab")]);

  return (
    <div className="z-10  ">
      <AnimatePresence mode="wait">
        <div className="grid grid-cols-2 gap-4 sm:gap-8" key={current}>
          {data[current]?.map((img, i) => (
            <Polaroid src={urlFor(img).url()} key={i} i={i} />
          ))}
        </div>
      
      {/* <AnimatePresence mode="wait"> */}
      {data[current]?.length === 0 ||
        (data[current]?.length === undefined && (
          <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2  " 
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          
          >
            <p className="text-yellow-800 text-center">No Images yet :{"("}</p>
          </motion.div>
        ))}
      {/* </AnimatePresence> */}
      </AnimatePresence>
    </div>
  );
};

export default GalleryImagesList;

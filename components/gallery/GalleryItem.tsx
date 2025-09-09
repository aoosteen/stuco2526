import { cn } from "@/lib/utils";
import React from "react";

import Image from "next/image";
import { GalleryType } from "@/lib/GalleryActions";
import format from "date-fns/format";
import { urlFor } from "@/sanity/sanityClient";
import Link from "next/link";

export const GalleryItem = ({
  index,
  gal,
}: {
  index: number;
  gal: GalleryType;
}) => {
  return (
    <div className="   h-full  flex gap-40 py-4  z-100 ">
      <div className="w-80 h-full z-2   flex justify-start items-center ">
        <div
          className={cn(
            "flex  justify-center gap-4",
            index % 2 === 0 ? "flex-col" : "flex-col-reverse"
          )}
        >
          <div className="h-20 relative w-40 ">
            <div
              className={cn(
                "absolute  left-0 w-full h-20",
                index % 2 === 0 ? "bottom-12  " : "top-12"
              )}
            >
              <Link href={`/gallery/${gal._id}`} scroll={false}>
                <div className="relative  ">
                  <Image
                    src={urlFor(gal.highlights[0]).url()}
                    alt={"Blog img"}
                    width={150}
                    height={150}
                    className=" absolute rotate-10   object-cover z-1 "
                  />
                  <Image
                    src={urlFor(gal.highlights[1]).url()}
                    alt={"Blog img"}
                    width={150}
                    height={150}
                    className=" absolute -rotate-10 object-cover"
                  />
                </div>
              </Link>
            </div>
          </div>
          {/* <Image src={urlFor(gal.specialImage).url()} alt={""} width={40} height={40} className="w-10 h-10 
           object-contain" /> */}
          <div className="bg-[#FFC21A] rounded-full size-10 flex justify-center items-center ">
            {gal.specialImage}
          </div>
          <div className="min-h-20 min-w-100 relative text-yellow-600 ">
            <div
              className={cn(
                "absolute  flex",
                index % 2 === 0
                  ? "flex-col top-0 left-0"
                  : "flex-col-reverse bottom-0 left-0"
              )}
            >
              <p>{format(new Date(gal.date), "dd MMMM yyyy")}</p>
              <Link href={`/gallery/${gal._id}`} scroll={false} className="w-fit">
                <h1 className="text-3xl hover:underline cursor-pointer ">
                  {gal.title}
                </h1>
              </Link>
              <p className="text-yellow-900 mt-4 line-clamp-5">
                {gal.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryItem;

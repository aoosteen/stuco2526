import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { GalleryType } from "@/lib/GalleryActions";
import format from "date-fns/format";
import GalleryMobileButtons from "./GalleryMobileButtons";
import { urlFor } from "@/sanity/sanityClient";
import Link from "next/link";

export function GalleryMobile({
  terms,
  allData,
}: {
  terms: string[];
  allData: GalleryType[];
}) {
  const numWords = ["one", "two", "three", "four"];
  const TermComponent = ({ term }: { term: string }) => {
    const data = allData.filter((gal) => gal.term === term);

    const termNumWord =
      numWords[parseInt(term.replace("term", "Term ").split(" ")[1]) - 1];
    const originalIds = allData.map(({ _id }) => _id);
    return (
      <div
        className={cn(
          "px-6 flex flex-col ",
          originalIds.indexOf(data[0]._id) % 2 === 0
            ? "items-start"
            : "items-end"
        )}
        id={"term" + termNumWord}
      >
        <span className={cn("text-5xl text-yellow-800 ")}>
          {term.replace("term", "Term ")}
        </span>
        {}
        <div className="h-full mt-9">
          <div className="  h-full  flex flex-col gap-20 py-4  ">
            {data.map((gal) => (
              <GalleryItemMobile
                key={gal._id}
                index={originalIds.indexOf(gal._id)}
                gal={gal}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full flex flex-col gap-8 overflow-clip lg:hidden">
      <div className="flex gap-1 pl-6">
        {terms.map((term) => {
          const termNumWord =
            numWords[parseInt(term.replace("term", "Term ").split(" ")[1]) - 1];
          return (
            <GalleryMobileButtons
              key={term}
              term={term}
              termNumWord={termNumWord}
            />
          );
        })}
      </div>

      {terms.map((term) => (
        <TermComponent key={term} term={term} />
      ))}
      {/* <div className="px-6">
        <span className="text-5xl text-yellow-800 ">Term 1</span>
        <div className="h-full mt-9">
          <div className="  h-full  flex flex-col gap-20 py-4  ">
            {Array(8)
              .fill("")
              .map((_, index) => (
                <GalleryItemMobile key={index} index={index} />
              ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}

const GalleryItemMobile = ({
  index,
  gal,
}: {
  index: number;
  gal: GalleryType;
}) => {

  return (
    <div
      className={cn(
        " space-y-6 flex flex-col",
        index % 2 === 0 ? "items-start" : "items-end"
      )}
    >
      {Object.keys(gal).includes('highlights') && (
      <Link href={`/gallery/${gal._id}`}>
        <Image
          src={urlFor(gal.highlights[0]).url()} 
          alt={"Blog img"}
          width={300}
          height={100}
          className="    object-cover w-auto "
        />
      </Link>
      )}
      {/* <div className="w-10 h-10 rounded-full bg-orange-600 opacity-50" /> */}
      <div className="min-h-20  text-yellow-600 ">
        <div
          className={cn(
            "  flex flex-col",
            index % 2 === 0 ? "items-start" : "items-end"
          )}
        >
          <p>{format(new Date(gal.date), "dd MMMM yyyy")}</p>
          <Link href={`/gallery/${gal._id}`}>
            <h1 className="text-3xl hover:underline">{gal.title}</h1>
          </Link>
          <p
            className={cn(
              "text-yellow-900 mt-4 ",
              index % 2 === 0 ? "text-left" : "text-right"
            )}
          >
            {gal.description}
          </p>
        </div>
      </div>
    </div>
  );
};

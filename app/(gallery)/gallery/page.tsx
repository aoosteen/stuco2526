import React, { Suspense } from "react";

import GalleryContainer from "@/components/gallery/GalleryContainer";
import { GalleryMobile } from "@/components/gallery/GalleryMobile";
import GalleryItem from "@/components/gallery/GalleryItem";
import { getAllGaleries, getAllGalleryTerms } from "@/lib/GalleryActions";

const GalleryAllCompomnents = async () => {
  const terms = await getAllGalleryTerms();
  const all = await getAllGaleries();
  const total = all.length;

  const TermComponent = async ({ term }: { term: string }) => {
    // term = Term 1, Term 2, Term 3, Term 4

    const original = all.map(({ _id }) => _id);
    const data = all.filter((gal) => gal.term === term);

    return (
      <div className="relative w-full min-w-[900px]" id={term}>
        <span className="absolute top-1/2 -translate-y-1/2 text-[256px] text-[#F8EED7]  ">
          {term.replace("term", "Term ")}
        </span>
        <div className="h-full pl-16 ">
          <div className="  h-full  flex gap-40 py-4  ">
            {data.map((gal, index) => {
              return (
                <GalleryItem
                  gal={gal}
                  key={index}
                  index={original.indexOf(gal._id)}
                />
              );
            })}
            {/* {Array(1)
              .fill("")
              .map((_, index) => (
                <GalleryItem key={index} index={index} />
              ))} */}
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <GalleryContainer
        terms={terms.map((term) => term.replace("term", "Term "))}
        items={total}
      >
        <div className="w-full   flex  gap-30 shrink-0 relative h-[80vh] pr-16">
          {/* <div className="w-110  h-full absolute -right-16 top-0 bg-[var(--main-bg)] z-2" /> */}
          <div className="bg-[url(/gallery/yelowDottedLine.svg)] bg-repeat absolute top-1/2 -translate-y-1/2 w-full h-[2px]  bg-contain translate-x-16 z-1 " />{" "}
          {terms.map((term) => (
            <TermComponent key={term} term={term} />
          ))}
          {/* <div className="relative bg-green-200 w-full min-w-[900px] " id="term1">
            <span className="absolute top-1/2 -translate-y-1/2 text-[256px] text-[#F8EED7] whitespace-no-wrap shrink-0  ">
              Term 1
            </span>
            <div className="h-full pl-16 ">
              <div className="  h-full  flex gap-40 py-4  ">
                {Array(1)
                  .fill("")
                  .map((_, index) => (
                    <GalleryItem key={index} index={index} />
                  ))}
              </div>
            </div>
          </div>
          <div className="relative  w-full" id="term2">
            <span className="absolute top-1/2 text-nowrap -translate-y-1/2 text-[256px] text-[#F8EED7] w-full pr-32  ">
              Term 2
            </span>
            <div className="h-full pl-16">
              <div className="  h-full  flex gap-40 py-4  ">
                {Array(1)
                  .fill("")
                  .map((_, index) => (
                    <GalleryItem key={index} index={index} />
                  ))}
              </div>
            </div>
          </div> */}
          {/* 
          <div className="relative w-full  " id="term3">
            <span className="absolute top-1/2 -translate-y-1/2  text-[256px] text-[#F8EED7] whitespace-nowrap ">
              Term 3
            </span>
            <div className="h-full pl-16">
              <div className="  h-full  flex gap-40 py-4  ">
                {Array(10)
                  .fill("")
                  .map((_, index) => (
                    <GalleryItem key={index} index={index} />
                  ))}
              </div>
            </div>
          </div>
          <div className="relative w-full  " id="term4">
            <span className="absolute top-1/2 -translate-y-1/2  text-[256px] text-[#F8EED7] whitespace-nowrap">
              Term 4
            </span>
            <div className="h-full pl-16">
              <div className="  h-full  flex gap-40 py-4  ">
                {Array(8)
                  .fill("")
                  .map((_, index) => (
                    <GalleryItem key={index} index={index} />
                  ))}
              </div>
            </div>
          </div> */}
        </div>
      </GalleryContainer>
      <GalleryMobile terms={terms} allData={all} />
    </>
  );
};

const page = () => {
  return (
    <main className="h-full w-full  bg-[var(--main-bg)] ">
      {/* <div className="absolute top-0 left-0 bg-[var(--main-bg)] h-[300vh] w-screen -z-100"/> */}
      <div className="relative w-screen shrink-0 h-[55vh]  flex flex-col justify-center px-6 md:px-12 galleryBanner bg-[url(../public/gallery/GalleryBanner.webp)]  bg-repeat-round bg-cover">
        <div className="z-10 flex flex-col gap-4 items-center">
          <h1 className="text-5xl text-white">Gallery</h1>
          <p className="text-white text-center">
            A trip down memory lane! What do these records store?
          </p>
        </div>
        {/* <Image
          priority
          src={"/gallery/GalleryBanner.png"}
          alt="yellow banner"
          width={1200}
          height={1200}
          className="w-full  object-cover absolute  left-0 h-full "
        /> */}
      </div>

      <Suspense
        fallback={
          <div className="w-full h-[50vh]  bg-[var(--main-bg)] flex items-center justify-center">
            <p>Loading...</p>
          </div>
        }
      >
        <GalleryAllCompomnents />
      </Suspense>
    </main>
  );
};

export default page;

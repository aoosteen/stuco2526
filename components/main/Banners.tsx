import { getAllBanners } from "@/lib/BannerActions";
import { urlFor } from "@/sanity/sanityClient";
import Image from "next/image";
import React from "react";

const Banners = async () => {
  const data = await getAllBanners();

  return (
    <div className="flex flex-col gap-4 mt-16 z-1 w-screen md:px-8">
      {data.map((banner: any) => (
        <div key={banner._id} className="w-full  flex  justify-center items-center 
         md:mask-[url(../public/main/BannerPaper.png)] relative overflow-hidden mask-no-repeat mask-cover

          ">
          <Image
            priority
            src={urlFor(banner.bannerImage).url()}
            alt="Banner"
            width={1000}
            height={1000}
            className="w-full  object-cover "
          />
        </div>
      ))}
    </div>
  );
};

export default Banners;

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { getGalllery } from "@/lib/GalleryActions";
import { cn } from "@/lib/utils";
import format from "date-fns/format";
const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ galleryId: string }>;
  searchParams: Promise<{ tab: string }>;
}) => {
  const categories = [
    "Highlights",
    "Behind The Scenes",
    "Student's Collection",
    "Miscellaneous",
  ];

  const {galleryId} = await params
  const data = await getGalllery(galleryId);

  const sp = await searchParams;

  const currentTab = sp.tab ?? "Highlights";
  return (
    <div className="px-12 pb-8 pt-38 flex lg:flex-row flex-col gap-16 h-full">
      <section className="flex flex-col w-[400px] shrink-0 h-full">
        <Link
          className="text-yellow-600 flex items-center text-2xl "
          href={"/gallery"}
        >
          <ChevronLeft size={28} />
          Gallery
        </Link>
        <div className="flex flex-col gap-4 mt-8 pl-7 text-yellow-600">
          <div className="bg-[#FFC21A] rounded-full size-10 flex justify-center items-center text-2xl ">
            {data.specialImage}
          </div>
          <div>
            <p>{format(new Date(data.date), "dd MMMM yyyy")}</p>
            <h1 className="text-3xl font-bold text-[#BE8B01]">{data.title}</h1>
            <p className="text-yellow-900 mt-4">{data.description}</p>
            <div className="relative mt-8">
              <Image
                src={"/gallery/GalleryCategories.png"}
                alt={""}
                width={1000}
                height={1000}
              />
              <div className="absolute top-0 left-0 w-full h-full flex flex-col items-start  px-8 pt-6">
                {categories.map((cat, i) => (
                  <Link
                    scroll={false}
                    key={cat}
                    href={`/gallery/${galleryId}?tab=${cat}`}
                    className="flex gap-2 justify-start py-4 first:pt-0 border-b-[#FFC21A] border-b-1 w-full last:border-b-0"
                  >
                    <div
                      key={cat}
                      className="flex gap-2 justify-start items-center first:pt-0 border-b-[#FFC21A] border-b-1 w-full last:border-b-0"
                    >
                      <div
                        className={cn(
                          "rounded-full bg-[#F4E7CA] w-8 h-8 flex justify-center items-center",
                          currentTab === cat &&
                            "border-dashed border-yellow-500 border-2"
                        )}
                      >
                        {i + 1}
                      </div>
                      <span
                        className={cn(
                          "tracking-tight font-light",
                          currentTab === cat && "text-yellow-600 font-bold"
                        )}
                      >
                        {cat}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="bg-yellow-600 flex-1 w-full"></div>
    </div>
  );
};

export default page;

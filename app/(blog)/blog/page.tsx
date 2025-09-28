import BlogList from "@/components/blog/BlogList";
import BlogPreview from "@/components/blog/BlogPreview";
import { NavBlogSheet } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FilterProps } from "@/lib/types";
import BlogItems from "@/components/blog/BlogItems";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<FilterProps>;
}) => {
  const sp = await searchParams;
  return (
    <div className="bg-[var(--main-bg)]   flex flex-col xl:flex-row xl:h-fit">
      <aside className=" hidden  w-[600px] sticky top-0 h-screen  shrink-0 xl:flex xl:flex-col gap-0 justify-start bg-[url(/blogs/VerticalBanner.png)] bg-cover bg-no-repeat p-12 pr-32 ">
        <div className="flex justify-between items-center mb-6">
          <div className=" w-fit p-2 rounded-full bg-white  ">
            <Link href={"/"}>
              <Image
                priority
                src="/StucoLogo.png"
                alt="Stuco Logo"
                width={30}
                height={30}
                className=""
              />
            </Link>
          </div>
          <NavBlogSheet />
        </div>
        <div className="z-10 flex flex-col gap-4 items-start shrink-0 ">
          <h1 className="text-5xl text-white text-start">Blog</h1>
          <p className="text-white text-start">
            Delve into YOUR perspectives in this blog space created by students,
            for students. Come read, reflect, or even write—allow your ideas to
            thrive!
          </p>
        </div>
        <div className="scale-75 -translate-y-1/10">
          <BlogPreview />
        </div>
      </aside>
      <div className="relative w-screen  h-[55vh]  bg-contain  flex flex-col xl:hidden justify-center px-6 md:px-12">
        {/* banner on mobile */}
        <div className="z-10 flex flex-col gap-4 items-center">
          <h1 className="text-5xl text-white">Blog</h1>
          <p className="text-white text-center">
            Delve into YOUR perspectives in this blog space created by students,
            for students. Come read, reflect, or even write—allow your ideas to
            thrive!
          </p>
        </div>
        <Image
          loading="eager"
          src={"/blogs/StucoBlogBanner.png"}
          alt="blue banner"
          width={1200}
          height={1200}
          className="w-full  object-cover absolute  left-0 h-full "
        />
      </div>
      <div className="p-6 md:p-12 pt-0 md:pt-0  w-full">
        <BlogList>
          <BlogItems searchParams={sp} />
        </BlogList>
      </div>
    </div>
  );
};

export default page;

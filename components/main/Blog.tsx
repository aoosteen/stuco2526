import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import BlogFrame from "./blog/BlogFrame";
import { getAllLatestBlogs } from "@/lib/BlogActions";

const Blog = async () => {
  const LatestBlogs = await getAllLatestBlogs();
  // console.log(LatestBlogs)

  const presets = [
    {
      ratio: "1257/1653",
      src: "/blogs/BlogPaper.png",
      button: true,
      className:'z-3 '
    },
    {
      ratio: "1214/1351",
      src: "/blogs/BlogPaperSmall.png",
      button: false,
      className:" z-2 h-[85%] "
    },
    {
      ratio: "1214/1351",
      src: "/blogs/BlogPaperSmall.png",
      button: false,
      className:" h-[85%]  "
    },
  ];
  return (
    <section className="w-screen p-12 pt-0  lg:grid lg:grid-cols-2 flex flex-col  ">
      <div className="h-full py-16 pt-0 sm:pt-16 lg:pr-24 flex flex-col  justify-center space-y-8">
        <h1 className="text-6xl  text-sky-900">Our Blogs</h1>
        <p className="text-sky-900 ">
          Esse non nostrud tempor tempor et anim consectetur eiusmod nulla
          commodo ad aliquip occaecat. Qui do consequat nulla minim eiusmod in
          proident. Qui laboris aliquip sint esse incididunt laborum fugiat
          minim culpa deserunt. Nulla incididunt ex do cupidatat aliquip nostrud
        </p>
        <div className="flex gap-4">
          <Link href={"/blog"}>
            <Button variant={"blue"} className="">
              Open blog
            </Button>
          </Link>
          <Button variant={"blueOutline"}>Submit an article</Button>
        </div>
      </div>

      <div className="w-full h-full hidden md:flex items-end -space-x-40   gap-0 lg:pb-8 shrink-0">
        {/* <BlogFrame
          button
          ratio="1257/1653"
          src="/blogs/BlogPaper.png"
          data={undefined}
        />
        <BlogFrame
          ratio="1214/1351"
          src="/blogs/BlogPaperSmall.png"
          className="-z-1 h-[85%]"
          data={undefined}
        />
        <BlogFrame
          ratio="1214/1351"
          src="/blogs/BlogPaperSmall.png"
          className="-z-2 h-[85%]"
          data={undefined}
        /> */}

        {LatestBlogs.map((blog, index) => {
          return (
            <BlogFrame
              key={blog._id}
              ratio={presets[index].ratio}
              src={presets[index].src}
              button={presets[index].button}
              className={presets[index].className}
              data={blog}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Blog;

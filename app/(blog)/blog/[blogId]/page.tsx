import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import React, { Suspense } from "react";
import Image from "next/image";
import BlogItem from "@/components/blog/BlogItem";
import { getCurrentBlog, getOtherblogs } from "@/lib/BlogActions";
import BlogPageTraacker from "@/components/blog/BlogPageTraacker";
import { client} from "@/sanity/sanityClient";
import Link from "next/link";
import { PortableText } from "next-sanity";
import urlBuilder from "@sanity/image-url";
import { getImageDimensions} from "@sanity/asset-utils";

const ImageComponent = ({ value, isInline }: any) => {
 if(!value.asset?.url) return null
  const { width, height } = getImageDimensions(value);
  return (
    <Image
      width={width}
      height={height}
      src={urlBuilder(client)
        .image(value)
        .width(isInline ? 100 : 800)
        .fit("max")
        .auto("format")
        .url()}
      alt={value.alt || " "}
      loading="lazy"
      style={{
        display: isInline ? "inline-block" : "block",
        aspectRatio: width / height,
      }}
    />
  );
};

const components = {
  types: {
    image:({value,isInline}:any) =>{
      if(!value ){
        return null
      }
      return <ImageComponent value={value} isInline={isInline} />
    } 
      
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const {blogId} = await params
  const data = await getCurrentBlog(blogId);
  return {
    title: `${data?.title}`,
  };
}
const page = async ({ params }: { params: Promise<{ blogId: string }> }) => {
  const {blogId} = await params
  const data = await getCurrentBlog(blogId);

  return (
    <BlogPageTraacker>
      <section className="flex flex-col gap-8 flex-1 ">
        <header className="flex flex-col gap-2.5">
          <div className="flex gap-2 flex-wrap">
            {data.tags.map((tag) => (
              <Badge key={tag} variant={"blue"}>
                <p className="!text-sm capitalize">{tag}</p>
              </Badge>
            ))}
          </div>
          <div className="flex flex-col ">
            <h1 className="text-4xl font-bold">{data.title}</h1>
            <p className="capitalize mt-1">By {data.author}</p>
          </div>
          <div className="flex gap-2 items-center text-[#666460]">
            <Clock size={20} className="stroke-[1.5]" />
            <p className="p-0">
              {format(new Date(data._createdAt), "dd MMMM yyyy")}
            </p>
          </div>
        </header>
        {/* <Image
          src={urlFor(data.coverImage).url()}
          alt="Blog cover image"
          width={1000}
          height={1000}
          className="object-cover aspect-video"
        /> */}
        <article
          className="prose  hyphens-auto wrap-normal text-left prose-p:text-left! prose-p:w-full prose-headings:text-left h-full 
          prose-img:self-center prose-h1:text-3xl max-w-none prose-h1:font-extrabold prose-h1:mt-6 prose-h1:mb-3 prose-h1:tracking-tight prose-h2:scroll-m-20 prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:mt-4 prose-h2:mb-4 prose-h3:mt-3 prose-h3:mb-4 prose-h3:font-medium prose-h4:text-lg prose-h4:mt-3 prose-h4:font-medium prose-p:mb-2 "
        >
          <PortableText   value={data.blog} components={components} />
        </article>
      </section>
      <aside className="bg-[#EBECE9] lg:ml-8    p-6 space-y-2  lg:max-w-[350px]  h-fit shrink-0">
        <h1 className="text-sky-800 text-2xl font-bold tracking-tighter">
          Read other posts
        </h1>
        <Image
          src={"/blogs/OtherBlogsSeperator.png"}
          alt="Paper seperator"
          width={1000}
          height={100}
          priority
        />
        <div className="flex flex-col">
          <Suspense fallback={<LoadingBlogs />}>
            <LatsetBlogItems id={blogId} />
          </Suspense>
        </div>
      </aside>
    </BlogPageTraacker>
  );
};

const LatsetBlogItems = async ({id}:{id:string}) => {
  const data = await getOtherblogs(id);
  return (
    <div>
      {data.map((blog) => (
        <Link key={blog._id} href={`/blog/${blog._id}`}>
          <BlogItem blog={blog} key={blog._id} index={0} pattern={0} />
        </Link>
      ))}
      {data.length === 0 && <p className="text-center">No blogs found.</p>}
    </div>
  );
};

const LoadingBlogs = () => {
  return (
    <div className="flex h-full gap-4">
      <p>Finding...</p>
    </div>
  );
};

export default page;

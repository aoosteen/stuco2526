import { FilterProps } from "@/lib/types";
import React from "react";
import {
  getAllPaginatedBlogs,
} from "@/lib/BlogActions";

import BlogItemsClient from "./BlogItemsClient";

const BlogItems = async ({ searchParams }: { searchParams: FilterProps }) => {
  const data = await getAllPaginatedBlogs(
    [searchParams.tag].flat().filter(Boolean) as string[],
    searchParams.order ?? 'desc',
    searchParams.search ?? '',
    '',
  );
  // const TotalPage = await countAllBlogs();
  return (
    <>
      <BlogItemsClient data={data} />
      {/* <CustomPagination
        className="mt-8"
        totalPage={Math.ceil(TotalPage / 5)}
        scroll={false}
        data={data}
        cursor={searchParams.cursor ?? ''}
      /> */}
      {/* <BlogCursor cursor={searchParams.cursor ?? ''} /> */}
    </>
  );
};
export default BlogItems;

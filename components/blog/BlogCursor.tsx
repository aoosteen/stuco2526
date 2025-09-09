"use client";
import { useRouter, useSearchParams } from "next/navigation";
import  { useEffect } from "react";

const BlogCursor = ({ cursor }: { cursor: string }) => {
  const searchParams = useSearchParams();
  const sp = new URLSearchParams(searchParams);
  const router = useRouter();
  sp.set("cursor", cursor);
  useEffect(() => {
    router.push(`/blog?${sp.toString()}`, { scroll: false });
  }, [cursor]);
  
  return null;
};

export default BlogCursor;

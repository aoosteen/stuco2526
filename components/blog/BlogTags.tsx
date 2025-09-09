"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { ScrollBar } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckIcon } from "lucide-react";

const BlogTags = () => {
  const BlogTags = [
    {
      name: "Featured",
    },
    {
      name: "Announcements",
    },
    {
      name: "News",
    },
    {
      name: "Editorials",
    },
    {
      name: "From Our Students",
    },
  ];
  const [tabScrollProg, setTabScrollProg] = useState(0);
  return (
    <div className="xl:w-full flex  justify-between ">
      <ScrollArea
        className=" w-40  sm:w-full  lg:w-80 xl:w-full relative p-0"
        onScrollProgressChange={(prog) => setTabScrollProg(prog)}
      >
        <div className="flex gap-1 ">
          {BlogTags.map((tag) => {
            return (
              <Button key={tag.name} variant={"blueOutline"}>
                {tag.name}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" hidden />
        <AnimatePresence mode="wait">
          {tabScrollProg < 95 && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: tabScrollProg < 95 ? 1 : 0,
              }}
              exit={{
                opacity: 0,
              }}
              className="absolute top-0 right-0 h-full w-14  bg-gradient-to-r to-[var(--main-bg)]"
            /> //right
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {tabScrollProg > 5 && (
            <motion.div
              animate={{
                opacity: tabScrollProg > 5 ? 1 : 0,
              }}
              exit={{
                opacity: 0,
              }}
              className="absolute top-0 left-0 h-full w-14  bg-gradient-to-l to-[var(--main-bg)]"
            /> //left
          )}
        </AnimatePresence>
      </ScrollArea>
      <SortSelect className="flex lg:hidden" />
    </div>
  );
};
const SortSelect = ({ className }: { className?: string }) => {
  return (
    <Select defaultValue="asc">
      <SelectTrigger
        className={cn("rounded-none shadow-none border-sky-800", className)}
        Icon={<ChevronDown size={16} className="text-sky-800 " />}
      >
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent className="">
        <SelectItem
          value="asc"
          CheckCustomIcon={<CheckIcon size={16} className="text-sky-800 " />}
        >
          <p className="text-sky-800">Newest</p>
        </SelectItem>
        <SelectItem
          value="Desc"
          CheckCustomIcon={<CheckIcon size={16} className="text-sky-800 " />}
        >
          <p className="text-sky-800">Oldest</p>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
export default BlogTags;

"use client";
import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import SearchBar from "./SearchBar";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CheckIcon, ChevronDown } from "lucide-react";

import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
const BlogList = ({ children }: { children?: React.ReactNode }) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [tabScrollProg, setTabScrollProg] = useState(0);

  const searchParams = useSearchParams();
  const sp = new URLSearchParams(searchParams);
  const router = useRouter();
  const BlogTags = [
    {
      name: "Event/Programme",
    },
    {
      name: "Personal",
    },
    {
      name: "Thematic",
    },
    {
      name: "Record",
    },
    {
      name: "Experience/Anecdote",
    },
    {
      name: "Discussion",
    },
    {
      name: "Case Study",
    },
    {
      name: "Behind-the-Scenes",
    },
    {
      name: "Recap",
    },
    {
      name: "Review",
    },
    {
      name: "Reflective",
    },
    {
      name: "Informative",
    },
    {
      name: "Analysis",
    },
    {
      name: "Relatable",
    },
  ];
  useEffect(() => {
    if (!tabsRef) return;
    const handleScroll = () => {
      if (tabsRef.current) {
        const {
          scrollLeft,
          scrollWidth,
          clientWidth,
        } = tabsRef.current;
        const progress =
          (Math.ceil(scrollLeft) / (scrollWidth - clientWidth)) * 100;
        setTabScrollProg(isNaN(progress) ? 0 : Math.ceil(progress)); // Handle division by zero if content fit
      }
    };

    const tabsElement = tabsRef.current;
    if (tabsElement) {
      tabsElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (tabsElement) {
        tabsElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="sm:space-y-4   bg-[var(--main-bg)] ">
      <div className="sm:space-y-4 md:sticky z-100 xl:top-0 pb-4 xl:pt-12 bg-[var(--main-bg)]">
        <div className="flex gap-2  ">
          <SearchBar />
          <SortSelect className="" />
          {/* <AlphabeticalSortSelect className="" /> */}
        </div>

        <div className="relative">
          <div
            className="overflow-x-scroll relative  w-full sm:overflow-auto h-16 sm:h-full hide-scrollbar"
            ref={tabsRef}
          >
            <div className="flex gap-1   absolute top-1/2 -translate-y-1/2 left-0 sm:translate-y-0 sm:relative sm:flex-wrap">
              {BlogTags.map((tag) => {
                return (
                  <Button
                    key={tag.name}
                    variant={"blueOutline"}
                    className={cn(
                      "whitespace-normal",
                      sp.getAll("tag").includes(tag.name) &&
                        "bg-sky-800 text-[var(--main-bg)] hover:bg-sky-800/90"
                    )}
                    onClick={() => {
                      if (sp.getAll("tag").includes(tag.name)) {
                        sp.delete("tag", tag.name);
                      } else {
                        sp.append("tag", tag.name);
                      }
                      router.push(`/blog?${sp.toString()}`);
                    }}
                  >
                    {tag.name}
                  </Button>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: tabScrollProg < 95 ? 1 : 0,
              display: tabScrollProg < 95 ? "block" : "none",
            }}
            exit={{
              opacity: 0,
            }}
            className="absolute top-0 right-0 h-full w-14 sm:hidden bg-gradient-to-r to-[var(--main-bg)]"
          />

          <motion.div
            animate={{
              opacity: tabScrollProg > 5 ? 1 : 0,
              display: tabScrollProg > 5 ? "block" : "none",
            }}
            exit={{
              opacity: 0,
            }}
            className="absolute top-0 left-0 h-full w-14 sm:hidden  bg-gradient-to-l to-[var(--main-bg)]"
          />
        </div>
      </div>
      {/* <div className="flex  justify-between ">
        <ScrollArea
          className="pb-2  w-1/2"
          onScrollProgressChange={(prog) => setTabScrollProg(prog)}
        >
          <div className="flex gap-1 ">
            {BlogTags.map((tag) => {
              return (
                <Button
                  key={tag.name}
                  variant={"blueOutline"}
                  className="whitespace-normal"
                >
                  {tag.name}
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="mt-4" />
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
          />

          <motion.div
            animate={{
              opacity: tabScrollProg > 5 ? 1 : 0,
            }}
            exit={{
              opacity: 0,
            }}
            className="absolute top-0 left-0 h-full w-14  bg-gradient-to-l to-[var(--main-bg)]"
          />
        </ScrollArea>
        </div> */}
      <AnimatePresence>
        <Suspense key={sp.toString()} fallback={<LoadingBlogs />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
          >
            {children}
          </motion.div>
        </Suspense>
      </AnimatePresence>
    </div>
  );
};

const LoadingBlogs = () => {
  return (
    <div className="flex h-[70vh] w-full justify-center items-center">
      <p>Loading...</p>
    </div>
  );
};

const SortSelect = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const sp = new URLSearchParams(searchParams);
  const router = useRouter();
  return (
    <Select
      defaultValue={sp.get("order") ?? "desc"}
      onValueChange={(value) => {
        sp.set("order", value);
        router.push(`/blog?${sp.toString()}`);
      }}
    >
      <SelectTrigger
        className={cn("rounded-none shadow-none border-sky-800", className)}
        Icon={<ChevronDown size={16} className="text-sky-800 " />}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="z-101">
        <SelectItem
          value="desc"
          className="hover:bg-sky-200/10"
          CheckCustomIcon={<CheckIcon size={16} className="text-sky-800  " />}
        >
          <p className="text-sky-800">Newest</p>
        </SelectItem>
        <SelectItem
          className="hover:bg-sky-200/10"
          value="asc"
          CheckCustomIcon={<CheckIcon size={16} className="text-sky-800 " />}
        >
          <p className="text-sky-800">Oldest</p>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};


// const AlphabeticalSortSelect = ({className}:{className?:string}) => {
//   const searchParams = useSearchParams();
//   let sp = new URLSearchParams(searchParams);
//   const router = useRouter();
//   return (
//      <Select
//       defaultValue={sp.get("letter") ?? "az"}
//       onValueChange={(value) => {
//         sp.set("letter", value);
//         router.push(`/blog?${sp.toString()}`);
//       }}
//     >
//       <SelectTrigger
//         className={cn("rounded-none shadow-none border-sky-800", className)}
//         Icon={<ChevronDown size={16} className="text-sky-800 " />}
//       >
//         <SelectValue />
//       </SelectTrigger>
//       <SelectContent className="z-101">
//         <SelectItem
//           value="az"
//           className="hover:bg-sky-200/10"
//           CheckCustomIcon={<CheckIcon size={16} className="text-sky-800  " />}
//         >
//           <p className="text-sky-800">A-Z</p>
//         </SelectItem>
//         <SelectItem
//           className="hover:bg-sky-200/10"
//           value="za"
//           CheckCustomIcon={<CheckIcon size={16} className="text-sky-800 " />}
//         >
//           <p className="text-sky-800">Z-A</p>
//         </SelectItem>
//       </SelectContent>
//     </Select>
//   )
//   }

export default BlogList;

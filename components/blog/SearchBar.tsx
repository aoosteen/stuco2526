"use client";
import { Search } from "lucide-react";
import React, { useEffect,  useState } from "react";
import { Input } from "../ui/input";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const SearchBar = () => {
  const [Find, setFind] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const title = searchParams.get("search");

  useEffect(() => {
    setFind(title ?? "");
  }, []);

  // useEffect(() => {
  //   searchButton.current?.addEventListener("keydown", (e: KeyboardEvent) => {
  //     switch (e.code) {
  //       case "Enter":
  //         HandleFind(Find);
  //     }
  //   });
  //   return () => {
  //     searchButton.current?.removeEventListener(
  //       "keydown",
  //       (e: KeyboardEvent) => {
  //         switch (e.code) {
  //           case "Enter":
  //             HandleFind(Find);
  //         }
  //       }
  //     );
  //   };
  // });

  const HandleFind = (value: string) => {
     const sp = new URLSearchParams(searchParams);
    if ((value.trim() ?? " ") === "") {
      sp.delete("search");
    } else {
      sp.set("search", value.toLowerCase());
    }
    router.push(`${pathname}?${sp.toString()}`, { scroll: false });
  };
  return (
    <div
      className="flex flex-1  bg-white border border-sky-800 px-3 py-2 items-center"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          HandleFind(Find);
        }
      }}
    >
      <Search size={16} className="text-muted-foreground" />
      <Input
        className="border-none shadow-none  py-0 tabular-nums tracking-normal h-5 placeholder:leading-[20px] "
        placeholder="Search Blog..."
        onChange={(e) => setFind(e.target.value)}
        defaultValue={title ?? ""}
      />
    </div>
  );
};

export default SearchBar;

"use client";
import React, { useEffect,  useRef, useState } from "react";
import { PaginationEllipsis } from "@/components/ui/pagination";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const PaginationInput = ({ total }: { total: number }) => {
  const [value, setValue] = useState<any>('');
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const inputValue = e.target.value ?? 1;
    if (
      (inputValue === "" || /^[0-9]+$/.test(inputValue)) &&
      inputValue.length <= total.toString().length
    ) {
      setValue(inputValue);
    }
  };

  useEffect(() => {
    input.current?.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        if (value <= total) {
          setParam(value ?? 0);
          setValue(null);
          setOpen(false);
        }
      }
    });
    return () => {
      input.current?.removeEventListener("keydown", (e: KeyboardEvent) => {
        switch (e.code) {
          case "Enter":
            setParam(value);
            setValue(null);
            break;
        }
      });
    };
  }, [value]);

  const setParam = (page: number) => {
    const sp = searchParams.get("page") ?? "";
    const spa = new URLSearchParams(searchParams);

    if (page == 0) {
      spa.set("page", "1");
    } else if (page > total) {
      spa.set("page", sp.toString());
    } else {
      spa.set("page", Number(page).toString());
    }

    router.push(`${pathname}?${spa.toString()}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <PaginationEllipsis className="" />
      </PopoverTrigger>
      <PopoverContent
      side="top"
        asChild
        hideWhenDetached
        className=" h-[2rem] w-10 min-w-none p-0 ring-none"
        
      >
        <div ref={input}>
          <Input
            type="text"
            maxLength={3}
            value={value}
            onChange={handleChange}
            className="px-1 h-8 text-center "
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PaginationInput;

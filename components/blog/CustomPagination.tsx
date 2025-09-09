"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PaginationInput from "./PaginationInput";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BlogType } from "@/lib/types";

const CustomPagination = ({
  totalPage,
  className,
  scroll,
  data
}: {
  data:BlogType[];
  totalPage: number;
  cursor: string;
  className?: string;
  scroll?: boolean;
}) => {
  let init = 0;
  let end = 0;

  const searchParams = useSearchParams();
  const sp = new URLSearchParams(searchParams);
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = parseInt(searchParams.get("page") ?? "1") ?? 1;
  return (
    <Pagination className={cn("mt-auto", className)}>
      <PaginationContent>
        <PaginationItem
          onClick={() => {
            sp.set("page", `${currentPage > 1 ? currentPage - 1 : 1}`);
            sp.set('cursor',data[data.length-1]?._id ?? '')
            sp.set('dir','back')
            router.push(`${pathname}/?${sp.toString()}`, { scroll: scroll });
          }}
        >
          <PaginationPrevious
            // href={{
            //   query: {
            //     ...searchParams,
            //     page: `${currentPage > 1 ? currentPage - 1 : 1}`,
            //   },
            // }}
            href={`${pathname}/?${sp.toString()}`}
            disable={currentPage <= 1 ? true : false}
            className=""
            scroll={scroll}
          />
        </PaginationItem>

        {(totalPage > 5
          ? (init = 3)
          : (init = totalPage == 0 ? 1 : totalPage)) &&
          Array(init)
            .fill("")
            .map((item, index) => (
              <PaginationItem
                key={index}
                onClick={() => {
                  sp.set("page", `${index + 1}`);
                  sp.set('cursor',data[data.length-1]?._id ?? '')
                  router.push(`${pathname}/?${sp.toString()}`, {
                    scroll: scroll,
                  });
                }}
                className={`${
                  currentPage > 5 || (currentPage > 3 && totalPage > 5)
                    ? index > 0
                      ? "hidden"
                      : "flex"
                    : "flex"
                }`}
              >
                <PaginationLink
                  // href={{
                  //   query: {
                  //     ...sp,
                  //     page: (index + 1).toString(),
                  //   },
                  // }}
                  href={`${pathname}/?${sp.toString()}`}
                  scroll={scroll}
                  isActive={currentPage == index + 1 ? true : false}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
        <PaginationItem className={`${totalPage < 6 ? "hidden" : "flex"}`}>
          <PaginationInput total={totalPage} />
        </PaginationItem>

        <PaginationItem
          className={`${
            totalPage > 5 &&
            totalPage > 5 &&
            currentPage > 3 &&
            currentPage < totalPage - 2
              ? "flex"
              : "hidden"
          }`}
          onClick={() => {
            sp.set("page", `${currentPage}`);
            sp.set('cursor',data[data.length-1]?._id ?? '')
            router.push(`${pathname}/?${sp.toString()}`, { scroll: scroll });
          }}
        >
          <PaginationLink
            href={`${pathname}/?${sp.toString()}`}
            // isActive={true}
            scroll={scroll}
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem
          className={`${
            totalPage > 5 &&
            totalPage > 5 &&
            currentPage > 3 &&
            currentPage < totalPage - 2
              ? "flex"
              : "hidden"
          }`}
        >
          <PaginationInput total={totalPage} />
        </PaginationItem>

        <span className={`${totalPage > 5 ? "flex" : "hidden"}`}>
          {(totalPage - 2 == currentPage ? (end = 3) : (end = 3)) &&
            Array(end)
              .fill("")
              .map((item, index) => (
                <PaginationItem
                  key={index}
                  className={`${
                    totalPage > 5 && totalPage - 3 >= currentPage
                      ? index < 2
                        ? "hidden"
                        : "flex"
                      : "flex"
                  }`}
                  onClick={() => {sp.set("page", `${index + (totalPage - 2)}`)
                    sp.set('cursor',data[data.length-1]?._id ?? '')
                    router.push(`${pathname}/?${sp.toString()}`, { scroll: scroll });
                  }}
                >
                  <PaginationLink
                    href={`${pathname}/?${sp.toString()}`}
                    isActive={
                      currentPage * -1 == 2 - index - totalPage ? true : false
                    }
                    scroll={scroll}
                  >
                    {index + (totalPage - 2)}
                  </PaginationLink>
                </PaginationItem>
              ))}
        </span>
        <PaginationItem
          onClick={() => {
            sp.set(
              "page",
              `${currentPage < totalPage ? currentPage + 1 : totalPage}`
            );
            sp.set('cursor',data[data.length-1]?._id ?? '')
            sp.set('dir','forward')
            router.push(`${pathname}/?${sp.toString()}`, { scroll: scroll });
          }}
        >
          <PaginationNext
            // href={{
            //   query: {
            //     ...sp,
            //     page: `${
            //       currentPage < totalPage
            //         ? (Number(currentPage) + 1).toString()
            //         : totalPage
            //     }`,
            //   },
            // }}
            href={`${pathname}/?${sp.toString()}`}
            disable={currentPage >= totalPage ? true : false}
            className=""
            scroll={scroll}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;

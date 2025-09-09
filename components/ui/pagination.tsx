import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  scroll?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<typeof Link>;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  scroll,
  ...props
}: PaginationLinkProps) => (
  <Link
    role="link"
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      isActive ? "border-sky-800 text-sky-800" : "",
      "neucha rounded-full p-3",
      className
    )}
    {...props}
    scroll={scroll}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  disable,
  href,

  scroll,
}: {
  className: string;
  href: any;
  disable: boolean;
  scroll?: boolean;
}) => (
  <Button variant={"ghost"} className="" disabled={disable} asChild>
    <Link
      href={href}
      className={cn(
        "flex gap-1 items-center",
        disable ? "opacity-50 pointer-events-none" : ""
      )}
      scroll={scroll}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </Link>
  </Button>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  href,
  disable,

  scroll,

}: {
  className: string | undefined;
  disable: boolean;
  scroll?: boolean;
  href: any;
}) => (
  <Button className="flex" disabled={disable} variant={"ghost"} asChild>
    <Link
      href={href}
      className={cn(
        "flex gap-1 items-center",
        disable ? "opacity-50 pointer-events-none" : ""
      )}
      scroll={scroll}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </Link>
  </Button>
);
PaginationNext.displayName = "PaginationNext";

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};

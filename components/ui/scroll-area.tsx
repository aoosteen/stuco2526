"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";
import { useEffect } from "react";

function ScrollArea({
  className,
  children,
  onScrollProgressChange,
  manualScrollValue,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  onScrollProgressChange?: (progress: number) => void;
  manualScrollValue?: number;
}) {
  const viewPortRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  useEffect(() => {
    if (!viewPortRef) return;
    const handleScroll = () => {
      if (viewPortRef.current) {
        const {
          scrollLeft,
          scrollWidth,
          clientWidth,
        } = viewPortRef.current;
        const progress =
          (Math.ceil(scrollLeft) / (scrollWidth - clientWidth)) * 100;
        setScrollProgress(isNaN(progress) ? 0 : Math.ceil(progress)); // Handle division by zero if content fit
        if (onScrollProgressChange) {
          // call the prop function if it's defined
          onScrollProgressChange(progress);
        }
      }
    };

    const viewportElement = viewPortRef.current;
    if (viewportElement) {
      viewportElement.addEventListener("scroll", handleScroll);

    }
    handleScroll()

    return () => {
      if (viewportElement) {
        viewportElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollProgress]);

  useEffect(() => {
    if (manualScrollValue !== undefined && viewPortRef.current) {
      const { scrollWidth, clientWidth } = viewPortRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      const targetScrollLeft = manualScrollValue * maxScrollLeft;

      viewPortRef.current.scrollTo({
        left: targetScrollLeft,
        // behavior: "smooth",
      });
    }
  }, [manualScrollValue]);

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewPortRef}
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 ScrollArea"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };

"use client";
import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const GalleryContainer = ({

  terms,
  children,
  items
}: {
  noScroll?: React.ReactNode;
  children?: React.ReactNode;
  items:number,
  terms:string[]
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [active, setActive] = useState("term1");

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll(
    mounted
      ? {
          target: containerRef,
        }
      : {}
  );

  const scrollProg = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    if (!mounted) return;
    const unsubscribeProgress = scrollYProgress.on("change", (latest) => {
      setScrollProgress(latest);
    });

    const unsubscribeTransform = scrollProg.on("change", () => {});

    return () => {
      unsubscribeProgress();
      unsubscribeTransform();
    };
  }, [mounted, scrollYProgress, scrollProg]);

  useEffect(() => {
    const term4 = document.getElementById("term4");
    const term3 = document.getElementById("term3");
    const term2 = document.getElementById("term2");
    const term1 = document.getElementById("term1");
    if (term1 ) {
      if (term1.getBoundingClientRect().left <= 0) {
        setActive("term1");
      }
    }
    if (term2 ) {
      if (term2.getBoundingClientRect().left <= 0 || term2.getBoundingClientRect().right <= window.innerWidth) {
        setActive("term2");
      }
    }
    if (term3) {
      if (term3.getBoundingClientRect().left <= 0 || term3.getBoundingClientRect().right <= window.innerWidth) {
        setActive("term3");
      }
    }
    if (term4) {
      if (term4.getBoundingClientRect().left <= 0 || term4.getBoundingClientRect().right <= window.innerWidth) {
        setActive("term4");
      }
    }
  }, [scrollProgress]);

  const scrollToTerm = (term: string) => {
    const termId = term.toLowerCase().replace(/\s+/g, "");
    const scrollArea = document.querySelector(".ScrollArea");
    const element = document.getElementById(termId);
    if (element && scrollArea && containerRef.current) {
      const scrollAreaRect = scrollArea.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const maxScrollLeft = scrollArea.scrollWidth - scrollArea.clientWidth;
      const offset =
        elementRect.left - scrollAreaRect.left + scrollArea.scrollLeft;
      const needed = offset / maxScrollLeft;
      const galleryNeeded =
        needed * (containerRef.current.scrollHeight - window.innerHeight);
      window.scrollBy({
        top:
          galleryNeeded +
          (Math.floor(containerRect.top) === 0 ? 0 : containerRect.top),
        behavior: "smooth",
      });
    }
  };


  if (!mounted) return;
  return (
    <div ref={containerRef} className={`relative hidden lg:block `} 
    style={{
      height: `${items * 70}vh`
    }}
    >
      <section className="h-fit pt-12 w-screen sticky top-16">
        <div className="flex gap-1 pl-12">
          {terms.map((term) => (
            <Button
              key={term}
              variant={"yellowOutline"}
              className={cn(
                "cursor-pointer",
                active === term.toLowerCase().replace(/\s+/g, "") &&
                  "bg-yellow-800 text-[var(--main-bg)] hover:bg-yellow-800/90"
              )}
              onClick={() => {
                scrollToTerm(term);
              }}
            >
              {term}
            </Button>
          ))}
        </div>
        {/* <TermButtons terms={terms} /> */}
        <div className="">
          <ScrollArea
            className="flex flex-col justify-center"
            manualScrollValue={scrollProgress}
            // onScrollProgressChange={(prog) => window.scrollTo({
            //   top:prog* (refHeight)
            // }) }
          >
            {children}
          </ScrollArea>
        </div>
      </section>
    </div>
  );
};

export default GalleryContainer;

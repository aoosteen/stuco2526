"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import LandingVideo from "./LandingVideo";

type titleType = {
  start: number;
  end: number;
  title: string;
  className?: string;
};
const Landing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transformValue, setTransformValue] = useState(2.2);
  const [mounted, setMounted] = useState(false);
  const [scrollProgress,setScrollProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only initialize scroll hooks after component is mounted
  const { scrollYProgress } = useScroll(
    mounted
      ? {
          target: containerRef,
          offset: ["start start", "end end"],
        }
      : {}
  );
  const scrollProg = useTransform(scrollYProgress, [0, 1], [2.2, 0.525]);
  // const tv = useTransform(scrollYProgress, [0, 1], [200, 175]);
  useEffect(() => {
    if (!mounted) return;

    const unsubscribeProgress = scrollYProgress.on("change", (latest) => {
      setScrollProgress(latest);
    });

    const unsubscribeTransform = scrollProg.on("change", (latest) => {
      setTransformValue(latest);
    });

    return () => {
      unsubscribeProgress();
      unsubscribeTransform();
    };
  }, [mounted, scrollYProgress, scrollProg]);

  useEffect(() => {
    if (!mounted) return;
    // const homeMain = document.querySelector(".homeMain");
    if (window.scrollY > window.innerHeight * 5) {
      setTransformValue(2.2);
    } else {
      if (transformValue === 0.525) {
        setTransformValue(0.525);
      }
    }

    if (
      window.scrollY < window.innerHeight * 5.5 &&
      window.scrollY > window.innerHeight * 5
    ) {
      setTransformValue(0.525);
    }
  });
  const titles: titleType[] = [
    {
      start: 2.2,
      end: 1.95,
      title: "/main/Text1.png",
    },
    {
      start: 1.95,
      end: 1.4,
      title: "/main/Text2.png",
    },
    {
      start: 1.4,
      end: 0.4,
      title: "/main/Text3.png",
      className: "scale-200",
    },
  ];

  if (!mounted) return null;
  // x 130 y 110 for perfect scale

  // tv behind, zoom out to the left aja
  return (
    <div className="w-screen relative  ">
      <div
        className={cn("h-[500vh] relative  hidden lg:block ")}
        ref={containerRef}
      >
        <div
          style={{
            scale: transformValue < 1 ? transformValue : 1,
            transform:
              transformValue < 1
                ? `translateY(${(1 - transformValue) * -170}px)`
                : "translateX(0%)",
          }}
          className="sticky text-center aspect-video text-7xl  w-full top-0 left-0 flex justify-center items-center gap-4 h-screen  z-20 mx-auto

           bg-center "
        >
          <Suspense fallback={<div>Loading...</div>}>
            <LandingVideo prog={scrollProgress} className="shadow-xl" />
          </Suspense>

          {/* <Image
          className=" w-full h-full object-contain scale-x-180 scale-y-145   "
          src={"/main/TV.png"}
          fill
          alt="tv"
          style={
            {
              // transform: `scaleX(${transformValue}) scaleY(${transformValue})`,
            }
          }
        /> */}

          <Image
            src={
              titles.find(
                (title) =>
                  title.start >= transformValue && title.end <= transformValue
              )?.title ?? "/main/Text1.png"
            }
            width={500}
            height={500}
            alt="Welcome"
            className={cn(
              titles.find(
                (title) =>
                  title.start >= transformValue && title.end <= transformValue
              )?.className,
              ""
            )}
          />
        </div>
        <div
          className={cn(
            "sticky mx-auto top-0 left-0 h-screen w-screen  ",
            transformValue < 0.53 ? "z-30" : "z-10"
          )}
        >
          <Image
            className="  hidden lg:block  lg:px-[12vw]  aspect-video "
            src={"/main/TV2.png"}
            fill
            alt="tv"
            style={
              {
                // transform: `scaleX(${transformValue}) scaleY(${transformValue})`,
              }
            }
          />
        </div>
      </div>

      {/* mobile  */}
      <div className="relative lg:hidden ">
        <div
          className={cn(
            "sticky    w-screen  flex flex-col items-center justify-center mt-8 "
          )}
        >
          <Image
            width={400}
            height={100}
            src={"/main/Text3.png"}
            alt="Welcome to JNY Student Council"
            className=" sm:scale-125 md:scale-150"
          />
          <div className="relative">
            <LandingVideo className=" block object-contain scale-88 static  " />
            <Image
              className="  object-contain scale-135  aspect-video  "
              src={"/main/TV2.png"}
              fill
              alt="tv"
              style={
                {
                  // transform: `scaleX(${transformValue}) scaleY(${transformValue})`,
                }
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

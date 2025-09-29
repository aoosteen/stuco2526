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
  component: React.ReactNode;
};
const Landing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transformValue, setTransformValue] = useState(2.2);
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [step, setStep] = useState(0);

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
      component: (
        <Image
          src={"/main/Text1.png"}
          alt="Welcome"
          width={500}
          height={500}
          key={1}
          priority
        />
      ),
    },
    {
      start: 1.95,
      end: 1.4,
      title: "/main/Text2.png",
      component: (
        <Image
          priority
          key={2}
          src={"/main/Text2.png"}
          alt="To"
          width={500}
          height={500}
        />
      ),
    },
    {
      start: 1.4,
      end: 0.4,
      title: "/main/Text3.png",
      className: "scale-200",
      component: (
        <Image
          priority
          key={3}
          src={"/main/Text3.png"}
          alt="JNY Student Council"
          width={500}
          height={500}
          className="scale-200"
        />
      ),
    },
  ];

  useEffect(() => {
    if (2.2 >= transformValue && 1.95 <= transformValue) {
      setStep(0);
    }

    if (1.95 >= transformValue && 1.4 <= transformValue) {
      setStep(1);
    }

    if (1.4 >= transformValue && 0.4 <= transformValue) {
      setStep(2);
    }
  }, [transformValue]);

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
          <Suspense
            fallback={
              <div className="w-screen h-screen bg-[var(--main-bg)] flex items-center justify-center ">
                <p>Loading...</p>
              </div>
            }
          >
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

          {/* <Image
            src={
              titles.find(
                (title) =>
                  title.start >= transformValue && title.end <= transformValue
              )?.title ?? "/main/Text1.png"
            }
            priority
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
          /> */}

          {titles[step].component}
        </div>
        <div
          className={cn(
            "sticky mx-auto top-0 left-0 h-screen w-screen  ",
            transformValue < 0.53 ? "z-30" : "z-10"
          )}
        >
          <Image
            className="  hidden lg:block  lg:px-[12vw]  aspect-video "
            src={"/main/TV2.webp"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
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
      <div className="relative lg:hidden overflow-hidden   ">
        <div
          className={cn(
            "    w-screen  flex flex-col items-center justify-center -translate-y-16 mt-24"
          )}
        >
          <Image
            width={400}
            height={100}
            src={"/main/Text3.png"}
            alt="Welcome to JNY Student Council"
            className=" sm:scale-125 md:scale-150"
          />
          <div className="relative w-screen    ">
            <LandingVideo className=" block object-contain scale-88 static  " />
            <Image
              className="  object-contain   w-full h-full  scale-135 aspect-video max-w-screen "
              src={"/main/TV2.webp"}
              priority
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

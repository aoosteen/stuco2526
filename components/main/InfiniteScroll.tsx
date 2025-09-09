"use client";
import React, { useEffect, useRef, useState } from "react";

import { useScroll } from "framer-motion";
import { useDeviceWidth } from "@/hooks/useDeviceWidth";
import Image from "next/image";
import LandingVideo from "./LandingVideo";
const InfiniteScroll = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const deviceWidth = useDeviceWidth();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"], // Changed offset
  });

  const { scrollYProgress: wrapperScroll } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"], // Changed offset
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [wraooerProgress, setWrapperProgress] = useState(0);
  const [direction, setDirection] = useState("down");

  useEffect(() => {
    window.scrollTo(0, 100);
  }, []);
  useEffect(() => {
    const subscribe = scrollYProgress.on("change", (latest) => {
      setScrollProgress(latest);
    });

    const subscribeWrapper = wrapperScroll.on("change", (latest) => {
      setWrapperProgress(latest);
    });

    return () => {
      subscribe();
      subscribeWrapper();
    };
  }, [scrollYProgress]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const wrapperRefRect = wrapperRef.current?.getBoundingClientRect();

      // if(deviceWidth > 1024){
      if (wrapperRefRect && wrapperRef.current) {
        if (
          scrollPosition >= 100 &&
          scrollPosition <= wrapperRef.current.clientHeight - 100
        ) {
          setDirection("down");
        } else if (scrollPosition < 100) {
          setDirection("up");
        }
      }
      // }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [direction]);
  useEffect(() => {
    if (deviceWidth > 1024) {
      if (wraooerProgress === 1 && direction === "down") {
        window.scrollTo(0, 100);
      }
      const wrapperRefRect = wrapperRef.current?.getBoundingClientRect();
      if (wrapperRefRect) {
        if (direction === "up" && wraooerProgress === 0) {
          setDirection("down");
          window.scrollTo(
            0,
            document.documentElement.scrollHeight - window.innerHeight - 96
          );
        }
      }
    }
  }, [scrollProgress, wraooerProgress, deviceWidth]);

  return (
    <div className="h-fit relative" ref={wrapperRef}>
      <div ref={containerRef} className="h-fit homeMain">
        <div className="flex flex-col items-center ">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

const Footer = () => {
  return (
    <div
      className="relative h-[calc(100vh+100px)] hidden lg:block"
      style={{ clipPath: "polygon(0% 0, 105% 0%, 105% 105%, 0 105%)" }}
    >
      <div className="relative h-[calc(100vh+100vh+100px)] -top-[100vh]">
        <div className="h-[calc(100vh+100px)] sticky top-[calc(100vh-100vh)]">
          <div className="sticky text-center mb text-7xl  origin-bottom w-full top-0 left-0 flex justify-center items-center gap-4 h-screen p-12  ">
            <LandingVideo className="grayscale-100"/>
            <Image
            src={'/main/Text1.png'}
            width={500}
            height={500}
            alt="Welcome"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// [calc(100vh+100px)]

export default InfiniteScroll;

"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  Autoplay,
  EffectCoverflow,
  Keyboard,
  Navigation,
  Pagination,
  Virtual,
} from "swiper/modules";

import { AnimatePresence, motion } from "framer-motion";
import { useDeviceWidth } from "@/hooks/useDeviceWidth";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import Link from "next/link";
interface CarouselProps {
  // images: { src: string; alt: string }[]
  autoplayDelay?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
}


export const CardCarousel: React.FC<CarouselProps> = ({
  // images,
  // autoplayDelay = 1500,
  // showPagination = true,
  // showNavigation = true,
}) => {
  const width = useDeviceWidth();
  const [realIndex, setIndex] = useState(0);
  useEffect(() => {
    const nextButton = document.body.querySelector(".swiper-button-next");
    const prevButton = document.body.querySelector(".swiper-button-prev");

    if (width < 1024) {
      nextButton?.classList.add("swiper-button-hidden");
      prevButton?.classList.add("swiper-button-hidden");
    }

    if (width > 1024) {
      if (nextButton?.classList.contains("swiper-button-hidden")) {
        nextButton?.classList.remove("swiper-button-hidden");
      }
      if (prevButton?.classList.contains("swiper-button-hidden")) {
        prevButton?.classList.remove("swiper-button-hidden");
      }
    }
  }, [width]);
  const css = `
  .swiper {
    width: 100%;

  }
  
  .swiper-slide {
    background-position: center;
    background-size: cover;

    /* height: 300px; */
    /* margin: 20px; */
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
  }
  .swiper-button-next{
  color: black;
  right:6% !important;
  }
  .swiper-button-prev {
  color:black; 
  left:6% !important;
  }
  
  .swiper-3d .swiper-slide-shadow-left {
    background-image: none;
  }
  .swiper-3d .swiper-slide-shadow-right{
    background: none;
  }
  `;

  const slides = [
    {
      title: "Members",
      description:
        "Meet the members of our Student Council",
      blob: "/main/PinkBlob.svg",
      color: "text-rose-900",
      doodle:'/main/Members.png',
      other: (
        <Link href={"/members"}>
          <Button variant={'rose'} >
            Meet our members
          </Button>
        </Link>
      ),
    },
    {
      title: "Mission",
      description:
        "Our mission is to represent the student body and advocate for your needs and interests, provide opportunities that foster personal growth, and promote student involvement by organising events; all to build a positive environment and evoke exciting experiences, which encourages participation and uplifts school spirit for a more dynamic school life.",
      blob: "/main/BlueBlob.svg",
      color: "text-sky-900",
      doodle:'/main/Mission.png',
      other: null,
    },
    {
      title: "Vision",
      description:
        "We envision a cohesive, inclusive, and vibrant school community where all students feel valued and respected. We aim to provide a more holistic school experience that empowers students to become more responsible, equipped, and engaged. Our purpose is to catalyse positive change within the school to realise these.",
      blob: "/main/YellowBlob.svg",
      color: "text-yellow-900",
      doodle:'/main/Vision.png',
      other: null,
    },
    // {
    //   title: "Members",
    //   description:
    //     "Sunt duis dolor sunt excepteur labore nostrud nostrud laboris dolore sit minim cillum nisi nulla. Duis et excepteur mollit consectetur sint dolor nostrud enim ad laborum ea eiusmod labore sit pariatur. Veniam ex anim incididunt esse exercitation dolor eiusmod labore ea. Fugiat aute do quis officia incididunt qui in ullamco aliquip ea laboris. In et deserunt elit officia nulla.",
    //   blob: "/main/PinkBlob.svg",
    //   color: "text-rose-900",
    // },
    // {
    //   title: "Mission",
    //   description:
    //     "Sunt duis dolor sunt excepteur labore nostrud nostrud laboris dolore sit minim cillum nisi nulla. Duis et excepteur mollit consectetur sint dolor nostrud enim ad laborum ea eiusmod labore sit pariatur. Veniam ex anim incididunt esse exercitation dolor eiusmod labore ea. Fugiat aute do quis officia incididunt qui in ullamco aliquip ea laboris. In et deserunt elit officia nulla.",
    //   blob: "/main/BlueBlob.svg",
    //   color: "text-cyan-900",
    // },
    // {
    //   title: "Vision",
    //   description:
    //     "Sunt duis dolor sunt excepteur labore nostrud nostrud laboris dolore sit minim cillum nisi nulla. Duis et excepteur mollit consectetur sint dolor nostrud enim ad laborum ea eiusmod labore sit pariatur. Veniam ex anim incididunt esse exercitation dolor eiusmod labore ea. Fugiat aute do quis officia incididunt qui in ullamco aliquip ea laboris. In et deserunt elit officia nulla.",
    //   blob: "/main/YellowBlob.svg",
    //   color: "text-yellow-900",
    // },
  ];
  const clonedSlides = [...slides, ...slides];

  return (
    <section className="  mt-16 lg:mt-0 lg:h-screen relative    flex  justify-center ">
      <style>{css}</style>
      <div className=" bg-transparent w-screen  ">
        <div className="flex items-center justify-center w-full h-full">
          <Swiper
            className=""
            spaceBetween={0}
            onRealIndexChange={(swiper) => {
              // console.log(swiper.realIndex);
              setIndex(swiper.realIndex);
            }}
            // autoplay={{
            //   delay: autoplayDelay,
            //   disableOnInteraction: false,
            // }}
            effect={"coverflow"}
            initialSlide={3}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={1}
            keyboard={{
              enabled: true,
              onlyInViewport: true,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 20,
              modifier: 1.5,
              scale: 0.2,
            }}
            speed={1000}
            pagination={{
              // enabled: width < 1024 ? false : true,
              enabled: false,
              clickable: true,
            }}
            navigation={{
              enabled: true,

              // nextEl: ".swiper-button-next",
              // prevEl: ".swiper-button-prev",
            }}
            modules={[
              EffectCoverflow,
              Autoplay,
              Virtual,
              Pagination,
              Navigation,
              Keyboard,
            ]}
          >
            {clonedSlides.map((slide,index) => (
              <div className="relative  h-full w-full" key={index}>
                <SwiperSlide key={index}>
                  <motion.div className="size-full px-6 sm:px-12  flex flex-col relative justify-center items-center ">
                    <Image
                      priority
                      src={slide.blob}
                      alt="blob"
                      height={20}
                      width={20}
                      className="aspect-square h-[300px] sm:h-[480px]"
                    />

                    <Image
                    src={slide.doodle}
                    alt="doodle"
                    width={100}
                    height={100}
                    className="absolute top-1/6  sm:top-0 left-0 object-contain size-[240px] sm:size-[420px] md:size-[480px] "
                    />
                  </motion.div>
                </SwiperSlide>
              </div>
            ))}

            {/* {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="size-full rounded-3xl">
                      <Image
                        src={image.src}
                        width={500}
                        height={500}
                        className="size-full rounded-xl"
                        alt={image.alt}
                      />
                    </div>
                  </SwiperSlide>
                ))}
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="size-full rounded-3xl">
                      <Image
                        src={image.src}
                        width={200}
                        height={200}
                        className="size-full rounded-xl"
                        alt={image.alt}
                      />
                    </div>
                  </SwiperSlide>
                ))} */}
          </Swiper>
          <AnimatePresence mode="wait">
            <motion.div
              key={clonedSlides[realIndex].title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // exit={{ opacity: 0 }}
              // transition={{ duration: 1 }}
              className="space-y-3 sm:space-y-6 text-center absolute w-full sm:w-[80%] lg:w-[45%]   top-[70%] left-1/2 -translate-x-1/2 z-10 h-"
            >
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  " text-4xl sm:text-5xl lg:text-6xl",
                  clonedSlides[realIndex].color
                )}
              >
                {clonedSlides[realIndex].title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "font-normal px-6 lg:px-0 text-base ",
                  clonedSlides[realIndex].color
                )}
              >
                {clonedSlides[realIndex].description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {clonedSlides[realIndex].other}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

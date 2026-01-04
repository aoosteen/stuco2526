"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import BackgroundVideo from "next-video/background-video";
import GalleryMainVideo from "/videos/galleryMainVideo.mp4";

const Gallery = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <section className="w-screen h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        {/* <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={cn("w-full h-full object-cover brightness-50")}
        >
          <source src="/main/galleryMainVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}

        <BackgroundVideo
          autoPlay
          loop
          muted
          ref={videoRef}
          playsInline
          src={GalleryMainVideo}
          className={cn("w-full h-full object-cover brightness-50")}
        />
      </div>
      <div className="absolute top-1/2 left-1/2 z-10 -translate-1/2 flex flex-col items-center gap-2">
        <h1 className="text-7xl  text-yellow-500">Gallery</h1>
        <Link href="/gallery">
          <Button variant={"yellow"}>View our gallery</Button>
        </Link>
      </div>
    </section>
  );
};

export default Gallery;

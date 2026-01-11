import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import BackgroundVideo from "next-video/background-video";
import StucoMainVideoCompressed from "/videos/StucoMainVideoCompressed.mp4";
import { useDeviceWidth } from "@/hooks/useDeviceWidth";
import { useDeviceHeight } from "@/hooks/useDeviceHeight";

const LandingVideo = ({
  className,
  prog,
  onLoaded,
}: {
  className?: string;
  prog?: number;
  onLoaded?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const deviceWidth = useDeviceWidth();
  const deviceHeight = useDeviceHeight();
  const aspectRatio = deviceWidth / deviceHeight;

  // useEffect(() => {
  //   const videoElement = videoRef.current;
  //   if (!videoElement) return;
  //   videoElement.addEventListener('onloadstart', () => {
  //     console.log('load start')
  //   })
  //   return () => {
  //     videoElement.removeEventListener('onloadstart', () => {
  //       console.log('load start')
  //     })
  //   };
  // },[])

  useEffect(() => {
    // if (!loaded) {
    //   // if (!promiseRef.current) {
    //     promiseRef.current = new Promise<void>((resolve) => {
    //       (promiseRef.current as any).resolve = resolve;
    //     });
    //   // }
    //   throw promiseRef.current;
    // }
  }, []);

  return (
    <div className="lg:absolute ">
      {/* <video
        ref={videoRef}
        autoPlay
        loop
        muted
        onLoad={() => {
          console.log("load");
        }}
       
        onError={() => {
          console.error("There was an error when loading video");
        }}
        playsInline
        preload="auto"
        style={{
          filter: prog ? `grayscale(${(1 - prog) * 100}%)` : undefined,
        }}
        className={cn(
          "size-full object-cover aspect-video absolute rounded-md top-0 scale-105 left-0 -z-10 hidden lg:block",
          className
        )}
      >
        <source src="/main/StucoMainVideoCompressed.mp4" type="video/mp4" />
        Video not supported by browser
      </video> */}

      <BackgroundVideo
        ref={videoRef}
        src={StucoMainVideoCompressed}
        blurDataURL={StucoMainVideoCompressed.blurDataURL}
        onLoadedData={() => {
          // setMainPageLoaded(true);
          onLoaded && onLoaded();
        }}
        className={cn(
          "size-full object-cover   absolute rounded-md top-0 scale-115 left-0 -z-10 hidden lg:block",
          className
        )}
        style={{
          filter: prog ? `grayscale(${(1 - prog) * 100}%)` : undefined,
          aspectRatio: deviceWidth > 1024 ? aspectRatio.toString() : 16 / 9,
        }}
      />
    </div>
  );
};

export default LandingVideo;

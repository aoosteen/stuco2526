import { cn } from "@/lib/utils";
import React from "react";

const LandingVideo = ({
  className,
  prog,
}: {
  className?: string;
  prog?: number;
}) => {
  return (
    <div className="">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="true"
        style={{
          filter: prog ? `grayscale(${(1 - prog) * 100}%)` : undefined,
        }}
        className={cn(
          "size-full object-cover aspect-video absolute rounded-md top-0 scale-105 left-0 -z-10 hidden lg:block",
          className
        )}
      >
        <source src="/main/StucoMainVideo.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default LandingVideo;

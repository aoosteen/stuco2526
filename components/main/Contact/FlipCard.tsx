"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

type TFlipCardState = "front" | "back";
interface IFlipCardProps {
  height?: number;
  width?: number;
  children?: React.ReactNode;
  className?: string;
  autoFlip?: boolean;
  timeInterval?: number;
  onFlipChange?: (__state: TFlipCardState) => void;
  flipped?: boolean;
  orientation?: "horizontal" | "vertical";
  flipOnClick?: boolean;
}

export const FlipCard = ({
  // height = 48,
  // width = 48,
  orientation = "vertical",
  children,
  className,
  autoFlip,
  timeInterval = 2000,
  onFlipChange,
  flipped,
  flipOnClick = true
}: IFlipCardProps) => {
  const [flip, setFlip] = useState(false);

  const onFlipChangeHandler = (flip: boolean) => {
    if (onFlipChange) {
      setTimeout(() => {
        if (flip) {
          return onFlipChange("back");
        }
        return onFlipChange("front");
      }, 100);
    }
  };
  // Set up automatic flip every 5 seconds
  useEffect(() => {
    if (autoFlip) {
      const interval = setInterval(() => {
        setFlip((prev) => {
          onFlipChangeHandler(!prev);
          return !prev;
        }); // Toggle flip state
      }, timeInterval);
      // Clean up the interval on component unmount
      return () => clearInterval(interval);
    }
  }, [autoFlip]);

  useEffect(() => {
    if (flipped !== undefined) {
      setFlip(flipped);
    }
  }, [flipped]);

  return (
    <div className={cn("", className)}
    onClick={() => {
      if(flipOnClick){
        setFlip((prev) => {
          onFlipChangeHandler(!prev);
          return !prev;
        });
      }

    }}
    >
      <div className="group [perspective:3000px] w-full h-full">
        <div
          className={` relative h-full w-full   transition-all duration-1300  [transform-style:preserve-3d] ${
            flip
              ? orientation === "vertical"
                ? "[transform:rotateX(180deg)]"
                : "[transform:rotateY(180deg)]"
              : ""
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

interface IFlipCardBackFaceProps {
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
}
export const FlipCardBackFace = ({
  children,
  className,
  orientation = "vertical",
}: IFlipCardBackFaceProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full   [backface-visibility:hidden]",
        orientation === "vertical"
          ? "[transform:rotateX(180deg)]"
          : "[transform:rotateY(180deg)]",
        className
      )}
    >
      {children}
    </div>
  );
};

interface IFlipCardFrontFaceProps {
  children: React.ReactNode;
  className?: string;
}
export const FlipCardFrontFace = ({
  children,
  className,
}: IFlipCardFrontFaceProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full  [backface-visibility:hidden]",
        className
      )}
    >
      {children}
    </div>
  );
};

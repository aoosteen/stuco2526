"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Polaroid = ({
  src,
  text,
  i,
  extra,
  className,

}: {
  src?: string;
  text?: string;
  i: number;
  className?: string;
  extra?: React.ReactNode;

}) => {
  return (
    <motion.div
      className={cn(
        "aspect-square p-2 sm:p-4 space-y-4 bg-white shadow-md",
        className
      )}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        delay: i * 0.1,
        duration: 0.3,
      }}
    >
      <div className="w-full h-4/5">
        {src && (
          <Image
            src={src}
            alt="polaroid"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div>
        {text && <p className="text-center">{text}</p>}
        {extra}
      </div>
    </motion.div>
  );
};

export default Polaroid;

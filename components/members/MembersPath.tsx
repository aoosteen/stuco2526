"use client";
import { MemberType } from "@/lib/MembersActions";
import { urlFor } from "@/sanity/sanityClient";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useRef } from "react";
import Polaroid from "../gallery/Polaroid";
import {
  FlipCard,
  FlipCardFrontFace,
  FlipCardBackFace,
} from "../main/Contact/FlipCard";
import Image from "next/image";
import MembersPolaroid from "./MembersPolaroid";

interface MembersPathProps extends MemberType {
  x: number;
  y: number;
  width: number;
  height: number;
}
const MembersPath = ({
  children,
  data,
}: {
  children?: React.ReactNode;
  data: MembersPathProps[];
}) => {
  const pathRef = useRef(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const svgRef = useRef(null);
  const [pathHeight, setPathLength] = React.useState(0);
  const { scrollYProgress } = useScroll({
    target: svgRef,
    offset: ["start end", "end end"],
  });
  const transformedProgress = useTransform(scrollYProgress, [0.09, 1], [0, 1]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollProgress(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    const path = document.body.querySelector("#path") as SVGPathElement;
    if (path) {
      const pathHeight = path.getTotalLength();
      setPathLength(pathHeight);
    }
  }, []);

  const testLrPhotos = [
    {
      src: "/members/LR/lr.jpg",
      className: "",
    },
    {
      src: "/members/LR/lr1.jpg",
      className: "-rotate-6",
    },
    {
      src: "/members/LR/lr2.jpg",
      className: "rotate-6",
    },
    {
      src: "/members/LR/lr3.jpg",
      className: "-rotate-3",
    },
  ];

  const testMajPosPhotos = [
    {
      src: "/members/majpos/majpos.jpg",
      className: "-rotate-10",
    },
    {
      src: "/members/majpos/majpos4.jpg",
      className: "-rotate-6",
    },
    {
      src: "/members/majpos/majpos2.jpg",
      className: "rotate-8",
    },
    {
      src: "/members/majpos/majpos3.jpg",
      className: "-rotate-3",
    },
  ];
  return (
    <>
      <span ref={svgRef} className="w-screen  block relative">
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 1364 4304"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={"z-2"}
        >
          <motion.path
            height={"100%"}
            width={"100%"}
            id="path"
            ref={pathRef}
            d="M1 1C855.5 75 1103 232.5 1151.5 502.5C1200 772.5 1196.05 1133.91 923 1383C649.952 1632.09 378.945 1451.61 193.5 1701C83.1686 1849.37 53 2011 36 2147.5C19 2284 2.8065 2421.5 36 2487.5C69.1935 2553.5 187.901 2672.6 257 2596C293.986 2555 329.973 2521 317 2487.5C304.027 2454 248.7 2388.97 180.5 2389.5C99.6875 2390.13 52.2921 2560.94 66.5 2640.5C81.6993 2725.61 190.136 2715.07 226.5 2793.5C286.685 2923.31 85.5279 3023.01 148.5 3151.5C191.339 3238.91 256.764 3261.91 342.5 3308C524.023 3405.59 785.198 3260.15 875 3346C875 3346 923.63 3442.79 891.5 3475C859.37 3507.21 793.648 3516.5 775 3475C762.786 3447.82 771.845 3422.9 791.5 3400.5C827.014 3360.03 887.093 3391.81 926.5 3428.5C970 3469 987.5 3495.5 995 3543.5C1017.62 3688.27 950.65 3778.64 856 3890.5C735.144 4033.33 91.5 4133.5 91.5 4133.5"
            stroke="black"
            strokeLinecap="round"
            strokeWidth={10}
            strokeDasharray={"0 1"}
            animate={{
              pathLength: transformedProgress.get(),
            }}
            initial={{ pathLength: 0 }}
          />
          <foreignObject x={0} y={400} width={550} height={250}>
            <h1 className="text-9xl">Major Positions</h1>
          </foreignObject>
          <foreignObject x={400} y={2000} width={900} height={300}>
            <h1 className="text-9xl">Level Representatives</h1>
          </foreignObject>

          <foreignObject x={50} y={620} width={1250} height={1050}>
            {testMajPosPhotos.map((photo, index) => (
              <div
                key={index}
                className={`absolute hover:-translate-y-10 transition-all translate-8 scale-80  bg-white p-2 shadow-lg ${photo.className}`}
                style={{
                  left: `${index * 80}px`,
                  top: `${index *30}px`,
                  zIndex: testMajPosPhotos.length - index,
                }}
              >
                <Image
                width={200}
                height={200}
                  src={photo.src}
                  alt={`Major Position ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </foreignObject>

          {data.map((member, index) => (
            <foreignObject
              key={member._id}
              x={member.x}
              y={member.y}
              width={member.width}
              height={member.height}
              className=""
            >
              <MembersPolaroid member={member} index={index} 
              polaroidClassName="hover:animate-[twitch_1.5s]"
              />
            </foreignObject>
          ))}
        </motion.svg>
      </span>
    </>
  );
};


export default MembersPath;

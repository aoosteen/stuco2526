"use client";
import { extendedMembers, MemberType } from "@/lib/MembersActions";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import MembersPolaroid from "./MembersPolaroid";
import { groupPhotoType } from "@/lib/groupPhotoActions";
import { urlFor } from "@/sanity/sanityClient";

const MembersPath = ({
  children,
  membersData,
  LRData,
  MajPosData,
  groupData,
}: {
  children?: React.ReactNode;
  membersData: extendedMembers[];
  LRData: groupPhotoType[];
  MajPosData: groupPhotoType[];
  groupData: groupPhotoType[];
}) => {
  const pathRef = useRef(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const svgRef = useRef(null);
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
          {/* majpos photos */}
          <foreignObject x={0} y={650} width={1250} height={1050}>
            <div className="grid grid-cols-3 w-fit -space-y-38">
              {MajPosData.map((photo, index) => (
                <div
                  key={index}
                  className={`hover:animate-[twitch_1.5s] aspect-[5.6/8.6] transition-all translate-8 scale-80 w-fit h-fit bg-white p-2 shadow-lg ${photo.className}`}
                  // style={{
                  //   left: `${120 * (index % 4 ) }px`,
                  //   top: `${index *30 * (index / 4 + 1)}px`,
                  //   zIndex: MajPosData.length - index,
                  // }}
                >
                  <Image
                    width={200}
                    height={200}
                    src={urlFor(photo.image).url()}
                    alt={`Major Position ${index + 1}`}
                    className="w-full h-full object-cover max-h-80 max-w-60"
                  />
                </div>
              ))}
            </div>
          </foreignObject>
          {/* lr photos */}
          <foreignObject
            x={500}
            y={2250}
            width={1250}
            height={1050}
            className="flex flex-col"
          >
            {LRData.map((photo, index) => (
              <div
                key={index}
                className={`absolute hover:animate-[twitch_1.5s]  transition-all w-fit max-w-80  translate-8 scale-80  bg-white p-2 shadow-lg ${photo.className}`}
                style={{
                  left: `${(index < 5 ? index : index - 5) * 115}px`,
                  top: `${index * 8}%`,
                  zIndex: MajPosData.length - index,
                }}
              >
                <Image
                  width={200}
                  height={200}
                  src={urlFor(photo.image).url()}
                  alt={`Level Representative photos ${index + 1}`}
                  className="w-full h-full object-cover max-h-100 max-w-80 aspect-[5.6/8.6]"
                />
              </div>
            ))}
          </foreignObject>
          {/* group photos */}
          <foreignObject x={675} y={1600} width={1250} height={1050}>
            {groupData.slice(0,4).map((photo, index) => (
              <div
                key={index}
                className={`absolute hover:animate-[twitch_1.5s] aspect-[5.6/8.6] transition-all  translate-8 scale-80  bg-white p-2 shadow-lg ${photo.className}`}
                style={{
                  left: `${index * 90}px`,
                  top: `${index * 30}px`,
                  zIndex: groupData.length - index,
                }}
              >
                <Image
                  width={200}
                  height={200}
                  src={urlFor(photo.image).url()}
                  alt={`Group photo ${index + 1}`}
                  className="w-full h-full object-cover  "
                />
              </div>
            ))}
          </foreignObject>
          {/* main polaroids */}
          {membersData.map((member, index) => (
            <foreignObject
              key={member._id}
              x={member.x}
              y={member.y}
              width={member.width}
              height={member.height}
              className=""
            >
              <MembersPolaroid
                member={member}
                index={index}
                polaroidClassName="hover:animate-[twitch_1.5s] z-100"
              />
            </foreignObject>
          ))}
        </motion.svg>
      </span>
    </>
  );
};

export default MembersPath;

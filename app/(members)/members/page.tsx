import MembersPath from "@/components/members/MembersPath";
import MembersPolaroid from "@/components/members/MembersPolaroid";
import { getMembers } from "@/lib/MembersActions";
import Image from "next/image";
import React from "react";

const page = async () => {
  const positionOrder = [
    "StuCo Advisor",
    "President",
    "Vice-President",
    "SecGen",
    "FILO",
    "PRO",
    "JC2 Representative",
    "JC1 Representative",
    "Sec 4 Representative",
    "Sec 3 Representative",
    "Sec 2 Representative",
    "Sec 1 Representative",
  ];

  const data = await getMembers();

  const sortedData = [...data].sort((a, b) => {
    // Extract year from representative positions if present
    const getYearValue = (position: string) => {
      if (position.includes("JC")) {
        return parseInt(position.match(/\d+/)?.[0] ?? "0") + 10; // Add 10 to put JC above Sec
      }
      if (position.includes("Sec")) {
        return parseInt(position.match(/\d+/)?.[0] ?? "0");
      }
      return 0;
    };

    // Get base position without year
    const baseA = a.position.replace(/[0-9]/g, "").trim();
    const baseB = b.position.replace(/[0-9]/g, "").trim();

    // If both are representatives, sort by year (descending)
    if (baseA.includes("Representative") && baseB.includes("Representative")) {
      return getYearValue(b.position) - getYearValue(a.position);
    }

    // Otherwise use the position order array
    const posA = positionOrder.indexOf(a.position);
    const posB = positionOrder.indexOf(b.position);

    if (posA === -1) return 1;
    if (posB === -1) return -1;

    return posA - posB;
  });

  const positionKeys = [
    "StuCo Advisor",
    "President",
    "Vice-President",
    "SecGen",
    "FILO",
    "PRO",
    "JC2 Level Representative",
    "JC1 Level Representative",
    "Sec 4 Level Representative",
    "Sec 3 Level Representative",
    "Sec 2 Level Representative",
    "Sec 1 Level Representative",
  ] as const;

  type PositionKey = (typeof positionKeys)[number];

  const positionCoordinates: Record<PositionKey, { x: number; y: number }> = {
    "StuCo Advisor": { x: 10, y: 0 },
    President: { x: 700, y: 50 },
    "Vice-President": { x: 1000, y: 550 },
    SecGen: { x: 950, y: 1000 },
    FILO: { x: 550, y: 1300 },
    PRO: { x: 100, y: 1500 },
    "JC2 Level Representative": { x: 0, y: 2000 },
    "JC1 Level Representative": { x: 100, y: 2800 },
    "Sec 4 Level Representative": { x: 100, y: 3200 },
    "Sec 3 Level Representative": { x: 800, y: 3550 },
    "Sec 2 Level Representative": { x: 450, y: 3800 },
    "Sec 1 Level Representative": { x: 0, y: 3950 },
  };

  const extendedData = sortedData.map((member) => ({
    ...member,
    x: positionCoordinates[member.position as PositionKey]?.x ?? 0,
    y: positionCoordinates[member.position as PositionKey]?.y ?? 0,
    width: 300,
    height: 400,
  }));

  return (
    <div
      className="  h-fit overflow-hidden  
    "
    >
      <div className="relative  shrink-0  flex flex-col justify-center px-16 
      bg-[url(../public/members/MembersBanner.webp)] h-[55vh]  bg-repeat-round bg-cover">
        <div className="z-10 flex flex-col gap-4 items-center">
          <h1 className="text-5xl text-white">Members</h1>
          <p className="text-white text-center">
            Meet our officers! Who do you resonate with most? 🤔
          </p>
        </div>
      </div>

      <section className=" h-full  justify-center mt-16 px-8 items-start hidden md:flex">
        <MembersPath data={extendedData} />
      </section>
      <section className="grid  md:hidden grid-cols-1 sm:grid-cols-2  gap-4 p-4 justify-items-center ">
        {extendedData.map((member, i) => (
          <MembersPolaroid
            key={member._id}
            member={member}
            index={i}
            polaroidClassName="w-70 h-70"
            backClassName="h-70 w-70"
          />
        ))}
      </section>
    </div>
  );
};

export default page;

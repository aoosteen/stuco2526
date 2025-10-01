import MembersPath from "@/components/members/MembersPath";
import MembersPolaroid from "@/components/members/MembersPolaroid";
import { getGroupPhotos, getLRPhotos, getMajPosPhotos } from "@/lib/groupPhotoActions";
import { getMembers } from "@/lib/MembersActions";
import Image from "next/image";
import React from "react";

const page = async () => {

  const membersData =  getMembers();
  const LRData = getLRPhotos();
  const MajPosData = getMajPosPhotos()
  const groupData = getGroupPhotos()

  const data = await Promise.all([membersData,LRData,MajPosData,groupData])
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
        <MembersPath membersData={data[0]} LRData={data[1]} MajPosData={data[2]} groupData={data[3]}/>
      </section>
      <section className="grid  md:hidden grid-cols-1 sm:grid-cols-2  gap-4 p-4 justify-items-center ">
        {data[0].map((member, i) => (
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

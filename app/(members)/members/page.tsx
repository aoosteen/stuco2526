import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="bg-[var(--main-bg)] w-screen h-full overflow-hidden">
      <div className="relative w-screen shrink-0 h-[55vh] flex flex-col justify-center px-16">
        <div className="z-10 flex flex-col gap-4 items-center">
          <h1 className="text-5xl text-white">Members</h1>
          <p className="text-white text-center">
            Meet our officers! Who do you resonate with most? 🤔
          </p>
        </div>
        <Image
          priority
          src={"/members/MembersBanner.png"}
          alt="red banner"
          width={1000}
          height={1000}
          className="w-full object-cover  absolute top-0 left-0 h-full"
        />
      </div>

      <section className="w-screen   ">
        <div className=" w-screen ">
          <div className="relative h-full w-full">
            <Image
              src="/members/BulletinBoard.png"
              alt="Bulletin Board"
              width={600}
              height={600}
              className="w-full object-contain   "
            />
          </div>
        </div>
        <div className=" w-screen ">
          <div className="relative h-full w-full">
            <Image
              src="/members/BulletinBoard.png"
              alt="Bulletin Board"
              width={600}
              height={600}
              className="w-full object-contain   "
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;

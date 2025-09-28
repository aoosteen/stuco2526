"use client";
import React, { useState, useTransition } from "react";
import {
  FlipCard,
  FlipCardBackFace,
  FlipCardFrontFace,
} from "./Contact/FlipCard";
import { Button } from "../ui/button";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { X } from "lucide-react";
import { updateSheets } from "@/lib/submitMessage";
import Link from "next/link";

const ContactCard = () => {
  const [flip, setFlip] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const updateSheetsHandler = async () => {
    startTransition(async () => {
      await updateSheets(message);
      setMessage("");
      setFlip(!flip);
    });
  };

  const contactInfos = [
    {
      name: "Instagram",
      handle: "@jnystudentcouncil",
      link: "https://www.instagram.com/jnystudentcouncil",
      icon: "/main/ContactInstagram.svg",
    },
    {
      name: "YouTube",
      handle: "@studentcouncil_jny",
      link: "https://www.youtube.com/@jnystudentcouncil",    
      icon: "/main/ContactYoutube.svg",
    },{
      name: "TikTok",
      handle: "@CouncilJNYStudent",
      link: "https://www.tiktok.com/@jnystudentcouncil",
      icon: "/main/ContactTiktok.svg",
    }
  ]
  return (
    <div className="w-screen h-[90vh]  md:px-12  md:py-20">
      <div className="w-full h-full">
        <FlipCard flipped={flip} className="w-full h-full shadow-sm" flipOnClick={false}>
          <FlipCardFrontFace>
            <div
              className="relative  w-full h-full"
              // onClick={() => setFlip(!flip)}
            >
              <Image
                priority
                src={"/main/StucoContactCard.png"}
                alt="Stuco Contact Card"
                fill
                className=" w-full h-full "
              />
              <div className="absolute top-0 left-0 p-8 sm:p-16 lg:grid lg:grid-cols-2 flex flex-col gap-16 h-full">
                <div className="flex flex-col space-y-8 justify-center h-full">
                  <Image
                    src={"/main/Stamp.png"}
                    alt="Stamp"
                    width={100}
                    height={300}
                    className="object-cover   scale-150"
                  />
                  <h1 className="text-yellow-900 text-6xl">Contact Us</h1>
                  <p className="text-yellow-900 ">
                    Mail your thoughts to us through this anonymous suggestion
                    box! Whether about an impactful idea or a minor tweak, event
                    suggestions or short messages, a question or concern; we
                    want to hear from you.
                  </p>
                  <Button
                    variant={"yellow"}
                    className="w-fit xl:mt-8"
                    onClick={() => setFlip(!flip)}
                  >
                    Leave a message...
                  </Button>
                </div>
                <div className=" border-l-4 border-yellow-900/30 pl-24 hidden lg:block">
                  <div className="flex flex-col gap-16 justify-center h-full ">
                    {contactInfos.map((info) => (
                      <div key={info.name} className="flex gap-4 items-center border-b-4 border-yellow-900/30 pb-4">
                        <Image
                          src={info.icon}
                          alt={info.name}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                        <Link
                          href={info.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <p className="text-2xl text-yellow-900 hover:underline ">
                            {info.handle}
                          </p>
                        </Link>
                      </div>
                    ))} 
                  </div>
                </div>
              </div>
            </div>
          </FlipCardFrontFace>
          <FlipCardBackFace>
            <div className="relative w-full h-full">
              <X
                size={24}
                className="absolute top-8 right-8 z-2 cursor-pointer"
                onClick={() => setFlip(!flip)}
              />
              <Image
                priority
                src={"/main/StucoContactCard.png"}
                alt="Stuco Contact Card"
                fill
                className="object-fixed w-full h-full "
              />
              <div className="absolute top-0 left-0 p-8 sm:p-16   flex flex-col gap-8 h-full">
                <h1 className="text-4xl md:text-6xl text-yellow-900">
                  Leave a message
                </h1>
                <div className="w-full h-full relative">
                  <Image
                    src={"/main/ContactTextArea.png"}
                    alt="textarea border"
                    width={500}
                    height={500}
                    className="object-fixed w-full h-full pb-32"
                  />
                  <form action={updateSheetsHandler}>
                    <Button
                      className="absolute bottom-16 w-fit"
                      variant={"yellow"}
                      type="submit"
                      disabled={message === "" || isPending}
                    >
                      {isPending ? "Submitting..." : "Submit"}
                    </Button>{" "}
                  </form>
                  <div className="absolute top-0 left-0 w-full max-w-full  py-8 px-4 sm:px-8 ">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="outline-none h-full placeholder:text-xl md:text-xl "
                    />
                  </div>
                </div>
              </div>
            </div>
          </FlipCardBackFace>
        </FlipCard>
      </div>
    </div>
  );
};

export default ContactCard;

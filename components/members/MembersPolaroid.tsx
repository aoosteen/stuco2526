"use client";

import { MemberType } from "@/lib/MembersActions";
import { urlFor } from "@/sanity/sanityClient";
import { useInView, motion } from "framer-motion";
import { useRef } from "react";
import Polaroid from "../gallery/Polaroid";
import {
  FlipCard,
  FlipCardFrontFace,
  FlipCardBackFace,
} from "../main/Contact/FlipCard";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

const MembersPolaroid = ({
  member,
  index,
  polaroidClassName,
  backClassName,
}: {
  member: MemberType;
  index: number;
  polaroidClassName?: string;
  backClassName?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div>
      <FlipCard orientation="horizontal" className="">
        <FlipCardFrontFace>
          <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
          >
            <Polaroid
              src={member.image ? urlFor(member.image).url() : undefined}
              i={index}
              text={member.name}
              className={cn("max-w-80 h-fit", polaroidClassName)}
              extra={<p className="text-sm! text-center">{member.position}</p>}
            />
          </motion.div>
        </FlipCardFrontFace>
        <FlipCardBackFace className="relative rotate-180">
          <div
            className={cn(
              "bg-white relative  p-2 sm:p-4 max-h-70 aspect-square",
              backClassName
            )}
          >
            <p className="line-clamp-5 ">{member.description}</p>
            {member.events?.length > 0 && <p className="mt-2">Events:</p>}
            <ul>
              {member.events &&
                member.events.length > 0 &&
                member.events.slice(0, 3).map((event, idx) => (
                  <li
                    key={idx}
                    className="text-sm list-disc ml-4 "
                  >
                    <p className="list-disc line-clamp-1">{event}</p>
                  </li>
                ))}
            </ul>
            {member.events?.length > 4 && (
              <HoverCard openDelay={200} closeDelay={100} >
                <HoverCardTrigger className="" asChild>
                  <p className="text-sm  italic hover:underline w-fit">and more...</p>
                </HoverCardTrigger>
                <HoverCardContent className="w-48" align="start"  hideWhenDetached >
                  <ul className="list-disc">
                    {member.events &&
                      member.events.length > 0 &&
                      member.events.filter((e,i) => i > 2).map((event, idx) => (
                        <li
                          key={idx}
                          className="text-sm list-disc ml-4  "
                        >
                          <p className="list-disc">{event}</p>
                        </li>
                      ))}
                  </ul>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        </FlipCardBackFace>
      </FlipCard>
    </div>
  );
};

export default MembersPolaroid;

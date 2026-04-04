import React from "react";
import { createPortal } from "react-dom";
import { motion, MotionValue } from "motion/react";
import { memberAnchorIdFromPosition } from "../lib/memberAnchor";

interface MinimalMember {
  position: string;
  role?: string;
  grade?: string;
}

interface MembersTimelineProps {
  isMounted: boolean;
  progressCanShow: boolean;
  progressOpacity: MotionValue<number>;
  allMembers: MinimalMember[];
  activeId: string | null;
  activeIndex: number;
  isDarkSection: boolean;
  onMemberClick: (id: string) => void;
}

export function MembersTimeline({
  isMounted,
  progressCanShow,
  progressOpacity,
  allMembers,
  activeId,
  activeIndex,
  isDarkSection,
  onMemberClick,
}: MembersTimelineProps) {
  if (!isMounted || typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      animate={{ opacity: progressCanShow ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed left-8 top-1/2 -translate-y-1/2 z-[1150] hidden xl:flex flex-col pointer-events-none"
    >
      <motion.div
        style={{ opacity: progressOpacity }}
        className="pointer-events-auto group/toc hover:opacity-100 opacity-60 transition-all duration-500"
      >
        <div
          className={`font-sans text-[10px] font-bold mb-4 uppercase tracking-widest pl-6 -ml-[2px] whitespace-nowrap transition-colors duration-500 ${isDarkSection ? "text-[#b8e6fe]/50" : "text-accent-darkblue/50"}`}
        >
          Directory
        </div>
        <div className="relative flex flex-col gap-0 z-0">
          {/* Background Track */}
          <div
            className={`absolute left-[7px] top-[14px] bottom-[14px] w-[2px] -z-10 transition-colors duration-500 ${isDarkSection ? "bg-[#b8e6fe]/20" : "bg-black/10"}`}
          />

          {/* Highlighted Progress Track */}
          <div className="absolute left-[7px] top-[14px] bottom-[14px] w-[2px] -z-10">
            <motion.div
              animate={{
                scaleY: Math.max(0, activeIndex / Math.max(1, allMembers.length - 1)),
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className={`absolute inset-0 origin-top transition-colors duration-500 ${isDarkSection ? "bg-[#b8e6fe]" : "bg-accent-darkblue"}`}
            />
          </div>

          {allMembers.map((member) => {
            const id = memberAnchorIdFromPosition(member.position);
            const isActive = activeId === id;
            const label = member.role || member.grade || member.position;
            let shortLabel = label;
            if (shortLabel.includes("Level Representative"))
              shortLabel = shortLabel.replace("Level Representative", "Rep");
            if (shortLabel.includes("Secretary General")) shortLabel = "SecGen";
            if (shortLabel.includes("Finance")) shortLabel = "FILO";
            if (shortLabel.includes("Public Relations")) shortLabel = "PRO";
            if (shortLabel.includes("StuCo Advisor")) shortLabel = "Advisor";

            // Determine colors based on section
            const activeBorderColor = isDarkSection ? "border-[#b8e6fe]" : "border-accent-darkblue";
            const activeBgColor = isDarkSection ? "bg-[#b8e6fe]" : "bg-accent-darkblue";
            const inactiveBorderColor = isDarkSection ? "border-[#b8e6fe]/30" : "border-black/20";

            const dotHoleColor = isDarkSection ? "bg-[#1a1a1a]" : "bg-paper";
            const dotHoverColor = isDarkSection ? "group-hover:bg-[#b8e6fe]/30" : "group-hover:bg-black/10";

            const activeTextColor = isDarkSection ? "text-[#b8e6fe]" : "text-accent-darkblue";
            const inactiveTextColor = isDarkSection
              ? "text-[#b8e6fe]/50 group-hover:text-[#b8e6fe]/80"
              : "text-black/40 group-hover:text-black/70";

            return (
              <button
                key={id}
                onClick={() => onMemberClick(id)}
                className="flex items-center gap-[14px] py-2 text-left transition-all duration-300 group cursor-pointer"

              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center relative z-10 transition-colors duration-300 ${isActive ? `${activeBorderColor} ${activeBgColor}` : `${inactiveBorderColor} ${dotHoleColor}`}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${isActive ? dotHoleColor : `bg-transparent ${dotHoverColor}`} transition-colors duration-300`}
                  />
                </div>
                <span
                  className={`font-serif text-[11px] uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${isActive ? `${activeTextColor} opacity-100 font-bold` : `${inactiveTextColor}`}`}
                >
                  {shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

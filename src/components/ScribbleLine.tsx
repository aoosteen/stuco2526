import React from "react";
import { motion } from "motion/react";

interface ScribbleLineProps {
  className?: string;
  enabled?: boolean;
}

export const ScribbleLine = ({ className, enabled = true }: ScribbleLineProps) => (
  <svg
    className={className}
    viewBox="0 0 100 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M0 10C20 5 40 15 60 10C80 5 100 15 120 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={enabled ? { pathLength: 0 } : false}
      whileInView={enabled ? { pathLength: 1 } : undefined}
      transition={enabled ? { duration: 1.5, ease: "easeInOut" } : { duration: 0 }}
    />
  </svg>
);

import React from "react";
import { motion } from "motion/react";

interface EyebrowProps {
  text: string;
  color?: string;
  className?: string;
  delay?: number;
}

export const Eyebrow: React.FC<EyebrowProps> = ({
  text,
  color = "text-black/40",
  className = "",
  delay = 0,
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: delay,
      }}
      className={`font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] font-black mb-4 block ${color} ${className}`}
    >
      {text}
    </motion.span>
  );
};

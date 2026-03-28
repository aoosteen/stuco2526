import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { cn } from '../../lib/utils';

export const WordReveal = ({ text, className }: { text: string, className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 50%"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, mass: 0.5 });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("flex flex-wrap gap-x-3 gap-y-2", className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        const opacity = useTransform(smoothProgress, [start, end], [0.1, 1]);
        
        return (
          <motion.span key={i} style={{ opacity }} className="inline-block">
            {word}
          </motion.span>
        );
      })}
    </p>
  );
};

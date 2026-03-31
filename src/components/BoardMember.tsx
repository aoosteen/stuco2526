import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { urlFor } from '../lib/sanity';
import { useDeviceDimensions } from '../hooks/useDeviceDimensions';

interface BoardMemberProps {
  member: { position: string; name: string; image?: any };
  index: number;
}

export const BoardMember = ({ member, index }: BoardMemberProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track when this specific row is in the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"] 
  });

  // Smooth the progress so it doesn't jitter during fast scrolling
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.5 });

  // Map the scroll progress to animation values
  // 0 = entering from bottom, 0.5 = center of screen, 1 = leaving at top
  const xOffset = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0, 30, 30, 0]);
  const textOpacity = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0.3, 1, 1, 0.3]);
  
  const imgOpacity = useTransform(smoothProgress, [0.3, 0.45, 0.55, 0.7], [0, 1, 1, 0]);
  const imgScale = useTransform(smoothProgress, [0.3, 0.45, 0.55, 0.7], [0.8, 1.05, 1.05, 0.8]);
  // Alternate rotation direction based on index for a more organic feel
  const imgRotate = useTransform(
    smoothProgress, 
    [0.3, 0.45, 0.55, 0.7], 
    [-15, index % 2 === 0 ? 6 : -6, index % 2 === 0 ? 6 : -6, 15]
  );

  const {width} = useDeviceDimensions()


  return (
    <motion.div 
      ref={ref}
      className="border-b-2 border-black py-8 md:py-12 flex flex-col lg:flex-row justify-between items-start lg:items-center relative cursor-pointer hover-trigger group/board"
    >
      <motion.span 
        style={{ x: width < 480 ? 0 : xOffset }}
        className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold"
      >
        {member.position}
      </motion.span>
      <motion.span 
        style={{ opacity: textOpacity }}
        className="font-sans text-md sm:text-xl md:text-2xl mt-2 md:mt-0"
      >
        {member.name}
      </motion.span>
      
      {/* Scroll-based Image Reveal (Desktop only) */}
      <motion.div 
        style={{
          opacity: imgOpacity,
          scale: imgScale,
          rotate: imgRotate
        }}
        className="absolute right-0 sm:right-[20%] top-1/2 -translate-y-1/2 w-48  pointer-events-none z-30"
      >
        <div className="bg-white p-4 shadow-2xl transition-transform duration-500 group-hover/board:scale-105 scale-50 sm:scale-100">
          <img 
            src={member.image ? urlFor(member.image).url() : `https://i.pravatar.cc/400?img=${index + 10}`} 
            alt={member.name} 
            className="w-full aspect-square object-cover " 
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

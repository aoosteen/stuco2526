import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, animate, transform } from 'motion/react';
import { urlFor } from '../lib/sanity';
import { useDeviceDimensions } from '../hooks/useDeviceDimensions';
import { PageTransitionLink } from './PageTransitionLink';
import { memberAnchorIdFromPosition } from '../lib/memberAnchor';

interface BoardMemberProps {
  member: { position: string; name: string; image?: any };
  index: number;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHover: () => void;
  onUnhover: () => void;
}

export const BoardMemberRow = ({ member, index, isHovered, isAnyHovered, onHover, onUnhover }: BoardMemberProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const hoverProgress = useMotionValue(0);
  const anyHoveredProgress = useMotionValue(0);
  
  // Sync props to motion values for smooth transitions
  useEffect(() => {
    animate(hoverProgress, isHovered ? 1 : 0, { duration: 0.3, ease: "easeOut" });
  }, [isHovered, hoverProgress]);

  useEffect(() => {
    animate(anyHoveredProgress, isAnyHovered ? 1 : 0, { duration: 0.3, ease: "easeOut" });
  }, [isAnyHovered, anyHoveredProgress]);

  // Track when this specific row is in the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"] 
  });

  // Smooth the progress so it doesn't jitter during fast scrolling
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.5 });

  // Map the scroll progress to animation values, combined with hover state
  // Formula: h * active + (1 - h) * (anyH * inactive + (1 - anyH) * scrollBase)
  
  const xOffset = useTransform([smoothProgress, hoverProgress, anyHoveredProgress], ([p, h, anyH]) => {
    const scrollBase = transform(p as number, [0, 0.4, 0.6, 1], [0, 30, 30, 0]);
    const active = 30;
    const inactive = 0;
    
    return (h as number) * active + (1 - (h as number)) * ((anyH as number) * inactive + (1 - (anyH as number)) * scrollBase);
  });

  const textOpacity = useTransform([smoothProgress, hoverProgress, anyHoveredProgress], ([p, h, anyH]) => {
    const scrollBase = transform(p as number, [0, 0.4, 0.6, 1], [0.3, 1, 1, 0.3]);
    const active = 1;
    const inactive = 0.3;
    
    return (h as number) * active + (1 - (h as number)) * ((anyH as number) * inactive + (1 - (anyH as number)) * scrollBase);
  });
  
  const imgOpacity = useTransform([smoothProgress, hoverProgress, anyHoveredProgress], ([p, h, anyH]) => {
    const scrollBase = transform(p as number, [0.3, 0.45, 0.55, 0.7], [0, 1, 1, 0]);
    const active = 1;
    const inactive = 0;
    
    return (h as number) * active + (1 - (h as number)) * ((anyH as number) * inactive + (1 - (anyH as number)) * scrollBase);
  });

  const imgScale = useTransform([smoothProgress, hoverProgress, anyHoveredProgress], ([p, h, anyH]) => {
    const scrollBase = transform(p as number, [0.3, 0.45, 0.55, 0.7], [0.8, 1.05, 1.05, 0.8]);
    const active = 1.05;
    const inactive = 0.8;
    
    return (h as number) * active + (1 - (h as number)) * ((anyH as number) * inactive + (1 - (anyH as number)) * scrollBase);
  });

  const imgRotate = useTransform([smoothProgress, hoverProgress, anyHoveredProgress], ([p, h, anyH]) => {
    const target = index % 2 === 0 ? 6 : -6;
    const scrollBase = transform(p as number, [0.3, 0.45, 0.55, 0.7], [-15, target, target, 15]);
    const inactive = 15; // Or whatever looks best when "not active"
    
    return (h as number) * target + (1 - (h as number)) * ((anyH as number) * inactive + (1 - (anyH as number)) * scrollBase);
  });

  const {width} = useDeviceDimensions()

  const memberAnchorId = memberAnchorIdFromPosition(member.position);

  return (
    <PageTransitionLink to={`/members#${encodeURIComponent(memberAnchorId)}`} className="block">
      <motion.div 
        ref={ref}
        onHoverStart={onHover}
        onHoverEnd={onUnhover}
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
          <div className="bg-white p-4 shadow-2xl transition-transform duration-500 group-hover/board:scale-55 sm:group-hover/board:scale-105 scale-50 sm:scale-100">
            <img 
              src={member.image ? urlFor(member.image).url() : `https://i.pravatar.cc/400?img=${index + 10}`} 
              alt={member.name} 
              className="w-full aspect-square object-cover " 
            />
          </div>
        </motion.div>
      </motion.div>
    </PageTransitionLink>
  );
};

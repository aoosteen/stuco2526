import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Tape } from './Tape';
import { cn } from '../lib/utils';

export const Polaroid = ({ 
  src, 
  alt, 
  caption, 
  captionClassname, 
  className, 
  rotation = 0, 
  delay = 0, 
  onImageClick 
}: { 
  src: string, 
  alt: string, 
  caption?: string, 
  captionClassname?:string, 
  className?: string, 
  rotation?: number, 
  delay?: number,
  onImageClick?: (data: { src: string, alt: string }) => void
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleClick = (e: React.MouseEvent) => {
    if (onImageClick) {
      e.preventDefault();
      e.stopPropagation();
      onImageClick({ src, alt });
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotate: rotation - 10 }}
      animate={isInView ? { opacity: 1, y: 0, rotate: rotation } : {}}
      whileHover={{ scale: 1.02, rotate: 0, zIndex: 20 }}
      transition={{ duration: 0.8, delay, type: "spring", bounce: 0.4 }}
      className={cn("polaroid inline-block", className)}
    >
      <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 font-hand" rotation={rotation > 0 ? -4 : 4} />
      <div 
        className={cn(
          "relative overflow-hidden bg-gray-100 aspect-4/5 w-full border-2 border-black",
          onImageClick && "cursor-zoom-in"
        )}
        onClick={handleClick}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover transition-all duration-700" referrerPolicy="no-referrer" />
      </div>
      {caption && (
        <p className={cn("font-hand text-2xl mt-4 text-center text-gray-800", captionClassname)}>{caption}</p>
      )}
    </motion.div>
  );
};

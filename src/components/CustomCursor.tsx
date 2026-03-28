import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<string | null>(null);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Disable custom cursor if hovering over nav, menu, or interactive elements
      const isOverNav = target.closest('nav') || target.closest('.menu-container');
      const isOverInteractive = target.closest('form') || target.closest('button') || target.closest('input') || target.closest('textarea') || target.closest('a') || target.closest('.hover-trigger');
      const isMenuOpen = document.body.style.overflow === 'hidden';
      
      if (isOverNav || isOverInteractive || isMenuOpen) {
        setCursorType(null);
        return;
      }

      const cursorElement = target.closest('[data-cursor]');
      
      if (cursorElement) {
        setCursorType(cursorElement.getAttribute('data-cursor'));
      } else {
        setCursorType(null);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{ type: 'spring', stiffness: 1000, damping: 50, mass: 0.1 }}
    >
      <AnimatePresence mode="wait">
        {cursorType === 'view' && (
          <motion.div
            key="view"
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 45 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#FFC21A] rounded-full flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] mix-blend-normal"
          >
            <span className="font-sans font-black uppercase tracking-widest text-xs text-black">View</span>
          </motion.div>
        )}
        
        {cursorType === 'read' && (
          <motion.div
            key="read"
            initial={{ opacity: 0, scale: 0, rotate: 45 }}
            animate={{ opacity: 1, scale: 1, rotate: -10 }}
            exit={{ opacity: 0, scale: 0, rotate: -45 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#b8e6fe] rounded-full flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] mix-blend-normal"
          >
            <span className="font-sans font-black uppercase tracking-widest text-xs text-black">Read</span>
          </motion.div>
        )}

        {cursorType === 'drag' && (
          <motion.div
            key="drag"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#ffbd9b] rounded-full flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] mix-blend-normal"
          >
            <span className="font-sans font-black uppercase tracking-widest text-xs text-black">Drag</span>
          </motion.div>
        )}

        {cursorType === 'magic' && (
          <motion.div
            key="magic"
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 90 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-5xl text-[#FF1493] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          >
            ★
          </motion.div>
        )}

        {cursorType === 'hello' && (
          <motion.div
            key="hello"
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: -5
            }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-[#8b0836] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]"
          >
            <svg width="45" height="45" viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuOverlay = ({ isOpen, onClose }: MenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ clipPath: 'circle(0% at 100% 0)' }}
          animate={{ clipPath: 'circle(150% at 100% 0)' }}
          exit={{ clipPath: 'circle(0% at 100% 0)' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 bg-[#8b0836] z-40 flex flex-col justify-center px-10 md:px-32 text-[#ffffff]"
        >
          <div className="hidden" />
          <ul className="text-5xl md:text-8xl font-serif font-bold tracking-tighter flex flex-col gap-4 md:gap-8">
            {['Home', 'About', 'Initiatives', 'Team', 'Contact'].map((item, i) => (
              <motion.li 
                key={item}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="hover-trigger w-fit"
              >
                <a 
                  href={`#${item.toLowerCase()}`} 
                  onClick={onClose} 
                  className="hover:text-outline-white hover:text-transparent transition-all duration-300"
                >
                  {item}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

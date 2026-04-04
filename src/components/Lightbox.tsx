import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Tape } from './Tape';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

export const Lightbox = ({ isOpen, onClose, src, alt }: LightboxProps) => {
  // Prevent scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1500] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-zoom-out" 
          />

          {/* Polaroid Frame */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -5, y: 20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 5, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-full max-h-full bg-white p-4 pb-12 md:p-6 md:pb-16 shadow-[30px_30px_0px_rgba(0,0,0,0.5)] border-2 border-black z-10 flex flex-col items-center"
          >
            {/* Decorative Tape */}
            <Tape rotation={-2} className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 opacity-90 z-20 pointer-events-none" />
            <Tape rotation={1} className="absolute -bottom-6 right-12 w-32 opacity-70 z-20 pointer-events-none" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 w-12 h-12 bg-accent-pink text-white border-2 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:scale-110 active:scale-95 transition-transform z-30 group"
              aria-label="Close lightbox"
            >
              <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Image Container */}
            <div className="relative overflow-hidden border-2 border-black bg-gray-100 flex-1 flex items-center justify-center">
              <motion.img
                layoutId={`lightbox-img-${src}`}
                src={src}
                alt={alt}
                className="max-w-full max-h-[70vh] object-contain select-none"
                referrerPolicy="no-referrer"
              />
              
              {/* Noise overlay for texture */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] mix-blend-overlay" />
            </div>
            
            {/* Caption */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 md:mt-8 text-center font-hand text-2xl md:text-4xl text-ink max-w-md px-4 leading-tight select-none"
            >
              {alt || "Captured Memories"}
            </motion.div>

            {/* Scribble decoration */}
            <div className="absolute bottom-4 left-6 opacity-20 rotate-12 pointer-events-none hidden md:block">
              <svg width="40" height="40" viewBox="0 0 100 100">
                <path d="M20,50 L80,50 M50,20 L50,80" fill="none" stroke="black" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

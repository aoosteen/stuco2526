import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useRouteTransitionMotion } from './lib/routeTransitionMotion';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { shouldRunEnter, incomingEnterDelaySec } = useRouteTransitionMotion();

  return (
    <div className="min-h-screen bg-paper text-ink font-sans px-4 overflow-hidden relative selection:bg-accent-yellow selection:text-ink flex flex-col items-center justify-center pb-20 pt-20 md:pt-0">
      
      {/* Background doodles/grid can go here if needed later */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-[0.02]">
         <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent" />
      </div>

      <motion.div 
        className="relative z-10 flex flex-col items-center max-w-5xl w-full"
        initial={shouldRunEnter ? { opacity: 0, scale: 0.95, y: 20 } : false}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={
          shouldRunEnter
            ? { duration: 0.8, delay: incomingEnterDelaySec + 0.1, ease: [0.16, 1, 0.3, 1] }
            : { duration: 0 }
        }
      >
        
        {/* Massive 404 Title */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-12 relative z-20 hover-trigger group">
            <motion.div
               animate={{ rotate: [-4, 2, -4], y: [0, -5, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
               className="font-serif text-[7rem] sm:text-[10rem] md:text-[16rem] leading-[0.8] font-black text-accent-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] md:drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] z-10 relative"
            >
                4
            </motion.div>
            
            <motion.div
               animate={{ rotate: [3, -2, 3], y: [0, 8, 0] }}
               transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
               className="font-serif text-[8rem] sm:text-[11rem] md:text-[17rem] leading-[0.8] font-black text-paper drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] md:drop-shadow-[10px_10px_0px_rgba(0,0,0,1)] relative z-20"
               style={{ WebkitTextStroke: 'clamp(3px, 0.5vw, 6px) #000000' }}
            >
                0
                 {/* Small tape on the '0' to look like scrapbook */}
                <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-8 md:w-16 h-3 md:h-6 bg-accent-yellow/90 border-t border-b border-black/20 -rotate-12 z-30 pointer-events-none mix-blend-multiply" />
            </motion.div>
            
            <motion.div
               animate={{ rotate: [-2, 4, -2], y: [0, -4, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
               className="font-serif text-[7rem] sm:text-[10rem] md:text-[16rem] leading-[0.8] font-black text-accent-pink drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] md:drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] z-10 relative"
            >
                4
            </motion.div>
        </div>

        {/* Layout Row for Desktop: Image left, Text right */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 w-full max-w-4xl relative z-10 px-4 md:px-0 mt-4 md:mt-0">
            
            {/* Scrapbook Image Container */}
            <div className="relative group hover-trigger flex-shrink-0">
                {/* Tape */}
                <div className="absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2 w-20 md:w-32 h-6 md:h-8 bg-white/70 backdrop-blur-md border border-black/10 -rotate-3 z-30 pointer-events-none shadow-sm" />
                
                <motion.div
                    animate={{ 
                        rotate: [3, 1, 3],
                        scale: [1, 1.01, 1]
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="bg-white border-2 border-black p-3 md:p-4 pb-12 md:pb-16 shadow-[8px_8px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_rgba(0,0,0,1)] rotate-3 relative max-w-[220px] md:max-w-[320px] z-20"
                >
                    <img 
                      src="/ErrorAsset.png" 
                      alt="404 Graphic" 
                      className="w-full h-auto object-contain border border-black/5"
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-hand text-xl md:text-3xl text-black/80 whitespace-nowrap -rotate-2">
                        where are we?
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="absolute -bottom-8 -left-8 text-accent-yellow drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] pointer-events-none z-10"
                >
                    <span className="text-6xl md:text-7xl">★</span>
                </motion.div>
                
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute -top-6 -right-6 text-accent-lightblue drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] pointer-events-none z-10"
                >
                    <span className="text-4xl md:text-5xl">✖</span>
                </motion.div>
            </div>

            {/* Text Details Box */}
            <div className="text-left bg-white border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_rgba(0,0,0,1)] -rotate-2 md:-rotate-1 relative max-w-[380px] md:max-w-[420px] z-20 w-full mt-4 md:mt-0">
                {/* Side Tape */}
                <div className="absolute -left-6 md:-left-8 top-1/2 -translate-y-1/2 w-12 md:w-16 h-6 bg-accent-lightblue/90 border border-black/20 rotate-[85deg] z-30 pointer-events-none" />
                
                <h1 className="font-serif text-3xl md:text-4xl font-black mb-4 uppercase tracking-tighter leading-[1.1] relative z-10">
                    Lost In <br/><span className="text-accent-red underline decoration-wavy decoration-black underline-offset-4">Space</span>
                </h1>
                
                <p className="font-sans text-sm md:text-base opacity-90 mb-8 relative z-10 font-medium leading-relaxed">
                    Oops! Looks like this page went on a field trip without us. The link might be broken or the page has moved.
                </p>
                
                {/* Return Button inside the text box layout */}
                <motion.button
                    onClick={() => navigate('/')}
                    whileHover={{ scale: 1.03, rotate: 1 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative flex items-center justify-center gap-3 w-full hover-trigger z-20"
                >
                    <div className="w-full relative bg-accent-yellow text-black border-2 border-black px-6 py-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all duration-200 flex items-center justify-center gap-3 text-center">
                        <Home size={20} strokeWidth={2.5} className="group-hover:-translate-y-1 transition-transform" />
                        <span className="font-serif font-black text-sm md:text-base uppercase tracking-wider">
                           Take Me Home
                        </span>
                    </div>
                </motion.button>
            </div>
            
        </div>
      </motion.div>
    </div>
  );
}

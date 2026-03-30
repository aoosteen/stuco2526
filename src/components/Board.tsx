import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useMember } from '../hooks/useMember';
import { BoardMember } from './BoardMember';
import { Tape } from './Tape';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Board = () => {
  const { allSortedMembers: boardMembers, loading } = useMember();
  const containerRef = useRef<HTMLDivElement>(null);


  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, mass: 0.5 });
  
  // Custom horizontal movement for the background text based on the section's scroll
  const xMovement = useTransform(smoothProgress, [0, 1], [-200, 200]);

  return (
    <section ref={containerRef} id="team" data-cursor="view" className="py-32 md:py-48 bg-[#FEF8EE] relative z-20 overflow-hidden">
     

      {/* Transition Elements bridging from LatestEvents */}
      <div className="absolute top-[-50px] right-[20%] md:right-[30%] z-30">
        <Tape rotation={5} className="w-32 md:w-48" />
      </div>
      <div className="absolute top-[-70px] left-[10%] md:left-[15%] z-30 text-accent-pink opacity-60 pointer-events-none">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path d="M10,90 Q50,10 90,90" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="6 6" />
          <circle cx="10" cy="90" r="4" fill="currentColor" />
        </svg>
      </div>

      <div className="px-6 md:px-20 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20">
          <h2 className="font-serif text-6xl md:text-8xl font-bold tracking-tighter">The<br/>Board.</h2>
          <p className="font-hand text-3xl text-gray-600 max-w-sm mt-6 md:mt-0">The minds behind the madness. Meet your representatives.</p>
        </div>

        <div className="border-t-2 border-black min-h-[400px]">
          {!loading ? (
            boardMembers.map((member, i) => (
              <BoardMember key={member._id || i} member={member} index={i} />
            ))
          ) : (
            <div className="py-20 text-center font-hand text-2xl opacity-20">Loading our leaders...</div>
          )}
        </div>
         <div className="mt-20 flex justify-center">
            <Link to="/members">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-accent-pink text-white px-8 py-4 md:px-12 md:py-6 font-sans uppercase tracking-[0.2em] font-black border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all hover-trigger flex items-center gap-4 text-sm md:text-base hover:scale-105"
              >
                Learn More <ArrowRight size={24} />
              </motion.button>
            </Link>
          </div>
      </div>
    </section>
  );
};

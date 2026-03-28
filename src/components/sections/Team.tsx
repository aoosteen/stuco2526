import React from 'react';
import { motion } from 'motion/react';

const teamMembers = [
  { role: "President", name: "Alex Chen" },
  { role: "Vice President", name: "Sarah Jenkins" },
  { role: "Secretary", name: "Marcus Rivera" },
  { role: "Treasurer", name: "Emma Watson" },
  { role: "Head of Events", name: "David Kim" }
];

export const Team = () => {
  return (
    <section id="team" className="py-32 md:py-48 px-6 md:px-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20">
        <h2 className="font-serif text-6xl md:text-8xl font-bold tracking-tighter">The<br/>Board.</h2>
        <p className="font-hand text-3xl text-gray-600 max-w-sm mt-6 md:mt-0">The minds behind the madness. Meet your representatives.</p>
      </div>

      <div className="border-t-2 border-black">
        {teamMembers.map((member, i) => (
          <motion.div 
            key={i}
            initial="initial"
            whileHover="hover"
            className="group border-b-2 border-black py-8 md:py-12 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover-trigger relative"
          >
            <motion.span 
              variants={{ initial: { x: 0 }, hover: { x: 20 } }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="font-serif text-3xl md:text-5xl font-bold"
            >
              {member.role}
            </motion.span>
            <span className="font-sans text-xl md:text-2xl mt-2 md:mt-0 opacity-50 group-hover:opacity-100 transition-opacity">
              {member.name}
            </span>
            
            <motion.div 
              variants={{
                initial: { opacity: 0, scale: 0.8, rotate: -10 },
                hover: { opacity: 1, scale: 1, rotate: 5 }
              }}
              className="absolute right-[20%] top-1/2 -translate-y-1/2 w-48 hidden md:block pointer-events-none z-30"
            >
              <div className="bg-white p-4 shadow-2xl">
                <img 
                  src={`https://i.pravatar.cc/400?img=${i + 10}`} 
                  alt={member.name} 
                  className="w-full aspect-square object-cover grayscale" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

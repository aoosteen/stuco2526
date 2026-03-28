import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Tape } from './Tape';

const blogs = [
  {
    id: 1,
    title: "Why We Need More Plants in the Library",
    date: "March 15, 2026",
    author: "Sarah Jenkins",
    excerpt: "A deep dive into how greenery improves focus and why the student council is pushing for a botanical takeover.",
    color: "bg-[#fff9ef]",
    rotation: -2,
  },
  {
    id: 2,
    title: "Behind the Scenes: Winter Gala Planning",
    date: "February 28, 2026",
    author: "David Kim",
    excerpt: "Ever wonder what goes into planning the biggest night of the year? Spoiler: It involves a lot of coffee and spreadsheets.",
    color: "bg-[#fff9ef]",
    rotation: 3,
  },
  {
    id: 3,
    title: "The Case for Longer Lunch Breaks",
    date: "February 10, 2026",
    author: "Alex Chen",
    excerpt: "We've heard your feedback. Here's our proposal to the administration for a 15-minute extension to our lunch period.",
    color: "bg-[#fff9ef]",
    rotation: -1,
  }
];

export const Blogs = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={containerRef} id="blogs" data-cursor="read" className="py-32 md:py-48 bg-[#b8e6fe] text-[#1a1a1a] relative overflow-hidden z-10">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
      
      {/* Background Doodles */}
      <div className="absolute top-[5%] left-[2%] opacity-30 pointer-events-none rotate-12">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <path d="M50,10 L61,35 L88,35 L67,52 L75,77 L50,62 L25,77 L33,52 L12,35 L39,35 Z" fill="none" stroke="#a30037" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="absolute top-[5%] right-[2%] opacity-30 pointer-events-none -rotate-12">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path d="M10,50 C10,10 90,10 90,50 S10,90 10,50" fill="none" stroke="#005986" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-[5%] left-[2%] opacity-20 pointer-events-none rotate-45">
        <svg width="60" height="60" viewBox="0 0 100 100">
          <path d="M10,50 L90,50 M70,30 L90,50 L70,70" fill="none" stroke="#FF1493" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="absolute bottom-[5%] right-[2%] opacity-20 pointer-events-none">
        <svg width="50" height="50" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#FFC21A" strokeWidth="8" strokeDasharray="10 10" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <h2 className="font-serif text-6xl md:text-8xl font-black tracking-tighter text-[#1a1a1a]">
            COUNCIL<br/>NOTES.
          </h2>
          <p className="font-hand text-3xl text-[#a30037] max-w-sm mt-6 md:mt-0">
            Thoughts, updates, and ramblings from your student reps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {blogs.map((blog, i) => {
            const y = i === 0 ? y1 : i === 1 ? y2 : y3;
            return (
              <motion.div 
                key={blog.id}
                style={{ y }}
                className="relative group cursor-pointer hover-trigger"
              >
                <div 
                  className={`relative p-8 shadow-[10px_10px_0px_rgba(0,0,0,0.2)] border-2 border-black transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[15px_15px_0px_rgba(0,0,0,0.2)] ${blog.color}`}
                  style={{ transform: `rotate(${blog.rotation}deg)` }}
                >
                  <Tape rotation={blog.rotation * -2} className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 opacity-80" />
                  
                  <div className="font-sans text-xs uppercase tracking-widest font-bold opacity-60 mb-4 flex justify-between">
                    <span>{blog.date}</span>
                    <span>By {blog.author}</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold mb-4 leading-tight border-b-2 border-black/10 pb-4">
                    {blog.title}
                  </h3>
                  
                  <p className="font-hand text-xl text-gray-700 leading-relaxed mb-6">
                    {blog.excerpt}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest font-bold text-[#a30037] group-hover:text-[#FF1493] transition-colors">
                    Read More 
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

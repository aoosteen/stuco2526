import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Tape } from './components/Tape';
import Lenis from 'lenis';
import { ArrowLeft, Calendar, Image as ImageIcon } from 'lucide-react';

// Mock CMS Data Generator for Individual Galleries
const getEventData = (id: string) => {
  const baseEvents: Record<string, any> = {
    'e1': { title: "Welcome Back Picnic", date: "Aug 15, 2025", color: "bg-[#ffbd9b]" },
    'e2': { title: "Club Rush Week", date: "Sep 05, 2025", color: "bg-[#b8e6fe]" },
    'e3': { title: "Halloween Spooktacular", date: "Oct 31, 2025", color: "bg-[#fff9ef]" },
    'e4': { title: "Winter Gala 2025", date: "Dec 12, 2025", color: "bg-[#FFC21A]" },
    'e5': { title: "Charity Bake Sale", date: "Feb 20, 2026", color: "bg-[#ffbd9b]" },
    'e6': { title: "Mental Health Week", date: "Mar 15, 2026", color: "bg-[#b8e6fe]" },
    'e7': { title: "Spring Sports Festival", date: "May 10, 2026", color: "bg-[#fff9ef]" },
    'e8': { title: "Senior Farewell Prom", date: "Jun 05, 2026", color: "bg-[#FF1493]" },
  };

  const base = baseEvents[id] || { title: "Amazing Event", date: "2025", color: "bg-[#FFC21A]" };

  return {
    ...base,
    description: "This is a detailed look into one of our favorite events of the year. From the early morning setups to the late-night cleanups, these photos capture the energy, the people, and the unforgettable moments that made it all possible. Scroll through to relive the memories!",
    coverImage: "https://images.unsplash.com/photo-1523580494112-071d1694035c?q=80&w=1600&auto=format&fit=crop",
    categories: [
      {
        name: "Highlights",
        color: "text-[#FF1493]",
        images: [
          { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop", rot: -2 },
          { url: "https://images.unsplash.com/photo-1508362522040-e54f5c7110e5?q=80&w=800&auto=format&fit=crop", rot: 3 },
          { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop", rot: -1 },
          { url: "https://images.unsplash.com/photo-1523580494112-071d1694035c?q=80&w=800&auto=format&fit=crop", rot: 2 },
        ]
      },
      {
        name: "Behind the Scenes",
        color: "text-[#005986]",
        images: [
          { url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop", rot: 2 },
          { url: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop", rot: -3 },
          { url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop", rot: 1 },
        ]
      },
      {
        name: "Students Collections",
        color: "text-[#a30037]",
        images: [
          { url: "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=800&auto=format&fit=crop", rot: 1 },
          { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop", rot: -2 },
          { url: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=800&auto=format&fit=crop", rot: 4 },
          { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop", rot: -1 },
        ]
      },
      {
        name: "Miscellaneous",
        color: "text-[#1a1a1a]",
        images: [
          { url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop", rot: 2 },
          { url: "https://images.unsplash.com/photo-1508362522040-e54f5c7110e5?q=80&w=800&auto=format&fit=crop", rot: -2 },
        ]
      }
    ]
  };
};

const ScribbleLine = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M0 10C20 5 40 15 60 10C80 5 100 15 120 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
  </svg>
);

export default function EventGallery() {
  const { id } = useParams<{ id: string }>();
  const event = getEventData(id || 'e1');
  const [activeCategory, setActiveCategory] = useState("Highlights");
  
  const activeCategoryData = event.categories.find(c => c.name === activeCategory) || event.categories[0];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, mass: 0.5 });
  const headerY = useTransform(smoothProgress, [0, 1], [0, 50]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Scroll to top on mount
    window.scrollTo(0, 0);

    return () => {
      lenis.destroy();
    };
  }, [id]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fff9ef] text-[#000000] font-sans selection:bg-[#FFC21A] selection:text-[#000000] overflow-x-hidden relative">
      <div className="noise-overlay" />
      <Navbar />
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center px-6 md:px-20 max-w-7xl mx-auto relative z-10" data-cursor="magic">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            style={{ y: headerY }}
            className="w-full lg:w-1/2 relative z-20"
          >
            <div className="inline-block mb-4">
              <div className={`px-4 py-1 border-2 border-black ${event.color} font-sans text-[10px] uppercase tracking-widest font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-2`}>
                <Calendar size={12} /> {event.date}
              </div>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6">
              {event.title}
            </h1>
            <p className="font-hand text-2xl leading-relaxed text-black/80 mb-8">
              {event.description}
            </p>
            <ScribbleLine className="w-32 text-[#FFC21A]" />
          </motion.div>

          {/* Cover Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="p-4 bg-white border-2 border-black shadow-[15px_15px_0px_rgba(0,0,0,0.15)] relative">
              <Tape rotation={3} className="absolute -top-6 left-1/2 -translate-x-1/2 w-40 opacity-90 z-20" />
              <div className="aspect-[4/3] overflow-hidden border-2 border-black">
                <img 
                  src={event.coverImage} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-4 text-center font-hand text-xl opacity-70">
                Cover Photo
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter & Grid */}
      <div className="pb-32 px-6 md:px-20 max-w-7xl mx-auto relative z-10 pt-12">
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {event.categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            const hexColor = cat.color.replace('text-', 'bg-');
            
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-6 py-3 font-sans font-bold uppercase tracking-widest text-sm border-2 border-black transition-all duration-300 ${
                  isActive 
                    ? `${hexColor} text-white shadow-[0px_0px_0px_rgba(0,0,0,1)] translate-y-1` 
                    : 'bg-white text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Active Category Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryData.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {/* Category Header */}
            <div className="flex items-center gap-6 mb-12">
              <h2 className={`font-serif text-4xl md:text-5xl font-bold tracking-tighter ${activeCategoryData.color}`}>
                {activeCategoryData.name}.
              </h2>
              <div className="flex-1 h-[2px] bg-black/10 relative">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`absolute inset-0 ${activeCategoryData.color.replace('text-', 'bg-')} origin-left`}
                />
              </div>
            </div>

            {/* Masonry-ish Scrapbook Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {activeCategoryData.images.map((img, imgIndex) => (
                <motion.div
                  key={`${activeCategoryData.name}-${imgIndex}`}
                  initial={{ opacity: 0, y: 50, rotate: img.rot * 2 }}
                  animate={{ opacity: 1, y: 0, rotate: img.rot }}
                  transition={{ delay: (imgIndex % 3) * 0.1, duration: 0.6 }}
                  className="relative group"
                >
                  {/* Polaroid Style Frame */}
                  <div className="p-3 md:p-4 bg-white border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-[1.03] group-hover:shadow-[12px_12px_0px_rgba(0,0,0,0.15)] group-hover:z-10 relative">
                    <Tape rotation={img.rot * -3} className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 opacity-80 z-20" />
                    
                    <div className="aspect-square overflow-hidden border-2 border-black relative">
                      <img 
                        src={img.url} 
                        alt={`${activeCategoryData.name} ${imgIndex + 1}`} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-[#FF1493]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-multiply" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative Background Text */}
      <div className="absolute top-[50%] left-0 w-full pointer-events-none opacity-[0.03] select-none z-0 overflow-hidden">
        <motion.div 
          style={{ x: useTransform(smoothProgress, [0, 1], [0, -800]) }}
          className="font-serif text-[25vw] font-black whitespace-nowrap leading-none text-[#a30037] flex gap-20"
        >
          <span>GALLERY</span>
          <span>ARCHIVE</span>
          <span>RECORDS</span>
        </motion.div>
      </div>
    </div>
  );
}

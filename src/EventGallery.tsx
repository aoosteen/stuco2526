import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { Tape } from './components/Tape';
import Lenis from 'lenis';
import { ArrowLeft, Calendar, Image as ImageIcon } from 'lucide-react';

import { useRouteTransitionMotion } from './lib/routeTransitionMotion';
import { useGalleryEvent } from './hooks/useGallery';

const ScribbleLine = ({ className, enabled = true }: { className?: string; enabled?: boolean }) => (
  <svg className={className} viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M0 10C20 5 40 15 60 10C80 5 100 15 120 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={enabled ? { pathLength: 0 } : false}
      whileInView={enabled ? { pathLength: 1 } : undefined}
      transition={enabled ? { duration: 1.5, ease: "easeInOut" } : { duration: 0 }}
    />
  </svg>
);

export default function EventGallery() {
  const { shouldRunEnter, incomingEnterDelaySec } = useRouteTransitionMotion();
  const { id } = useParams<{ id: string }>();
  const { event, loading } = useGalleryEvent(id);
  const [activeCategory, setActiveCategory] = useState("Highlights");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, mass: 0.5 });
  const headerY = useTransform(smoothProgress, [0, 1], [0, 50]);
  const backgroundX = useTransform(smoothProgress, [0, 1], [0, -800]);

  useEffect(() => {
    if (event?.categories && event.categories.length > 0 && activeCategory === "Highlights") {
      setActiveCategory(event.categories[0].name);
    }
  }, [event, activeCategory]);

  useEffect(() => {
    if (!loading && event) {
      // Small delay to ensure the DOM has fully updated after loading state changes
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        // If there's a global lenis or local one, we could use it here, 
        // but for now we'll rely on the useEffect below to initialize it
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loading, event]);

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

    // Initial scroll reset for the mounted component
    lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    return () => {
      lenis.destroy();
    };
  }, [id]);

  const activeCategoryData = event?.categories?.find((c: any) => c.name === activeCategory) || event?.categories?.[0];

  return (
    <div ref={containerRef} className="min-h-screen bg-paper text-ink font-sans selection:bg-accent-yellow selection:text-ink overflow-x-hidden relative">
      <div className="noise-overlay" />

      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="font-serif text-2xl animate-pulse text-ink">Loading Archive...</div>
        </div>
      )}

      {!loading && !event && (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
          <div className="font-serif text-3xl text-ink">Event not found</div>
          <Link to="/gallery" className="font-sans text-sm uppercase tracking-widest font-bold underline text-ink">Return to Gallery</Link>
        </div>
      )}

      {!loading && event && activeCategoryData && (
        <>
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
                <p className="font-hand text-2xl leading-relaxed text-accent-yellow mb-8">
                  {event.description}
                </p>
                <ScribbleLine className="w-32 text-[#FFC21A]" enabled={shouldRunEnter} />
              </motion.div>

              {/* Cover Image */}
              <motion.div 
                initial={shouldRunEnter ? { opacity: 0, scale: 0.9, rotate: 2 } : false}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                transition={
                  shouldRunEnter
                    ? { duration: 0.8, ease: "easeOut", delay: incomingEnterDelaySec }
                    : { duration: 0 }
                }
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
                    {}
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
                initial={shouldRunEnter ? { opacity: 0, y: 30 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={
                  shouldRunEnter
                    ? { duration: 0.4, delay: incomingEnterDelaySec }
                    : { duration: 0 }
                }
              >
                {/* Category Header */}
                <div className="flex items-center gap-6 mb-12">
                  <h2 className={`font-serif text-4xl md:text-5xl font-bold tracking-tighter ${activeCategoryData.color}`}>
                    {activeCategoryData.name}.
                  </h2>
                  <div className="flex-1 h-[2px] bg-black/10 relative">
                    <motion.div 
                      initial={shouldRunEnter ? { scaleX: 0 } : false}
                      animate={{ scaleX: 1 }}
                      transition={
                        shouldRunEnter
                          ? { duration: 1, delay: incomingEnterDelaySec + 0.2 }
                          : { duration: 0 }
                      }
                      className={`absolute inset-0 ${activeCategoryData.color.replace('text-', 'bg-')} origin-left`}
                    />
                  </div>
                </div>

                {/* Masonry-ish Scrapbook Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                  {activeCategoryData.images.map((img, imgIndex) => (
                    <motion.div
                      key={`${activeCategoryData.name}-${imgIndex}`}
                      initial={shouldRunEnter ? { opacity: 0, y: 50, rotate: img.rot * 2 } : false}
                      animate={{ opacity: 1, y: 0, rotate: img.rot }}
                      transition={
                        shouldRunEnter
                          ? { delay: incomingEnterDelaySec + (imgIndex % 3) * 0.1, duration: 0.6 }
                          : { duration: 0 }
                      }
                      className="relative group"
                    >
                      {/* Polaroid Style Frame */}
                      <div className="p-3 md:p-4 bg-white border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-[1.03] group-hover:shadow-[12px_12px_0px_rgba(0,0,0,0.15)] group-hover:z-10 relative">
                        <Tape rotation={img.rot * -3} className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 opacity-80 z-20" />
                        
                        <div className="aspect-square overflow-hidden border-2 border-black relative">
                          <img 
                            src={img.url} 
                            alt={`${activeCategoryData.name} ${imgIndex + 1}`} 
                            className="w-full h-full object-cover transition-all duration-700"
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
         
        </>
      )}
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { Tape } from './components/Tape';
import Lenis from 'lenis';
import { Calendar } from 'lucide-react';

import { sanityClient, urlFor } from './lib/sanity';
import { useRouteTransitionMotion } from './lib/routeTransitionMotion';
import { useGalleryData } from './hooks/useGallery';


const Sticker = ({
  text,
  color,
  className,
  enabled = true,
}: {
  text: string;
  color: string;
  className?: string;
  enabled?: boolean;
}) => (
  <motion.div
    initial={enabled ? { scale: 0, rotate: -20 } : false}
    whileInView={enabled ? { scale: 1, rotate: (Math.random() * 20) - 10 } : undefined}
    viewport={{ once: true }}
    transition={enabled ? { duration: 0.4 } : { duration: 0 }}
    className={`px-4 py-2 ${color} border-2 border-black font-hand text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] whitespace-nowrap ${className}`}
  >
    {text}
  </motion.div>
);

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

const TermSection = ({ termData, urlFor, Sticker, ScribbleLine, Tape, shouldRunEnter }: any) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"]
  });
  const localSmooth = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  return (
    <div 
      ref={sectionRef} 
      key={termData.term} 
      className="relative" 
      style={{ '--term-color': termData.hex } as any}
    >
      {/* Local Timeline Segment for this term */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 z-0 hidden md:block">
        <div className="absolute inset-0 bg-black/5" />
        <motion.div 
          style={{ 
            scaleY: localSmooth,
            backgroundColor: termData.hex,
            boxShadow: useTransform(localSmooth, [0, 0.1], [`0 0 0px transparent`, `0 0 15px ${termData.hex}`])
          }}
          className="absolute inset-0 origin-top"
        />
      </div>
      
      {/* Term Header */}
      <motion.div 
        initial={shouldRunEnter ? { opacity: 0, y: 30 } : false}
        whileInView={shouldRunEnter ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, margin: "-100px" }}
        transition={shouldRunEnter ? { duration: 0.6 } : { duration: 0 }}
        className="text-center mb-16 md:mb-24 relative bg-paper py-8 z-10"
      >
        <div className="inline-block relative">
          <h2 className={`font-serif text-5xl md:text-7xl font-black tracking-tighter ${termData.color} mb-4`}>
            {termData.term}
          </h2>
          <Tape rotation={-5} className="absolute -top-4 -right-8 w-24 opacity-80" />
        </div>
        <h3 className="font-sans text-xl md:text-2xl uppercase tracking-[0.2em] font-bold mb-4">{termData.theme}</h3>
        <p className="font-hand text-xl md:text-2xl text-black/60 max-w-md mx-auto">
          "{termData.description}"
        </p>
      </motion.div>

      {/* Events in Term */}
      <div className="flex flex-col gap-20 md:gap-32">
        {termData.events.map((event: any, eventIndex: number) => {
          const isEven = eventIndex % 2 === 0;
          return (
            <Link 
              to={`/gallery/${event._id}`} 
              key={event._id} 
              className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 relative group/link cursor-pointer`}
            >
              
              {/* Timeline Dot (Desktop) */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-paper border-4 border-(--term-color) rounded-full z-20 hidden md:block transition-transform duration-300 group-hover/link:scale-150" />

              {/* Image Side */}
              <motion.div 
                initial={shouldRunEnter ? { opacity: 0, x: isEven ? -50 : 50, rotate: isEven ? -10 : 10 } : false}
                whileInView={shouldRunEnter ? { opacity: 1, x: 0, rotate: event.rotation } : undefined}
                viewport={{ once: true, margin: "-100px" }}
                transition={shouldRunEnter ? { duration: 0.7 } : { duration: 0 }}
                className="w-full md:w-1/2 relative group"
              >
                <div className={`p-4 md:p-6 border-2 border-black ${event.bgColor} shadow-[15px_15px_0px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover/link:scale-[1.02]`}>
                  <Tape rotation={event.rotation * -4} className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 opacity-90 z-20" />
                  <div className="aspect-[4/3] overflow-hidden border-2 border-black relative">
                    <img 
                      src={event.coverPhoto ? urlFor(event.coverPhoto).url() : ''} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                {/* Random Sticker */}
                {event.shortWords && (
                  <Sticker
                    text={event.shortWords}
                    color={event.stickerColor}
                    className={`absolute -bottom-4 ${isEven ? '-right-4' : '-left-4'} rotate-12 z-30`}
                    enabled={shouldRunEnter}
                  />
                )}
              </motion.div>

              {/* Content Side */}
              <motion.div 
                initial={shouldRunEnter ? { opacity: 0, x: isEven ? 50 : -50 } : false}
                whileInView={shouldRunEnter ? { opacity: 1, x: 0 } : undefined}
                viewport={{ once: true, margin: "-100px" }}
                transition={shouldRunEnter ? { duration: 0.7 } : { duration: 0 }}
                className={`w-full md:w-1/2 flex flex-col justify-center ${isEven ? 'md:text-left' : 'md:text-right'}`}
              >
                <div className={`flex items-center gap-2 mb-4 font-sans text-[10px] uppercase tracking-widest font-bold opacity-60 ${isEven ? 'justify-start' : 'justify-end'}`}>
                  <Calendar size={14} />
                  <span>{event.date}</span>
                </div>
                <h4 className="font-serif text-3xl md:text-5xl font-bold mb-4 leading-tight group-hover/link:text-(--term-color) transition-colors">{event.title}</h4>
                <p className="font-hand text-xl md:text-2xl leading-relaxed text-black/80 mb-6">
                  {event.description}
                </p>
                <div className={`font-sans text-xs uppercase tracking-widest font-black flex items-center gap-2 ${isEven ? 'justify-start' : 'justify-end'}`}>
                  View Gallery <span className="group-hover/link:translate-x-2 transition-transform">→</span>
                </div>
              </motion.div>

            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default function Gallery() {
  const { galleryData, loading } = useGalleryData();
  const { shouldRunEnter, incomingEnterDelaySec } = useRouteTransitionMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, mass: 0.5 });
  const backgroundX = useTransform(smoothProgress, [0, 1], [0, -1000]);

  useEffect(() => {
    if (!loading && galleryData.length > 0) {
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loading, galleryData]);

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

    // Initial scroll reset
    lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    return () => {
      lenis.destroy();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="font-serif text-2xl animate-pulse text-ink">Loading Archive...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-paper text-ink font-sans selection:bg-accent-yellow selection:text-ink overflow-x-hidden relative">
      <div className="noise-overlay" />

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center px-6 md:px-20 max-w-7xl mx-auto relative text-center" data-cursor="magic">
        <motion.div
          initial={shouldRunEnter ? { opacity: 0, y: 50 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldRunEnter
              ? { duration: 0.8, ease: "easeOut", delay: incomingEnterDelaySec }
              : { duration: 0 }
          }
          className="relative z-10"
        >
          <h1 className="font-serif text-[12vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter text-ink mb-6">
            MEMORY<br/>LANE.
          </h1>
          <p className="font-hand text-2xl md:text-4xl text-accent-yellow max-w-2xl mx-auto">
            A scrapbook of our favorite moments, term by term.
          </p>
          <ScribbleLine className="w-48 mx-auto mt-8 text-accent-yellow" enabled={shouldRunEnter} />
        </motion.div>
        
        {/* Floating Background Doodles */}
        <div className="absolute top-20 left-10 opacity-20 rotate-12 pointer-events-none hidden md:block">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <path d="M20,50 L80,50 M50,20 L50,80" fill="none" stroke="#FF1493" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute top-40 right-10 opacity-20 -rotate-12 pointer-events-none hidden md:block">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <rect x="20" y="20" width="60" height="60" fill="none" stroke="#FFC21A" strokeWidth="4" strokeDasharray="10 10" />
          </svg>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-6 md:px-20 max-w-7xl mx-auto pb-32 relative z-10">
        <div className="flex flex-col gap-32 md:gap-48 relative z-10">
          {galleryData.map((termData) => (
            <TermSection 
              key={termData.term}
              termData={termData}
              urlFor={urlFor}
              Sticker={Sticker}
              ScribbleLine={ScribbleLine}
              Tape={Tape}
              shouldRunEnter={shouldRunEnter}
            />
          ))}
        </div>
      </section>

    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence, useMotionTemplate } from 'motion/react';
import { ArrowRight, Instagram, Mail, MapPin, Menu, X, Youtube, Music } from 'lucide-react';
import { About } from './components/About';
import { Initiatives } from './components/Initiatives';
import { Blogs } from './components/Blogs';
import { Tape } from './components/Tape';
import { BoardMember } from './components/BoardMember';
import Lenis from 'lenis';
import { cn } from './lib/utils';
import { Navbar } from './components/Navbar';



// --- Word Reveal Component ---
const WordReveal = ({ text, className }: { text: string, className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 50%"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, mass: 0.5 });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("flex flex-wrap gap-x-3 gap-y-2", className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        const opacity = useTransform(smoothProgress, [start, end], [0.1, 1]);
        
        return (
          <motion.span key={i} style={{ opacity }} className="inline-block">
            {word}
          </motion.span>
        );
      })}
    </p>
  );
};

// --- Main App ---
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initialize Lenis
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

    return () => {
      lenis.destroy();
    };
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const smoothHeroProgress = useSpring(heroProgress, { stiffness: 50, damping: 20, mass: 0.5 });
  
  // Phase 1: Zoom Out (0% - 25% of scroll)
  const videoScale = useTransform(smoothHeroProgress, [0, 0.25], [1.5, 1]);
  const videoBrightness = useTransform(smoothHeroProgress, [0, 0.2], [0.5, 1]);
  const maskClear = useTransform(smoothHeroProgress, [0, 0.25], [15, 150]);
  const maskSolid = useTransform(smoothHeroProgress, [0, 0.25], [40, 200]);
  const maskImage = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${maskClear}%, black ${maskSolid}%)`;
  const videoFilter = useMotionTemplate`brightness(${videoBrightness})`;
  
  // Phase 2: The "Welcome" Text Reveal (20% - 80% of scroll)
  const textScale = useTransform(smoothHeroProgress, [0.2, 0.8], [0.9, 1.05]);
  // Use direct progress for opacity to avoid spring delay
  const textOpacity = useTransform(heroProgress, [0.2, 0.3, 0.7, 0.8], [0, 1, 1, 0]);
  const textY = useTransform(smoothHeroProgress, [0.2, 0.8], [40, -40]);
  const textBlur = useTransform(smoothHeroProgress, [0.2, 0.3], [20, 0]);
  const textFilter = useMotionTemplate`blur(${textBlur}px)`;

  // General UI
  const uiOpacity = useTransform(heroProgress, [0, 0.2], [1, 0]);
  const scrollIndicatorOpacity = useTransform(heroProgress, [0, 0.05], [1, 0]);

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#000000] font-sans selection:bg-[#FFC21A] selection:text-[#000000]">
      <div className="hidden" />

      <Navbar />

      <main className="relative z-20">
      {/* Hero Section with Zoom Out -> Zoom In Effect */}
      <section ref={heroRef} id="home" data-cursor="magic" className="relative h-[400vh] w-full bg-[#000000]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          
          {/* Background Video (The "World") */}
          <motion.div 
            style={{ 
              scale: videoScale,
              filter: videoFilter
            }}
            className="absolute inset-0 w-full h-full z-0"
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            >
              <source src="https://sc.jny.sch.id/main/StucoMainVideoCompressed.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Elegant Frosted Glass Vignette Overlay */}
          <motion.div 
            style={{
              WebkitMaskImage: maskImage,
              maskImage: maskImage,
            }}
            className="absolute inset-0 z-10 bg-black/60 backdrop-blur-xl pointer-events-none"
          />

          {/* Cinematic Frame / Aperture Overlay */}
          <motion.div 
            style={{ opacity: useTransform(heroProgress, [0, 0.2], [1, 0]) }}
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mb-4"
              >
                <span className="font-sans text-[10px] uppercase tracking-[0.8em] text-white/40">Jakarta Nanyang School</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="font-serif text-5xl md:text-7xl text-white font-bold tracking-tighter"
              >
                STUDENT COUNCIL
              </motion.h1>
            </div>
          </motion.div>

          {/* Phase 2: Zooming Text (Revealed after video zoom out) */}
          <motion.div 
            style={{ 
              opacity: textOpacity, 
              scale: textScale,
              y: textY,
              filter: textFilter
            }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            <img 
              src="https://sc.jny.sch.id/main/Text1.png" 
              alt="Welcome" 
              className="w-full max-w-[900px] h-auto drop-shadow-[0_0_50px_rgba(255,255,255,0.2)] px-6"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Cinematic UI Elements */}
          <motion.div style={{ opacity: uiOpacity }} className="absolute top-10 left-10 z-40 hidden md:block">
            <div className="flex flex-col gap-1">
              <div className="w-8 h-[1px] bg-white/30" />
              <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">System.Live_Feed</span>
              <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">Coord: 06.25.20.26</span>
            </div>
          </motion.div>

          <motion.div style={{ opacity: uiOpacity }} className="absolute bottom-10 right-10 z-40 hidden md:block">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">REC [●] 00:00:00:00</span>
              <div className="w-8 h-[1px] bg-white/30" />
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40">
            <motion.div 
              style={{ opacity: scrollIndicatorOpacity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-white/50">Explore</span>
              <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
                <motion.div 
                  animate={{ y: [0, 48] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 left-0 w-full h-1/2 bg-white"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Manifesto / About */}
      <section className="relative overflow-hidden">
        {/* Decorative Background Text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full pointer-events-none opacity-[0.03] select-none z-0 overflow-hidden">
          <motion.div 
            style={{ x: useTransform(smoothHeroProgress, [0, 1], [0, -400]) }}
            className="font-serif text-[20vw] font-black whitespace-nowrap leading-none text-black flex gap-20"
          >
            <span>OUR MISSION</span>
            <span>OUR VISION</span>
            <span>OUR VOICE</span>
          </motion.div>
        </div>
        <About />
      </section>

      {/* Initiatives / Gallery */}
      <Initiatives />

      {/* Blogs Section */}
      <Blogs />

      {/* Team Section */}
      <section id="team" data-cursor="view" className="py-32 md:py-48 bg-[#ffffff]   relative z-20 overflow-hidden">
        {/* Decorative Background Text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full pointer-events-none opacity-[0.03] select-none z-0 overflow-hidden">
          <motion.div 
            style={{ x: useTransform(smoothHeroProgress, [0, 1], [0, 400]) }}
            className="font-serif text-[20vw] font-black whitespace-nowrap leading-none text-black flex gap-20"
          >
            <span>THE BOARD</span>
            <span>THE TEAM</span>
            <span>THE LEADERS</span>
          </motion.div>
        </div>
        {/* Transition Elements bridging from Initiatives */}
        <div className="absolute top-[-50px] right-[20%] md:right-[30%] z-30">
          <Tape rotation={5} className="w-32 md:w-48" />
        </div>
        <div className="absolute top-[-70px] left-[10%] md:left-[15%] z-30 text-[#FF1493] opacity-60 pointer-events-none">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <path d="M10,90 Q50,10 90,90" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="6 6" />
            <circle cx="10" cy="90" r="4" fill="currentColor" />
          </svg>
        </div>

        <div className="px-6 md:px-20 max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <h2 className="font-serif text-6xl md:text-8xl font-bold tracking-tighter">The<br/>Board.</h2>
            <p className="font-hand text-3xl text-gray-600 max-w-sm mt-6 md:mt-0">The minds behind the madness. Meet your representatives.</p>
          </div>

          <div className="border-t-2 border-black">
          {[
            { role: "President", name: "Alex Chen" },
            { role: "Vice President", name: "Sarah Jenkins" },
            { role: "Secretary", name: "Marcus Rivera" },
            { role: "Treasurer", name: "Emma Watson" },
            { role: "Head of Events", name: "David Kim" }
          ].map((member, i) => (
            <BoardMember key={i} member={member} index={i} />
          ))}
        </div>
        </div>
      </section>
      </main>
    </div>
  );
}

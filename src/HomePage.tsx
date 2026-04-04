import React, { useEffect, useRef} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import { HomeAboutSection } from "./components/HomeAboutSection";
import { HomeLatestEvents } from "./components/HomeLatestEvents";
import { HomeBlogPreview } from "./components/HomeBlogPreview";
import { HomeBoardSection } from "./components/HomeBoardSection";
import Lenis from "lenis";
import { ChevronDown } from "lucide-react";
import { useRouteTransitionMotion } from "./lib/routeTransitionMotion";

// --- Main App ---
export default function Home() {
  const { shouldRunEnter, incomingEnterDelaySec } = useRouteTransitionMotion();
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

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
    offset: ["start start", "end end"],
  });

  const smoothHeroProgress = useSpring(heroProgress, {
    stiffness: 50,
    damping: 20,
    mass: 0.5,
  });

  // Phase 1: Zoom Out (0% - 25% of scroll)
  const videoScale = useTransform(smoothHeroProgress, [0, 0.25], [1.5, 1]);
  const videoBrightness = useTransform(smoothHeroProgress, [0, 0.2], [0.5, 1]);
  const maskClear = useTransform(smoothHeroProgress, [0, 0.25], [15, 150]);
  const maskSolid = useTransform(smoothHeroProgress, [0, 0.25], [40, 200]);
  const maskImage = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${maskClear}%, black ${maskSolid}%)`;
  const videoFilter = useMotionTemplate`brightness(${videoBrightness})`;

  // Phase 2: Title Fade (25% - 75% of scroll)
  const titleOpacity = useTransform(
    smoothHeroProgress,
    [0, 0.25, 0.75],
    [1, 1, 0],
  );

  // General UI
  const uiOpacity = useTransform(heroProgress, [0, 0.2], [1, 0]);
  const scrollIndicatorOpacity = useTransform(heroProgress, [0, 0.05], [1, 0]);

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#000000] font-sans selection:bg-[#FFC21A] selection:text-[#000000]">
      <div className="hidden" />

      <main className="relative z-20">
        {/* Hero Section with Zoom Out -> Zoom In Effect */}
        <section
          ref={heroRef}
          id="home"
          className="relative h-[400vh] w-full bg-[#000000]"
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {/* Background Video (The "World") */}
            <motion.div
              style={{
                scale: videoScale,
                filter: videoFilter,
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
                <source
                  src="https://sc.jny.sch.id/main/StucoMainVideoCompressed.mp4"
                  type="video/mp4"
                />
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
              style={{ opacity: titleOpacity }}
              className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  initial={shouldRunEnter ? { opacity: 0, scale: 0.9 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={
                    shouldRunEnter
                      ? { duration: 1, delay: incomingEnterDelaySec + 0.5 }
                      : { duration: 0 }
                  }
                  className="mb-4"
                >
                  <span className="font-sans text-[10px] uppercase tracking-[0.8em] text-white/40">
                    Jakarta Nanyang School
                  </span>
                </motion.div>
                <motion.h1
                  initial={shouldRunEnter ? { opacity: 0, y: 20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    shouldRunEnter
                      ? { duration: 1, delay: incomingEnterDelaySec + 0.7 }
                      : { duration: 0 }
                  }
                  className="font-serif text-5xl md:text-7xl text-white font-bold tracking-tighter"
                >
                  STUDENT COUNCIL
                </motion.h1>
              </div>
            </motion.div>

           

            <motion.div
              className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-40 flex flex-col items-end gap-3 md:gap-6"
            >
              {/* Recording Indicator - simplified for mobile */}
              <div className="flex items-center gap-2 md:gap-4 opacity-70 md:opacity-100">
                <span className="font-mono text-[6px] md:text-[8px] text-white/30 tracking-widest uppercase">
                  REC [●] 00:00:00:00
                </span>
                <div className="w-4 md:w-8 h-[1px] bg-white/30" />
              </div>

              {/* Skip Intro Button - Redesigned to match scrapbook theme */}
              <motion.button
                onClick={() => lenisRef.current?.scrollTo('#about', { offset: -50 })}
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-2 md:gap-4 pointer-events-auto outline-none transition-all duration-300 mr-1 md:mr-2 mb-1 md:mb-2 scale-90 md:scale-100"
              >
                {/* Sticker Style Text Box */}
                <div className="relative bg-accent-yellow text-black border-2 border-black px-4 md:px-5 py-2 md:py-2.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] md:group-hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] md:group-hover:translate-x-[3px] group-hover:translate-y-[2px] md:group-hover:translate-y-[3px] transition-all duration-200 -rotate-2">
                  {/* Decorative Tape from the theme */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 md:w-16 h-3 md:h-4 bg-white/40 backdrop-blur-sm border border-black/10 rotate-1 pointer-events-none" />
                  
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-serif font-black text-[10px] md:text-xs uppercase tracking-tight">
                      Skip Intro
                    </span>
                    <span className="hidden sm:inline font-hand text-[10px] text-black/50 italic">
                      Straight to About
                    </span>
                  </div>
                </div>

                {/* Bold Arrow Badge */}
                <div className="w-11 md:w-14 h-11 md:h-14 bg-accent-pink rounded-full border-2 border-black flex items-center justify-center text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] md:group-hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] md:group-hover:translate-x-[3px] group-hover:translate-y-[2px] md:group-hover:translate-y-[3px] transition-all duration-200">
                  <ChevronDown size={28} strokeWidth={3} className="hidden md:block group-hover:translate-y-1 transition-transform duration-300" />
                  <ChevronDown size={20} strokeWidth={3} className="block md:hidden group-hover:translate-y-1 transition-transform duration-300" />
                </div>
                
                {/* Decorative Doodle Star */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute -top-2 -right-2 text-[#00FFFF] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] pointer-events-none"
                >
                  <span className="text-sm md:text-xl">★</span>
                </motion.div>
              </motion.button>
            </motion.div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40">
              <motion.div
                className="flex flex-col items-center gap-2"
              >
                <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-white/50">
                  SCROLL TO EXPLORE
                </span>
                <div className="w-px h-12 bg-white/20 relative overflow-hidden">
                  <motion.div
                    animate={{ y: [0, 48] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
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
          <HomeAboutSection />
        </section>

        {/* Latest Events / Gallery */}
        <HomeLatestEvents />

        {/* Blogs Section */}
        <HomeBlogPreview />

        {/* Team Section */}
        <HomeBoardSection />
      </main>
    </div>
  );
}

import React, { useEffect, useRef} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import { About } from "./components/About";
import { LatestEvents } from "./components/LatestEvents";
import { Blogs } from "./components/Blogs";
import { Board } from "./components/Board";
import Lenis from "lenis";
import { useRouteTransitionMotion } from "./lib/routeTransitionMotion";

// --- Main App ---
export default function Home() {
  const { shouldRunEnter, incomingEnterDelaySec } = useRouteTransitionMotion();

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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenis.scrollTo(0, { immediate: true });

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
          data-cursor="magic"
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
              style={{ opacity: uiOpacity }}
              className="absolute bottom-10 right-10 z-40 hidden md:block"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">
                  REC [●] 00:00:00:00
                </span>
                <div className="w-8 h-[1px] bg-white/30" />
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40">
              <motion.div
                style={{ opacity: scrollIndicatorOpacity }}
                className="flex flex-col items-center gap-2"
              >
                <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-white/50">
                  Explore
                </span>
                <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
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
          <About />
        </section>

        {/* Latest Events / Gallery */}
        <LatestEvents />

        {/* Blogs Section */}
        <Blogs />

        {/* Team Section */}
        <Board />
      </main>
    </div>
  );
}

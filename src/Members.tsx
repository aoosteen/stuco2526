import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Tape } from "./components/Tape";
import Lenis from "lenis";
import { createPortal } from "react-dom";

import { useMember } from "./hooks/useMember";
import { useRouteTransitionMotion } from "./lib/routeTransitionMotion";
import { ParallaxText } from "./components/ParallaxText";

const Sticker = ({
  text,
  color,
  className,
}: {
  text: string;
  color: string;
  className?: string;
}) => (
  <motion.div
    initial={{ scale: 0, rotate: -20 }}
    whileInView={{ scale: 1, rotate: Math.random() * 20 - 10 }}
    viewport={{ once: true }}
    className={`px-4 py-2 ${color} border-2 border-black font-hand text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] whitespace-nowrap ${className}`}
  >
    {text}
  </motion.div>
);

const ScribbleLine = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
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

const HandDrawnArrow = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M10 10Q25 10 25 25T40 40M40 40L30 40M40 40L40 30"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  </svg>
);

export default function Members() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { boardMembers, levelReps, loading } = useMember();
  const [isMounted, setIsMounted] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const { shouldRunEnter, incomingEnterDelaySec, layer, isTransitioning } =
    useRouteTransitionMotion();


  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: globalScroll } = useScroll();
  const progressOpacity = useTransform(scrollYProgress, [0,0.95, 1], [1,1, 0]);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    mass: 0.5,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const syncMenuState = () => {
      setIsNavMenuOpen(document.body.classList.contains("nav-menu-open"));
    };

    syncMenuState();

    const observer = new MutationObserver(syncMenuState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

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

  const progressCanShow =
    isMounted && layer === "current" && !isTransitioning && !isNavMenuOpen;

  return (
    <>
      {isMounted && typeof document !== "undefined"
        ? createPortal(
            <motion.div
              animate={{ opacity: progressCanShow ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed left-6 top-1/2 -translate-y-1/2 z-[1150] hidden xl:flex flex-col items-center gap-4 pointer-events-none"
            >
              <motion.div
                style={{ opacity: progressOpacity }}
                className="flex flex-col items-center gap-4"
              >
                <div className="font-hand text-sm rotate-90 mb-8 opacity-40">
                  The Story So Far
                </div>
                <div className="w-[2px] h-64 bg-black/10 relative">
                  <motion.div
                    style={{ scaleY: smoothProgress }}
                    className="absolute inset-0 bg-accent-darkblue origin-top"
                  />
                </div>
              </motion.div>
            </motion.div>,
            document.body,
          )
        : null}

      <div
        ref={containerRef}
        className="min-h-screen bg-paper text-ink font-sans selection:bg-accent-yellow selection:text-ink overflow-x-hidden "
      >
        <div className="hidden" />

      {/* Hero Section */}
      <section
        className="h-screen flex flex-col items-center justify-center relative px-6 text-center"
        data-cursor="magic"
      >
        <motion.div
          initial={shouldRunEnter ? { opacity: 0, scale: 0.8 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={
            shouldRunEnter
              ? { duration: 1, ease: "easeOut", delay: incomingEnterDelaySec }
              : { duration: 0 }
          }
          className="relative"
        >
          <h1 className="font-serif text-[15vw] md:text-[12vw] leading-[0.8] font-black tracking-tighter text-[#1a1a1a] mb-4">
            OUR
            <br />
            STORY.
          </h1>
          <div className="absolute -top-10 -right-10 md:-right-20 rotate-12">
            <Tape rotation={15} className="w-32 md:w-48 opacity-90" />
          </div>
        </motion.div>

        <motion.p
          initial={shouldRunEnter ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldRunEnter
              ? { delay: incomingEnterDelaySec + 0.5, duration: 1 }
              : { duration: 0 }
          }
          className="font-hand text-3xl md:text-4xl text-accent-darkblue max-w-2xl mt-8"
        >
          Every chapter of our school life is written by those who lead. Meet
          the authors of this year's journey.
        </motion.p>
        <ScribbleLine className="w-48 mx-auto mt-8 text-[#024a70]" />

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="font-sans text-[10px] uppercase tracking-widest opacity-40">
            Scroll to read
          </span>
          <div className="w-[1px] h-12 bg-black/10" />
        </motion.div>
      </section>

      {/* The Board Section */}
      <section className="py-32 px-10 md:px-20 max-w-7xl mx-auto relative overflow-hidden">
        <div className="flex items-center gap-6 mb-24 relative z-10">
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter">
            The Council.
          </h2>
          <div className="flex-1 h-[2px] bg-black/10 relative">
            <motion.div
              style={{ scaleX: smoothProgress }}
              className="absolute inset-0 bg-accent-darkblue origin-left"
            />
          </div>
          <span className="font-hand text-2xl text-accent-darkblue">
            Major Positions
          </span>
        </div>

        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <div className="absolute w-full" style={{ top: "15%", opacity: 0.03 }}>
            <ParallaxText baseVelocity={0.5}>
              <span className="font-serif text-[15vw] font-black uppercase whitespace-nowrap leading-none mr-24">
                LEADERSHIP
              </span>
            </ParallaxText>
          </div>
          <div className="absolute w-full" style={{ top: "47.5%", opacity: 0.03, color: "#024a70" }}>
            <ParallaxText baseVelocity={-0.5}>
              <span className="font-serif text-[15vw] font-black uppercase whitespace-nowrap leading-none mr-24">
                SERVICE
              </span>
            </ParallaxText>
          </div>
          <div className="absolute w-full" style={{ top: "82%", opacity: 0.03 }}>
            <ParallaxText baseVelocity={0.8}>
              <span className="font-serif text-[15vw] font-black uppercase whitespace-nowrap leading-none mr-24">
                EXCELLENCE 
              </span>
            </ParallaxText>
          </div>
        </div>

        <div className="space-y-40 md:space-y-64">
          {boardMembers.map((member, i) => (
            <div
              key={member.name}
              className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-24 relative`}
            >
              {/* Connector Lines */}
              {i < boardMembers.length - 1 && (
                <div
                  className={`absolute -bottom-48 ${i % 2 === 0 ? "left-[20%]" : "right-[20%]"} hidden md:block text-[#8b0836] opacity-20`}
                >
                  <svg width="200" height="300" viewBox="0 0 200 300">
                    <motion.path
                      d={
                        i % 2 === 0
                          ? "M0,0 Q100,150 0,300"
                          : "M200,0 Q100,150 200,300"
                      }
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray="10 10"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ duration: 2 }}
                    />
                  </svg>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex-1 relative group"
              >
                <div
                  className={`relative p-8 md:p-12 shadow-[20px_20px_0px_rgba(0,0,0,0.1)] border-2 border-black ${member.color} transition-transform duration-500 group-hover:scale-[1.02]`}
                  style={{ transform: `rotate(${member.rotation}deg)` }}
                >
                  <Tape
                    rotation={member.rotation * -3}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-40 opacity-90"
                  />

                  <div className="flex flex-col gap-8">
                    <div className="w-full aspect-square overflow-hidden border-2 border-black shadow-[10px_10px_0px_rgba(0,0,0,0.1)]">
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover  transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-[1px] flex-1 bg-black/10" />
                      </div>
                      <h3 className="font-serif text-4xl md:text-6xl font-bold mb-2">
                        {member.name}
                      </h3>
                      <p className="font-sans text-sm uppercase tracking-[0.3em] font-black text-[#8b0836] mb-6">
                        {member.role}
                      </p>
                      <p className="font-hand text-2xl md:text-3xl leading-relaxed mb-8">
                        "{member.bio}"
                      </p>

                      {/* Dynamic Sticker for Board Members */}
                      {member.twoWords && (
                        <Sticker
                          text={member.twoWords}
                          color={
                            i === 0
                              ? "bg-[#FFC21A]"
                              : i === 1
                                ? "bg-[#ffbd9b]"
                                : i === 2
                                  ? "bg-[#b8e6fe]"
                                  : i === 3
                                    ? "bg-[#ffffff]"
                                    : "bg-[#FF1493] text-white"
                          }
                          className={`absolute ${i === 0 ? "-top-10 -right-4 rotate-12" : i === 1 ? "top-1/2 -left-12 -translate-y-1/2 -rotate-90" : i === 2 ? "-bottom-8 right-10 rotate-3" : i === 3 ? "top-20 -right-10 rotate-12" : "-bottom-4 -left-4 -rotate-6"}`}
                        />
                      )}

                      <div className="pt-6 border-t border-black/10">
                        <h4 className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-40 mb-4">
                          Academic Year Events
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {member.events.map((event) => (
                            <span
                              key={event}
                              className="px-4 py-2 bg-white/40 border border-black/10 rounded-full text-xs font-bold"
                            >
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex-1 hidden md:block">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="p-12"
                >
                  <div className="font-hand text-4xl text-black/20 leading-tight">
                    {i === 0 &&
                      "The guiding light. Providing wisdom and mentorship to the leaders of tomorrow."}
                    {i === 1 &&
                      "The vision starts here. Leading with purpose and a bit of caffeine."}
                    {i === 2 &&
                      "The glue that holds us together. Balancing logic with empathy."}
                    {i === 3 &&
                      "The record keeper. Every detail matters in our story."}
                    {i === 4 &&
                      "Fueling the dreams. Making sure every cent counts."}
                    {i === 5 &&
                      "The architect of joy. Creating moments that last forever."}
                  </div>
                  <HandDrawnArrow
                    className={`w-24 h-24 mt-8 ${i % 2 === 0 ? "rotate-90" : "-rotate-90 scale-x-[-1]"} text-[#8b0836] opacity-40`}
                  />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Level Representatives Section */}
      <section className="py-48 bg-[#1a1a1a] text-[#ffffff] relative overflow-hidden">
        <div className="hidden opacity-20" />

        <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
          <div className="text-center mb-32">
            <h2 className="font-serif text-6xl md:text-9xl font-black tracking-tighter mb-6">
              LEVEL REPS.
            </h2>
            <p className="font-hand text-3xl text-[#ffbd9b]">
              The pulse of every grade level.
            </p>
            <ScribbleLine className="w-48 mx-auto mt-8 text-[#ffbd9b]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            {levelReps.map((rep, i) => (
              <motion.div
                key={rep.grade}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="relative group"
              >
                <div
                  className={`p-6 md:p-8 border-2 border-black ${rep.color} text-[#1a1a1a] shadow-[15px_15px_0px_rgba(255,255,255,0.1)] transition-transform duration-500 group-hover:scale-[1.02] relative`}
                  style={{ transform: `rotate(${rep.rotation * 2}deg)` }}
                >
                  <Tape
                    rotation={rep.rotation * -5}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 opacity-80"
                  />

                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 overflow-hidden border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.1)]transition-all duration-500">
                      <img
                        src={rep.imageUrl}
                        alt={rep.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="text-center sm:text-left">
                      <div className="font-sans text-[10px] uppercase tracking-widest font-black text-[#8b0836] mb-2">
                        {rep.grade}
                      </div>
                      <h3 className="font-serif text-3xl font-bold mb-3">
                        {rep.name}
                      </h3>
                      <p className="font-hand text-xl md:text-2xl line-clamp-3 leading-tight mb-4">
                        "{rep.bio}"
                      </p>

                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {rep.events.map((event) => (
                          <span
                            key={event}
                            className="px-3 py-1 bg-black/5 border border-black/10 rounded-full text-[10px] font-bold uppercase tracking-tighter"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Sticker for Level Reps */}
                  {rep.twoWords && (
                    <Sticker
                      text={rep.twoWords}
                      color={
                        i === 0
                          ? "bg-[#FFC21A]"
                          : i === 1
                            ? "bg-[#b8e6fe]"
                            : i === 2
                              ? "bg-[#ffbd9b]"
                              : "bg-[#ffffff]"
                      }
                      className={`absolute ${i === 0 ? "-bottom-4 -right-4 rotate-6" : i === 1 ? "-top-4 -left-4 -rotate-12" : i === 2 ? "-bottom-6 left-10 rotate-3" : "top-1/2 -right-8 -translate-y-1/2 rotate-90"}`}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full pointer-events-none select-none z-0">
          <div style={{ opacity: 0.05, color: "#ffbd9b" }}>
            <ParallaxText baseVelocity={0.3}>
              <span className="font-serif text-[25vw] font-black uppercase whitespace-nowrap leading-none mr-32">
                COMMUNITY 
              </span>
            </ParallaxText>
          </div>
        </div>
         <div className="absolute top-3/4 left-0 -translate-y-1/2 w-full pointer-events-none select-none z-0">
          <div style={{ opacity: 0.05, color: "#ffbd9b" }}>
            <ParallaxText baseVelocity={-0.3}>
              <span className="font-serif text-[25vw] font-black uppercase whitespace-nowrap leading-none mr-32">
                UNITY
              </span>
            </ParallaxText>
          </div>
        </div>
      </section>

      {/* Background Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Additional Decorative Background Text */}
        
        <motion.div
          style={{ y: useTransform(smoothProgress, [0, 1], [0, -200]) }}
          className="absolute top-[15%] right-[10%] opacity-10"
        >
          <svg width="200" height="200" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#FF1493"
              strokeWidth="1"
              strokeDasharray="5 5"
            />
          </svg>
        </motion.div>
        <motion.div
          style={{ y: useTransform(smoothProgress, [0, 1], [0, 400]) }}
          className="absolute top-[70%] right-[5%] opacity-10"
        >
          <svg width="120" height="120" viewBox="0 0 100 100">
            <path
              d="M50,10 Q90,50 50,90 Q10,50 50,10"
              fill="none"
              stroke="#FFC21A"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      </div>
      </div>
    </>
  );
}

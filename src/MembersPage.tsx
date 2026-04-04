import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Tape } from "./components/Tape";
import Lenis from "lenis";
import { createPortal } from "react-dom";

import { useMember } from "./hooks/useMember";
import { useRouteTransitionMotion } from "./lib/routeTransitionMotion";
import { ParallaxText } from "./components/ParallaxText";
import { BoardMemberCard, LevelRepCard } from "./components/Card";
import { Eyebrow } from "./components/Eyebrow";
import { Lightbox } from "./components/Lightbox";
import { memberAnchorIdFromPosition, normalizeMemberAnchorId } from "./lib/memberAnchor";
import { ScribbleLine } from "./components/ScribbleLine";
import { MembersTimeline } from "./components/MembersTimeline";



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
  const lenisRef = useRef<Lenis | null>(null);
  const location = useLocation();
  const { boardMembers, levelReps, loading } = useMember();
  const [isMounted, setIsMounted] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { shouldRunEnter, incomingEnterDelaySec, layer, isTransitioning } =
    useRouteTransitionMotion();


  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressOpacity = useTransform(scrollYProgress, [0,1, 1], [1,1, 0]);

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

  const allMembers = [...boardMembers, ...levelReps];

  useEffect(() => {
    if (loading || allMembers.length === 0) return;

    const handleScroll = () => {
      const ids = allMembers.map((m) => memberAnchorIdFromPosition(m.position));
      let currentActiveId = null;
      let minDistance = Infinity;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Find the member closest to 1/3 down the viewport
          const distance = Math.abs(rect.top - window.innerHeight / 3);
          
          if (distance < minDistance) {
            minDistance = distance;
            currentActiveId = id;
          }
        }
      }
      
      if (currentActiveId) setActiveId(currentActiveId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once initially to set the active item
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, allMembers]);

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
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (loading || !location.hash || layer !== "current" || isTransitioning) {
      return;
    }

    const rawHashId = decodeURIComponent(location.hash.substring(1));
    const normalizedHashId = normalizeMemberAnchorId(rawHashId);
    let timeoutId: number | null = null;
    let rafId: number | null = null;
    let attempts = 0;
    const maxAttempts = 120;

    const tryScrollToMember = () => {
      const lenis = lenisRef.current;
      const element =
        document.getElementById(normalizedHashId) ??
        document.getElementById(rawHashId);

      if (!element) {
        if (attempts < maxAttempts) {
          attempts += 1;
          rafId = window.requestAnimationFrame(tryScrollToMember);
        }
        return;
      }

      const targetTop = Math.max(0, element.getBoundingClientRect().top + window.scrollY - 120);
      window.scrollTo({ top: targetTop, behavior: "smooth" });
      if (lenis) {
        lenis.scrollTo(targetTop, { immediate: true });
      }
    };

    // Slight delay avoids racing with final layout/paint right after slot promotion.
    timeoutId = window.setTimeout(() => {
      tryScrollToMember();
    }, 120);

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [loading, location.hash, layer, isTransitioning]);

  const activeIndex = activeId ? allMembers.findIndex(m => memberAnchorIdFromPosition(m.position) === activeId) : 0;
  const isDarkSection = activeIndex >= boardMembers.length;

  const progressCanShow =
    isMounted && layer === "current" && !isTransitioning && !isNavMenuOpen;

  return (
    <>
      <MembersTimeline
        isMounted={isMounted}
        progressCanShow={progressCanShow}
        progressOpacity={progressOpacity}
        allMembers={allMembers}
        activeId={activeId}
        activeIndex={activeIndex}
        isDarkSection={isDarkSection}
        onMemberClick={(id) => {
          const el = document.getElementById(id);
          if (el) {
            const targetTop = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 120);
            window.scrollTo({ top: targetTop, behavior: "smooth" });
            if (lenisRef.current) {
              lenisRef.current.scrollTo(targetTop, { immediate: false, duration: 1.5 });
            }
          }
        }}
      />


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
          <Eyebrow 
            text="Meet the team" 
            color="text-accent-darkblue" 
            delay={incomingEnterDelaySec} 
          />
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
              id={memberAnchorIdFromPosition(member.position)}
              className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 md:gap-24 relative scroll-mt-32`}
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
                <BoardMemberCard
                  color={member.color}
                  rotation={member.rotation}
                  imageUrl={member.imageUrl}
                  name={member.name}
                  role={member.role}
                  bio={member.bio}
                  events={member.events}
                  twoWords={member.twoWords}
                  stickerColor={
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
                  stickerClassName={`absolute ${
                    i === 0
                      ? "-top-10 -right-4 rotate-12"
                      : i === 1
                        ? "top-1/2 -left-12 -translate-y-1/2 -rotate-90"
                        : i === 2
                          ? "-bottom-8 right-10 rotate-3"
                          : i === 3
                            ? "top-20 -right-10 rotate-12"
                            : "-bottom-4 -left-4 -rotate-6"
                  }`}
                  onImageClick={(data) => setSelectedImage({ url: data.src, alt: data.alt })}
                />
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
                id={memberAnchorIdFromPosition(rep.position)}
                className="relative group scroll-mt-32"
              >
                <LevelRepCard
                  color={rep.color}
                  rotation={rep.rotation}
                  imageUrl={rep.imageUrl}
                  grade={rep.grade}
                  name={rep.name}
                  bio={rep.bio}
                  events={rep.events}
                  twoWords={rep.twoWords}
                  stickerColor={
                    i === 0
                      ? "bg-[#FFC21A]"
                      : i === 1
                        ? "bg-[#b8e6fe]"
                        : i === 2
                          ? "bg-[#ffbd9b]"
                          : "bg-[#ffffff]"
                  }
                  stickerClassName={`absolute ${
                    i === 0
                      ? "-bottom-4 -right-4 rotate-6"
                      : i === 1
                        ? "-top-4 -left-4 -rotate-12"
                        : i === 2
                          ? "-bottom-6 left-10 rotate-3"
                          : "top-1/2 -right-8 -translate-y-1/2 rotate-90"
                  }`}
                  onImageClick={(data) => setSelectedImage({ url: data.src, alt: data.alt })}
                />
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
      <Lightbox 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        src={selectedImage?.url || ''} 
        alt={selectedImage?.alt || ''} 
      />
    </>
  );
}

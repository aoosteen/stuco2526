import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export const Hero = () => {
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 50, damping: 20, mass: 0.5 });
  
  // Phase 1: Video shrinks into a photo
  const videoScale = useTransform(smoothScrollY, [0, 800], [1, 0.6]);
  const videoRotate = useTransform(smoothScrollY, [0, 800], [0, -3]);
  const videoY = useTransform(smoothScrollY, [0, 800], ["0vh", "-10vh"]);
  const videoPad = useTransform(smoothScrollY, [0, 800], ["0px", "16px"]);
  const videoRadius = useTransform(smoothScrollY, [0, 800], ["0px", "24px"]);
  const videoInnerRadius = useTransform(smoothScrollY, [0, 800], ["0px", "12px"]);
  const videoShadow = useTransform(smoothScrollY, [0, 800], ["0px 0px 0px rgba(0,0,0,0)", "0px 20px 40px rgba(0,0,0,0.15)"]);

  // Phase 2: Scrapbook Texts smoothly enter
  const text1Opacity = useTransform(smoothScrollY, [400, 800, 2200, 2500], [0, 1, 1, 0]);
  const text1Y = useTransform(smoothScrollY, [400, 900], [100, 0]);
  const text1Scale = useTransform(smoothScrollY, [400, 900], [0.8, 1]);
  const text1Rotate = useTransform(smoothScrollY, [400, 900], [-10, -2]);

  const text2Opacity = useTransform(smoothScrollY, [600, 1000, 2200, 2500], [0, 1, 1, 0]);
  const text2Y = useTransform(smoothScrollY, [600, 1100], [100, 0]);
  const text2Scale = useTransform(smoothScrollY, [600, 1100], [0.8, 1]);
  const text2Rotate = useTransform(smoothScrollY, [600, 1100], [10, 4]);

  const text3Opacity = useTransform(smoothScrollY, [800, 1200, 2200, 2500], [0, 1, 1, 0]);
  const text3Y = useTransform(smoothScrollY, [800, 1300], [100, 0]);
  const text3Scale = useTransform(smoothScrollY, [800, 1300], [0.8, 1]);
  const text3Rotate = useTransform(smoothScrollY, [800, 1300], [-5, 1]);

  // Pencil animations
  const scribble1Opacity = useTransform(smoothScrollY, [1000, 1200], [0, 1]);
  const scribble2Opacity = useTransform(smoothScrollY, [1200, 1400], [0, 1]);

  const scrollIndicatorOpacity = useTransform(smoothScrollY, [0, 300], [1, 0]);

  return (
    <section id="home" className="relative h-[300vh] w-full bg-[#FDF7EF]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Scrapbook Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:32px_32px]" />
          {/* Vibrant Blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FFC21A]/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#8b0836]/20 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-[#4A90E2]/20 rounded-full blur-[100px]" />
          {/* Noise */}
          <div className="hidden opacity-50" />
        </div>

        {/* Background Scribbles (Behind Video) */}
        <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
          {/* Hand-drawn Sparkle */}
          <motion.div style={{ opacity: scribble2Opacity }} className="absolute top-[15%] right-[5%] md:right-[8%] w-16 h-16 md:w-24 md:h-24 text-[#FFC21A] rotate-[15deg]">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <motion.path
                d="M 50,10 Q 50,50 10,50 Q 50,50 50,90 Q 50,50 90,50 Q 50,50 50,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, scale: 0 }}
                whileInView={{ pathLength: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
          </motion.div>

          {/* Hand-drawn Arrow */}
          <motion.div style={{ opacity: scribble2Opacity }} className="absolute top-[30%] left-[2%] md:left-[5%] w-16 h-24 md:w-20 md:h-32 text-[#4A90E2] rotate-[-25deg]">
            <svg viewBox="0 0 100 150" className="w-full h-full overflow-visible">
              <motion.path
                d="M 20,10 Q 80,50 50,130"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              <motion.path
                d="M 25,105 L 50,130 L 75,100"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
              />
            </svg>
          </motion.div>

          {/* Hand-drawn Underline - Moved to background layer but synced with Text3 */}
          <motion.div 
            style={{ 
              opacity: scribble1Opacity,
              y: text3Y, 
              scale: text3Scale,
              rotate: text3Rotate
            }} 
            className="absolute top-[65%] md:top-[68%] left-1/2 -translate-x-1/2 w-[80%] max-w-[600px] h-12 text-[#8b0836]"
          >
            <svg viewBox="0 0 400 40" className="w-full h-full overflow-visible">
              <motion.path
                d="M 10,20 Q 100,30 200,20 T 390,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              <motion.path
                d="M 20,30 Q 120,40 220,30 T 380,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Background Video (The "Photo") */}
        <motion.div 
          style={{ 
            scale: videoScale,
            rotate: videoRotate,
            y: videoY,
            padding: videoPad,
            borderRadius: videoRadius,
            boxShadow: videoShadow,
            backgroundColor: "#FDF7EF"
          }}
          className="absolute z-10 w-full h-full origin-center flex items-center justify-center border border-black/5"
        >
          <motion.div 
            style={{ borderRadius: videoInnerRadius }}
            className="relative w-full h-full overflow-hidden"
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
            <div className="absolute inset-0 bg-black/10 z-10" />
          </motion.div>
        </motion.div>

        {/* Phase 2: Scrapbook Texts */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <motion.img 
            style={{ opacity: text1Opacity, y: text1Y, scale: text1Scale, rotate: text1Rotate }}
            src="https://sc.jny.sch.id/main/Text1.png" 
            alt="Welcome" 
            className="w-full max-w-[400px] md:max-w-[600px] h-auto drop-shadow-xl mt-[15vh] px-4"
            referrerPolicy="no-referrer"
          />
          <motion.img 
            style={{ opacity: text2Opacity, y: text2Y, scale: text2Scale, rotate: text2Rotate }}
            src="https://sc.jny.sch.id/main/Text2.png" 
            alt="to" 
            className="w-[180px] md:w-[280px] h-auto drop-shadow-lg -mt-8 md:-mt-12 ml-[120px] md:ml-[300px]"
            referrerPolicy="no-referrer"
          />
          <motion.img 
            style={{ opacity: text3Opacity, y: text3Y, scale: text3Scale, rotate: text3Rotate }}
            src="https://sc.jny.sch.id/main/Text3.png" 
            alt="JNY Student Council" 
            className="w-full max-w-[500px] md:max-w-[800px] h-auto drop-shadow-2xl -mt-2 md:-mt-6 px-4"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Student Council Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute top-8 left-8 z-50 flex items-center gap-3"
        >
          <img 
            src="https://sc.jny.sch.id/main/StucoLogo.png" 
            alt="JNY Student Council Logo" 
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 mix-blend-difference text-white"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] opacity-80">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-white/30 relative overflow-hidden">
            <motion.div 
              animate={{ y: [0, 48] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-white"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

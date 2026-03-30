import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Tape } from './Tape';

export const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"]
  });

  // Smooth out the scroll progress for the marker movement
  // const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section 
      ref={sectionRef} 
      id="about" 
      className="relative w-full bg-[#ffffff] py-32 md:py-64   z-20"
    >
      {/* Container for background elements that need clipping */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Background Texture & Grid */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
        {/* Graph paper grid */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#024a70 1px, transparent 1px), linear-gradient(90deg, #024a70 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Colorful Gradient Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#FF1493]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[10%] right-[-5%] w-[40vw] h-[40vw] bg-[#00FFFF]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[30%] left-[10%] w-[35vw] h-[35vw] bg-[#FFC21A]/20 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-[50%] right-[-10%] w-[45vw] h-[45vw] bg-[#00FF00]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[70%] left-[-5%] w-[40vw] h-[40vw] bg-[#FF1493]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[10%] w-[55vw] h-[55vw] bg-[#00FFFF]/20 rounded-full blur-[130px] pointer-events-none" />

        {/* Animated Scroll Path (Bold Brush Scribble) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 1000">
            {/* The main path - Bold Brush stroke style */}
            <motion.path
              d="M 50 0 C 120 50, -20 150, 50 200 C 120 250, -20 350, 50 400 C 120 450, -20 550, 50 600 C 120 650, -20 750, 50 800 C 120 850, -20 950, 50 1000"
              fill="none"
              stroke="#FF1493"
              strokeWidth="15"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: scrollYProgress, opacity: 0.25 }}
            />
            {/* Thinner inner line for texture */}
            <motion.path
              d="M 50 0 C 120 50, -20 150, 50 200 C 120 250, -20 350, 50 400 C 120 450, -20 550, 50 600 C 120 650, -20 750, 50 800 C 120 850, -20 950, 50 1000"
              fill="none"
              stroke="#FF1493"
              strokeWidth="4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: scrollYProgress, opacity: 0.4 }}
            />
          </svg>
        </div>
      </div>

      {/* Storytelling Annotations & Doodles */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {/* Top Left Note */}
        <motion.div 
          className="absolute top-[2.5%] left-[5%] md:left-[15%] rotate-[-12deg]"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <p className="font-hand text-xl md:text-3xl text-[#024a70] opacity-80">"It all started with an idea..."</p>
        </motion.div>

        {/* Top Right Star Doodle - Larger and more prominent */}
        <motion.div 
          className="absolute top-[6%] md:top-[8%] right-[4%] md:right-[8%] scale-50 md:scale-100   text-[#FFC21A] opacity-70 cursor-pointer pointer-events-auto"
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          whileHover={{ scale: 1.6, rotate: 180, opacity: 1 }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </motion.div>

        {/* Middle Left Doodle - Even more filling */}
        <motion.div 
          className="absolute top-[25%] -left-[1.5%] md:left-[3%] text-[#00FFFF] opacity-50 cursor-pointer pointer-events-auto scale-75 md:scale-100"
          animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
          whileHover={{ scale: 1.5, rotate: 90, opacity: 1 }}
          transition={{ repeat: Infinity, duration: 7 }}
        >
          <svg width="150" height="150" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
            <path d="M20,50 L80,50 M50,20 L50,80" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="10" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Middle Right Doodle */}
        <motion.div 
          className="absolute top-[50%] right-[8%] text-[#FF1493] opacity-50 cursor-pointer pointer-events-auto"
          animate={{ scale: [1, 1.1, 1] }}
          whileHover={{ scale: 1.5, rotate: 15, opacity: 1 }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100">
            <path d="M20,50 Q50,20 80,50 T20,50" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5 5" />
            <circle cx="50" cy="50" r="6" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Bottom Left Scribble */}
        <motion.div 
          className="absolute bottom-[25%] left-[10%] text-[#FFC21A] opacity-50 cursor-pointer pointer-events-auto"
          animate={{ rotate: [0, -10, 10, 0] }}
          whileHover={{ scale: 1.3, rotate: -45, opacity: 1 }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </motion.div>

        {/* Bottom Right Note */}
        <motion.div 
          className="absolute bottom-[1.5%] md:bottom-[5%] right-[5%] md:right-[12%] rotate-[8deg]"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-hand text-xl md:text-3xl text-[#8b0836] opacity-80">"The journey continues!"</p>
        </motion.div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-6 flex flex-col items-center z-20">

        {/* 1. Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-2xl mb-32 md:mb-48 relative"
        >
          {/* Decorative marker scribble behind title */}
          <div className="absolute -inset-4 bg-[#FF1493]/10 blur-xl rounded-full z-[-1]" />
          
          <div className="bg-white p-10 md:p-16 shadow-2xl border border-gray-100 relative rotate-[-1deg] mx-auto text-center">
            <Tape className="absolute -top-4 left-1/2 -translate-x-1/2" rotation={2} />
            <h2 className="font-serif text-5xl md:text-8xl font-bold tracking-tighter mb-6 text-[#8b0836] leading-none">
              Beyond<br/>Events.
            </h2>
            <p className="font-hand text-2xl md:text-4xl text-gray-600">We are building a legacy.</p>
          </div>
        </motion.div>

        {/* 2. Mission */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 mb-32 md:mb-48">
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -10 }}
            whileInView={{ opacity: 1, x: 0, rotate: -4 }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="w-72 md:w-96 shrink-0 relative"
          >
            <div className="polaroid inline-block w-full">
              <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" rotation={4} />
              <div className="relative overflow-hidden bg-[#CFF7FF] aspect-[4/5] w-full">
                <img src="/main/Mission.png" alt="Mission" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <p className="font-hand text-2xl mt-4 text-center text-gray-800">Hi!</p>
            </div>

            {/* Paper clip decoration - Moved inside scaling container */}
            <div className="absolute -top-6 -left-4 w-12 h-12 text-gray-400 -rotate-12 z-20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="bg-[#FFC21A] p-8 md:p-12 shadow-xl rotate-[2deg] max-w-lg relative z-10"
          >
            <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" rotation={-2} />
            <h3 className="font-serif font-bold text-3xl md:text-4xl mb-4 uppercase tracking-tight text-black">The Mission</h3>
            <p className="font-sans text-base md:text-lg leading-relaxed text-black/90 font-medium">
              To bridge the gap between students and faculty, creating a vibrant, inclusive, and unforgettable high school experience. We exist to turn student voices into tangible action.
            </p>
            {/* Marker highlight effect */}
            <div className="absolute bottom-6 right-6 w-16 h-4 bg-[#FF1493]/30 -rotate-6 mix-blend-multiply" />
            
            {/* Handwritten annotation */}
            <div className="absolute -bottom-16 -right-8 hidden lg:block rotate-6">
              <p className="font-hand text-xl text-[#024a70] opacity-70">"Action is our middle name!"</p>
            </div>
          </motion.div>
        </div>

        {/* 3. Vision */}
        <div className="w-full flex flex-col md:flex-row-reverse items-center justify-center gap-12 md:gap-20 mb-32 md:mb-48">
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 10 }}
            whileInView={{ opacity: 1, x: 0, rotate: 4 }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="w-72 md:w-96 shrink-0 relative"
          >
            <div className="polaroid inline-block w-full">
              <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" rotation={-4} />
              <div className="relative overflow-hidden bg-[#F8D5E0] aspect-[4/5] w-full">
                <img src="public/main/Vision.png" alt="Vision" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <p className="font-hand text-2xl mt-4 text-center text-gray-800">Hey!</p>
            </div>

            {/* Paper clip decoration - Moved inside scaling container */}
            <div className="absolute -top-6 -right-4 w-12 h-12 text-gray-400 rotate-45 z-20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="bg-white p-8 md:p-12 shadow-2xl rotate-[-2deg] max-w-lg relative border border-gray-100 z-10"
          >
            <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" rotation={3} />
            <h3 className="font-serif font-bold text-3xl md:text-4xl mb-4 uppercase tracking-tight text-[#024a70]">The Vision</h3>
            <p className="font-serif text-xl md:text-2xl italic leading-relaxed text-gray-800">
              "A school where every voice is heard, every idea is valued, and every student belongs. We don't just plan events; we build culture."
            </p>
            {/* Marker highlight effect */}
            <div className="absolute top-10 left-6 w-20 h-4 bg-[#00FFFF]/30 rotate-3 mix-blend-multiply" />

            {/* Handwritten annotation */}
            <div className="absolute -top-12 -left-12 hidden lg:block -rotate-12">
              <p className="font-hand text-xl text-[#8b0836] opacity-70">"Building a legacy together."</p>
            </div>
          </motion.div>
        </div>

        {/* 4. Manifesto */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl relative"
        >
          {/* Decorative marker scribble behind manifesto */}
          <div className="absolute -inset-8 bg-[#FFC21A]/20 blur-2xl rounded-full z-[-1]" />

          <div className="bg-[#fdfbf7] p-10 md:p-20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-200 rotate-[0.5deg] relative">
            <Tape className="absolute -top-4 left-1/4 -translate-x-1/2" rotation={-3} />
            <Tape className="absolute -bottom-4 right-1/4 -translate-x-1/2" rotation={4} />

            <h3 className="font-sans text-sm font-bold uppercase tracking-[0.3em] text-gray-400 mb-8 text-center">Our Promise</h3>

            <p className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight md:leading-[1.2] text-center text-black font-medium">
              We are a collective of passionate individuals dedicated to elevating the student experience.
              <br/><br/>
              <span className="text-[#8b0836] italic relative inline-block">
                We listen, we act, and we inspire.
              </span>
            </p>

            <div className="mt-12 flex justify-center relative">
              <p className="font-hand text-4xl md:text-5xl text-[#024a70] opacity-80 rotate-[-2deg]">#WeAreJNY</p>
            </div>
          </div>
        </motion.div>

      </div>
      
      {/* Transition Elements bridging to LatestEvents */}
      <div className="absolute bottom-[-40px] left-[15%] md:left-[25%] z-30">
        <Tape rotation={-8} className="w-32 md:w-48" />
      </div>
      <div className="absolute bottom-[-60px] right-[10%] md:right-[20%] z-30 text-[#00FFFF] opacity-60 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <path d="M10,10 Q50,90 90,10" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="6 6" />
          <circle cx="90" cy="10" r="4" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
};

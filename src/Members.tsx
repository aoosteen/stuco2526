import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Tape } from './components/Tape';
import Lenis from 'lenis';

const boardMembers = [
  {
    name: 'Alex Chen',
    role: 'President',
    bio: "Hey! I'm Alex. I'm obsessed with making our school a better place, one crazy idea at a time. When I'm not running meetings, you can find me trying to perfect my latte art or reading sci-fi.",
    events: ['Winter Gala 2026', 'Spring Leadership Summit'],
    color: 'bg-[#b8e6fe]',
    rotation: -2,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Sarah Jenkins',
    role: 'Vice President',
    bio: "I'm the one who actually reads the emails. Passionate about student wellness and making sure everyone's voice is heard. Also, I have a slight addiction to iced coffee.",
    events: ['Mental Health Awareness Week', 'Student Feedback Forums'],
    color: 'bg-[#ffbd9b]',
    rotation: 3,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Marcus Rivera',
    role: 'Secretary',
    bio: "Notes, schedules, and organization are my jam. I keep the council running smoothly. In my free time, I'm probably playing guitar or rewatching old movies.",
    events: ['Club Rush Week', 'End of Year Banquet'],
    color: 'bg-[#fff9ef]',
    rotation: -1,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Emma Watson',
    role: 'Treasurer',
    bio: "Numbers don't lie. I make sure we have the budget to do awesome things. I love math, baking, and finding the best deals online.",
    events: ['Fundraising Drive', 'Charity Bake Sale'],
    color: 'bg-[#b8e6fe]',
    rotation: 2,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'David Kim',
    role: 'Head of Events',
    bio: "If there's a party, I planned it. I love bringing people together and creating memorable experiences. Always open to new event ideas!",
    events: ['Homecoming Dance', 'Talent Show 2026'],
    color: 'bg-[#ffbd9b]',
    rotation: -3,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  }
];

const levelReps = [
  { 
    grade: 'Grade 12', 
    name: 'Jason Lee', 
    bio: 'Senior year is the best year! Making every moment count before graduation.', 
    events: ['Graduation Ball', 'Senior Prank Day'],
    color: 'bg-[#fff9ef]', 
    rotation: 1, 
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    grade: 'Grade 11', 
    name: 'Chloe Tan', 
    bio: 'Junior year grind is real, but we\'re making it fun together.', 
    events: ['Prom Committee', 'Junior-Senior Night'],
    color: 'bg-[#b8e6fe]', 
    rotation: -2, 
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    grade: 'Grade 10', 
    name: 'Ryan Wong', 
    bio: 'Sophomore life is sweet. Building bridges across the grade.', 
    events: ['Sophomore Social', 'Inter-class Sports'],
    color: 'bg-[#ffbd9b]', 
    rotation: 2, 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' 
  },
  { 
    grade: 'Grade 9', 
    name: 'Mia Chen', 
    bio: 'Freshman year adventures! Starting our high school story right.', 
    events: ['Freshman Orientation', 'Welcome Picnic'],
    color: 'bg-[#fff9ef]', 
    rotation: -1, 
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop' 
  },
];

const Sticker = ({ text, color, className }: { text: string, color: string, className?: string }) => (
  <motion.div
    initial={{ scale: 0, rotate: -20 }}
    whileInView={{ scale: 1, rotate: (Math.random() * 20) - 10 }}
    viewport={{ once: true }}
    className={`px-4 py-2 ${color} border-2 border-black font-hand text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] whitespace-nowrap ${className}`}
  >
    {text}
  </motion.div>
);

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

const HandDrawnArrow = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: globalScroll } = useScroll();
  const progressOpacity = useTransform(globalScroll, [0.9, 0.95], [1, 0]);

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, mass: 0.5 });

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

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fff9ef] text-[#000000] font-sans selection:bg-[#FFC21A] selection:text-[#000000] overflow-x-hidden">
      <div className="noise-overlay" />
      <Navbar />

      {/* Story Progress Indicator */}
      <motion.div 
        style={{ opacity: progressOpacity }}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-center gap-4"
      >
        <div className="font-hand text-sm rotate-90 mb-8 opacity-40">The Story So Far</div>
        <div className="w-[2px] h-64 bg-black/10 relative">
          <motion.div 
            style={{ scaleY: smoothProgress }}
            className="absolute inset-0 bg-[#a30037] origin-top"
          />
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative px-6 text-center" data-cursor="magic">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <h1 className="font-serif text-[15vw] md:text-[12vw] leading-[0.8] font-black tracking-tighter text-[#1a1a1a] mb-4">
            OUR<br/>STORY.
          </h1>
          <div className="absolute -top-10 -right-10 md:-right-20 rotate-12">
            <Tape rotation={15} className="w-32 md:w-48 opacity-90" />
          </div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-hand text-3xl md:text-4xl text-[#a30037] max-w-2xl mt-8"
        >
          Every chapter of our school life is written by those who lead. Meet the authors of this year's journey.
        </motion.p>
        <ScribbleLine className="w-48 mx-auto mt-8 text-[#005986]" />

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="font-sans text-[10px] uppercase tracking-widest opacity-40">Scroll to read</span>
          <div className="w-[1px] h-12 bg-black/10" />
        </motion.div>
      </section>

      {/* The Board Section */}
      <section className="py-32 px-6 md:px-20 max-w-7xl mx-auto relative overflow-hidden">
        {/* Decorative Background Text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full pointer-events-none opacity-[0.03] select-none z-0 overflow-hidden">
          <motion.div 
            style={{ x: useTransform(smoothProgress, [0, 1], [0, 600]) }}
            className="font-serif text-[20vw] font-black whitespace-nowrap leading-none text-black flex gap-20"
          >
            <span>THE LEADERS</span>
            <span>THE VISIONARIES</span>
            <span>THE MAKERS</span>
          </motion.div>
        </div>
        <div className="flex items-center gap-6 mb-24 relative z-10">
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter">The Board.</h2>
          <div className="flex-1 h-[2px] bg-black/10 relative">
            <motion.div 
              style={{ scaleX: smoothProgress }}
              className="absolute inset-0 bg-[#a30037] origin-left"
            />
          </div>
          <span className="font-hand text-2xl text-[#a30037]">Major Positions</span>
        </div>

        <div className="space-y-40 md:space-y-64">
          {boardMembers.map((member, i) => (
            <div key={member.name} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24 relative`}>
              {/* Connector Lines */}
              {i < boardMembers.length - 1 && (
                <div className={`absolute -bottom-48 ${i % 2 === 0 ? 'left-[20%]' : 'right-[20%]'} hidden md:block text-[#a30037] opacity-20`}>
                  <svg width="200" height="300" viewBox="0 0 200 300">
                    <motion.path
                      d={i % 2 === 0 ? "M0,0 Q100,150 0,300" : "M200,0 Q100,150 200,300"}
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
                  <Tape rotation={member.rotation * -3} className="absolute -top-6 left-1/2 -translate-x-1/2 w-40 opacity-90" />
                  
                  <div className="flex flex-col gap-8">
                    <div className="w-full aspect-square overflow-hidden border-2 border-black shadow-[10px_10px_0px_rgba(0,0,0,0.1)]">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-[1px] flex-1 bg-black/10" />
                      </div>
                      <h3 className="font-serif text-4xl md:text-6xl font-bold mb-2">{member.name}</h3>
                      <p className="font-sans text-sm uppercase tracking-[0.3em] font-black text-[#a30037] mb-6">{member.role}</p>
                      <p className="font-hand text-2xl md:text-3xl leading-relaxed mb-8">"{member.bio}"</p>
                      
                      {/* Random Stickers for Board Members */}
                      {i === 0 && <Sticker text="The Visionary" color="bg-[#FFC21A]" className="absolute -top-10 -right-4 rotate-12" />}
                      {i === 1 && <Sticker text="The Heart" color="bg-[#ffbd9b]" className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90" />}
                      {i === 2 && <Sticker text="The Brains" color="bg-[#b8e6fe]" className="absolute -bottom-8 right-10 rotate-3" />}
                      {i === 3 && <Sticker text="The Numbers" color="bg-[#fff9ef]" className="absolute top-20 -right-10 rotate-12" />}
                      {i === 4 && <Sticker text="The Energy" color="bg-[#FF1493] text-white" className="absolute -bottom-4 -left-4 -rotate-6" />}

                      <div className="pt-6 border-t border-black/10">
                        <h4 className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-40 mb-4">Academic Year Events</h4>
                        <div className="flex flex-wrap gap-3">
                          {member.events.map(event => (
                            <span key={event} className="px-4 py-2 bg-white/40 border border-black/10 rounded-full text-xs font-bold">
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
                    {i === 0 && "The vision starts here. Leading with purpose and a bit of caffeine."}
                    {i === 1 && "The glue that holds us together. Balancing logic with empathy."}
                    {i === 2 && "The record keeper. Every detail matters in our story."}
                    {i === 3 && "Fueling the dreams. Making sure every cent counts."}
                    {i === 4 && "The architect of joy. Creating moments that last forever."}
                  </div>
                  <HandDrawnArrow className={`w-24 h-24 mt-8 ${i % 2 === 0 ? 'rotate-90' : '-rotate-90 scale-x-[-1]'} text-[#a30037] opacity-40`} />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Level Representatives Section */}
      <section className="py-48 bg-[#1a1a1a] text-[#fff9ef] relative overflow-hidden">
        <div className="noise-overlay opacity-20" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
          <div className="text-center mb-32">
            <h2 className="font-serif text-6xl md:text-9xl font-black tracking-tighter mb-6">LEVEL REPS.</h2>
            <p className="font-hand text-3xl text-[#ffbd9b]">The pulse of every grade level.</p>
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
                  <Tape rotation={rep.rotation * -5} className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 opacity-80" />
                  
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 overflow-hidden border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.1)] grayscale group-hover:grayscale-0 transition-all duration-500">
                      <img src={rep.image} alt={rep.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    
                    <div className="text-center sm:text-left">
                      <div className="font-sans text-[10px] uppercase tracking-widest font-black text-[#a30037] mb-2">{rep.grade}</div>
                      <h3 className="font-serif text-3xl font-bold mb-3">{rep.name}</h3>
                      <p className="font-hand text-xl md:text-2xl leading-tight mb-4">"{rep.bio}"</p>
                      
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {rep.events.map(event => (
                          <span key={event} className="px-3 py-1 bg-black/5 border border-black/10 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements for each rep */}
                  {i === 0 && <Sticker text="Class of 2026" color="bg-[#FFC21A]" className="absolute -bottom-4 -right-4 rotate-6" />}
                  {i === 1 && <Sticker text="Junior Power" color="bg-[#b8e6fe]" className="absolute -top-4 -left-4 -rotate-12" />}
                  {i === 2 && <Sticker text="Rising Stars" color="bg-[#ffbd9b]" className="absolute -bottom-6 left-10 rotate-3" />}
                  {i === 3 && <Sticker text="New Chapter" color="bg-[#fff9ef]" className="absolute top-1/2 -right-8 -translate-y-1/2 rotate-90" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full pointer-events-none opacity-[0.05] select-none z-0">
          <motion.div 
            style={{ x: useTransform(smoothProgress, [0, 1], [0, -500]) }}
            className="font-serif text-[25vw] font-black whitespace-nowrap leading-none text-[#ffbd9b] flex gap-20"
          >
            <span>COMMUNITY</span>
            <span>UNITY</span>
            <span>SPIRIT</span>
          </motion.div>
        </div>
      </section>

      {/* Footer Storytelling */}
      <section className="py-32 px-6 text-center relative">
        <HandDrawnArrow className="w-32 h-32 mx-auto mb-12 rotate-180 text-[#a30037] opacity-20" />
        <h2 className="font-serif text-4xl md:text-6xl font-bold tracking-tighter mb-8">Ready to be part of the story?</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#a30037] text-white px-12 py-6 font-sans uppercase tracking-[0.3em] font-black hover:bg-black transition-colors hover-trigger"
        >
          Join the Council
        </motion.button>
      </section>

      {/* Background Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Additional Decorative Background Text */}
        <div className="absolute top-[85%] left-0 w-full pointer-events-none opacity-[0.03] select-none z-0 overflow-hidden">
          <motion.div 
            style={{ x: useTransform(smoothProgress, [0, 1], [0, 800]) }}
            className="font-serif text-[25vw] font-black whitespace-nowrap leading-none text-black flex gap-20"
          >
            <span>THE STORY</span>
            <span>THE LEGACY</span>
            <span>THE FUTURE</span>
          </motion.div>
        </div>
        <motion.div 
          style={{ y: useTransform(smoothProgress, [0, 1], [0, -200]) }}
          className="absolute top-[15%] right-[10%] opacity-10"
        >
          <svg width="200" height="200" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#FF1493" strokeWidth="1" strokeDasharray="5 5" />
          </svg>
        </motion.div>
        <motion.div 
          style={{ y: useTransform(smoothProgress, [0, 1], [0, 400]) }}
          className="absolute top-[70%] right-[5%] opacity-10"
        >
          <svg width="120" height="120" viewBox="0 0 100 100">
            <path d="M50,10 Q90,50 50,90 Q10,50 50,10" fill="none" stroke="#FFC21A" strokeWidth="1" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}


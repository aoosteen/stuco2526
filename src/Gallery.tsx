import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Tape } from './components/Tape';
import Lenis from 'lenis';
import { Calendar } from 'lucide-react';

// Mock CMS Data
const galleryData = [
  {
    term: "Term 1",
    theme: "New Beginnings",
    description: "Kicking off the academic year with energy, new faces, and big dreams.",
    color: "text-[#a30037]",
    events: [
      {
        id: 'e1',
        title: "Welcome Back Picnic",
        date: "Aug 15, 2025",
        description: "Sun, snacks, and smiles as we welcomed everyone back to campus. The perfect start to our journey.",
        image: "https://images.unsplash.com/photo-1523580494112-071d1694035c?q=80&w=800&auto=format&fit=crop",
        bgColor: "bg-[#ffbd9b]",
        rotation: -2
      },
      {
        id: 'e2',
        title: "Club Rush Week",
        date: "Sep 05, 2025",
        description: "Over 50 clubs showcasing their passions. The courtyard was buzzing with excitement and sign-ups!",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
        bgColor: "bg-[#b8e6fe]",
        rotation: 3
      }
    ]
  },
  {
    term: "Term 2",
    theme: "Building Momentum",
    description: "Finding our rhythm, pushing through challenges, and celebrating our community.",
    color: "text-[#005986]",
    events: [
      {
        id: 'e3',
        title: "Halloween Spooktacular",
        date: "Oct 31, 2025",
        description: "Haunted hallways, costume contests, and way too much candy. A night to remember!",
        image: "https://images.unsplash.com/photo-1508362522040-e54f5c7110e5?q=80&w=800&auto=format&fit=crop",
        bgColor: "bg-[#fff9ef]",
        rotation: -1
      },
      {
        id: 'e4',
        title: "Winter Gala 2025",
        date: "Dec 12, 2025",
        description: "A magical evening under the stars. Everyone dressed to impress for our annual winter celebration.",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
        bgColor: "bg-[#FFC21A]",
        rotation: 2
      }
    ]
  },
  {
    term: "Term 3",
    theme: "Spring Awakening",
    description: "New projects blossoming and the spirit of giving back taking center stage.",
    color: "text-[#FF1493]",
    events: [
      {
        id: 'e5',
        title: "Charity Bake Sale",
        date: "Feb 20, 2026",
        description: "Raising funds for the local shelter. The brownies sold out in 10 minutes flat!",
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop",
        bgColor: "bg-[#ffbd9b]",
        rotation: -3
      },
      {
        id: 'e6',
        title: "Mental Health Week",
        date: "Mar 15, 2026",
        description: "Workshops, therapy dogs, and taking a collective breath before exams.",
        image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop",
        bgColor: "bg-[#b8e6fe]",
        rotation: 1
      }
    ]
  },
  {
    term: "Term 4",
    theme: "The Grand Finale",
    description: "Saying our goodbyes, passing the torch, and leaving a legacy behind.",
    color: "text-[#a30037]",
    events: [
      {
        id: 'e7',
        title: "Spring Sports Festival",
        date: "May 10, 2026",
        description: "Fierce competition, house pride, and unforgettable moments on the field.",
        image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=800&auto=format&fit=crop",
        bgColor: "bg-[#fff9ef]",
        rotation: 2
      },
      {
        id: 'e8',
        title: "Senior Farewell Prom",
        date: "Jun 05, 2026",
        description: "Tears, laughter, and one last dance. A beautiful send-off for the Class of 2026.",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
        bgColor: "bg-[#FF1493]",
        rotation: -2
      }
    ]
  }
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

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

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
    <div ref={containerRef} className="min-h-screen bg-[#fff9ef] text-[#000000] font-sans selection:bg-[#FFC21A] selection:text-[#000000] overflow-x-hidden relative">
      <div className="noise-overlay" />
      <Navbar />

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center px-6 md:px-20 max-w-7xl mx-auto relative text-center" data-cursor="magic">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <h1 className="font-serif text-[12vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter text-[#1a1a1a] mb-6">
            MEMORY<br/>LANE.
          </h1>
          <p className="font-hand text-2xl md:text-4xl text-[#a30037] max-w-2xl mx-auto">
            A scrapbook of our favorite moments, term by term.
          </p>
          <ScribbleLine className="w-48 mx-auto mt-8 text-[#FFC21A]" />
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
        
        {/* Continuous Timeline Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-black/10 -translate-x-1/2 z-0 hidden md:block">
          <motion.div 
            style={{ scaleY: smoothProgress }}
            className="absolute inset-0 bg-[#FF1493] origin-top"
          />
        </div>

        <div className="flex flex-col gap-32 md:gap-48 relative z-10">
          {galleryData.map((termData, termIndex) => (
            <div key={termData.term} className="relative">
              
              {/* Term Header */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center mb-16 md:mb-24 relative bg-[#fff9ef] py-8 z-10"
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
                {termData.events.map((event, eventIndex) => {
                  const isEven = eventIndex % 2 === 0;
                  return (
                    <Link to={`/gallery/${event.id}`} key={event.id} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 relative group/link cursor-pointer`}>
                      
                      {/* Timeline Dot (Desktop) */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#fff9ef] border-4 border-[#FF1493] rounded-full z-20 hidden md:block transition-transform duration-300 group-hover/link:scale-150" />

                      {/* Image Side */}
                      <motion.div 
                        initial={{ opacity: 0, x: isEven ? -50 : 50, rotate: isEven ? -10 : 10 }}
                        whileInView={{ opacity: 1, x: 0, rotate: event.rotation }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="w-full md:w-1/2 relative group"
                      >
                        <div className={`p-4 md:p-6 border-2 border-black ${event.bgColor} shadow-[15px_15px_0px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover/link:scale-[1.02]`}>
                          <Tape rotation={event.rotation * -4} className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 opacity-90 z-20" />
                          <div className="aspect-[4/3] overflow-hidden border-2 border-black relative">
                            <img 
                              src={event.image} 
                              alt={event.title} 
                              className="w-full h-full object-cover grayscale group-hover/link:grayscale-0 transition-all duration-700"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                        {/* Random Sticker */}
                        {eventIndex === 0 && <Sticker text="Core Memory" color="bg-[#FFC21A]" className={`absolute -bottom-4 ${isEven ? '-right-4' : '-left-4'} rotate-12 z-30`} />}
                        {eventIndex === 1 && <Sticker text="So Fun!" color="bg-[#FF1493] text-white" className={`absolute -top-4 ${isEven ? '-left-4' : '-right-4'} -rotate-12 z-30`} />}
                      </motion.div>

                      {/* Content Side */}
                      <motion.div 
                        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`w-full md:w-1/2 flex flex-col justify-center ${isEven ? 'md:text-left' : 'md:text-right'}`}
                      >
                        <div className={`flex items-center gap-2 mb-4 font-sans text-[10px] uppercase tracking-widest font-bold opacity-60 ${isEven ? 'justify-start' : 'justify-end'}`}>
                          <Calendar size={14} />
                          <span>{event.date}</span>
                        </div>
                        <h4 className="font-serif text-3xl md:text-5xl font-bold mb-4 leading-tight group-hover/link:text-[#FF1493] transition-colors">{event.title}</h4>
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
          ))}
        </div>
      </section>

      {/* Decorative Background Text */}
      <div className="absolute top-[30%] left-0 w-full pointer-events-none opacity-[0.03] select-none z-0 overflow-hidden">
        <motion.div 
          style={{ x: useTransform(smoothProgress, [0, 1], [0, -1000]) }}
          className="font-serif text-[25vw] font-black whitespace-nowrap leading-none text-[#FF1493] flex gap-20"
        >
          <span>MOMENTS</span>
          <span>LAUGHTER</span>
          <span>LEGACY</span>
        </motion.div>
      </div>
    </div>
  );
}

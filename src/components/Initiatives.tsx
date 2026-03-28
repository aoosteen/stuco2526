import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Polaroid } from './Polaroid';
import { Tape } from './Tape';

const initiatives = [
  {
    id: 1,
    title: "Winter Gala",
    desc: "Organizing the annual winter gala, bringing together over 500 students for a night of celebration and community building.",
    img: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=2070",
    rotation: -4,
    caption: "A night to remember"
  },
  {
    id: 2,
    title: "Sports Fest",
    desc: "A week-long inter-house sports competition promoting physical wellness, teamwork, and school spirit.",
    img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070",
    rotation: 6,
    caption: "House pride!"
  },
  {
    id: 3,
    title: "Charity Drive",
    desc: "Partnering with local NGOs to raise funds and awareness, teaching students the value of giving back.",
    img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2049",
    rotation: -2,
    caption: "Giving back"
  }
];

export const Initiatives = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} id="initiatives" className="pt-48 pb-32 bg-[#1c1917] text-[#ffffff] relative overflow-hidden z-10">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
      
      {/* Background Doodles */}
      <div className="absolute top-[10%] right-[5%] opacity-20 pointer-events-none">
        <svg width="300" height="300" viewBox="0 0 100 100">
           <path d="M10,50 Q50,10 90,50 T10,90" fill="none" stroke="#FFC21A" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>
      <div className="absolute bottom-[20%] left-[5%] opacity-10 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 100 100">
           <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth="0.5" />
           <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="px-6 md:px-20 max-w-7xl mx-auto mb-16 relative z-10">
        <motion.div style={{ y: y2 }} className="flex flex-col md:flex-row items-start md:items-end gap-8">
          <div className="relative">
            <h2 className="font-serif text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">Initiatives.</h2>
            <div className="relative inline-block mt-4">
              <p className="font-sans uppercase tracking-widest text-[#FFC21A] text-sm md:text-base">Moments we've created</p>
            </div>
          </div>
          
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 12 }}
            viewport={{ once: true }}
            className="hidden md:block mb-4"
          >
            <div className="px-6 py-3 bg-[#FF1493] text-white font-hand text-2xl border-2 border-white shadow-[8px_8px_0px_rgba(255,255,255,0.1)] rotate-12">
              Our Impact!
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-6 flex flex-col gap-32 md:gap-48 pb-20">
        {initiatives.map((item, index) => {
          const isEven = index % 2 !== 0;
          const yTransform = index === 0 ? y1 : index === 1 ? y3 : y1;
          
          return (
            <div key={item.id} className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-20 relative z-10`}>
              
              {/* Image Side */}
              <motion.div 
                style={{ y: yTransform }}
                className="w-full md:w-1/2 flex justify-center relative"
              >
                <Polaroid src={item.img} alt={item.title} rotation={item.rotation} caption={item.caption} className="w-[85%] md:w-[75%]" />
                
                {/* Decorative elements per item */}
                {index === 0 && (
                  <motion.div 
                    className="absolute -bottom-12 -right-8 text-[#00FFFF] opacity-80 rotate-12"
                    animate={{ rotate: [12, 20, 12] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </motion.div>
                )}
                {index === 1 && (
                  <motion.div 
                    className="absolute -top-12 -left-8 text-[#FF1493] opacity-80 -rotate-12"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </motion.div>
                )}
                {index === 2 && (
                  <motion.div 
                    className="absolute -bottom-10 -left-10 text-[#FFC21A] opacity-80 rotate-45"
                    animate={{ rotate: [45, 90, 45] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                  >
                    <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </motion.div>
                )}
              </motion.div>

              {/* Text Side */}
              <motion.div 
                initial={{ opacity: 0, x: isEven ? 50 : -50, rotate: isEven ? 5 : -5 }}
                whileInView={{ opacity: 1, x: 0, rotate: isEven ? 2 : -2 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-full md:w-1/2 relative"
              >
                <div className="bg-[#ffffff] text-black p-8 md:p-12 shadow-2xl relative border border-gray-200">
                  <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 z-10" rotation={isEven ? -3 : 3} />
                  <Tape className="absolute -bottom-4 right-8 z-10" rotation={isEven ? 4 : -4} />
                  
                  <h3 className="font-serif font-bold text-3xl md:text-5xl mb-6 text-[#8b0836]">{item.title}</h3>
                  <p className="font-sans text-lg md:text-xl leading-relaxed opacity-90">{item.desc}</p>
                  
                  {/* Scribble underline */}
                  <div className="mt-8 opacity-30">
                    <svg width="100%" height="20" viewBox="0 0 200 20" preserveAspectRatio="none">
                      <path d="M0 10 Q 50 20, 100 10 T 200 10" fill="none" stroke="#000" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

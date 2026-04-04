import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Polaroid } from './Polaroid';
import { Tape } from './Tape';
import { urlFor } from '../lib/sanity';
import { cn } from '../lib/utils';
import { useLatestGalleryEvents } from '../hooks/useGallery';
import { ArrowRight } from 'lucide-react';
import { Lightbox } from './Lightbox';
import { PageTransitionLink } from './PageTransitionLink';

const MotionLink = motion.create(PageTransitionLink);

export const HomeLatestEvents = () => {
  const { events } = useLatestGalleryEvents(3);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <>
    <section ref={containerRef} id="latest-events" className="pt-48 pb-32 bg-[#1c1917] text-[#ffffff] relative overflow-hidden z-10">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
      
      {/* Background Doodles */}
      <div className="absolute top-[10%] right-[5%] opacity-20 pointer-events-none">
        <svg width="300" height="300" viewBox="0 0 100 100">
           <path d="M10,50 Q50,10 90,50 T10,90" fill="none" stroke="currentColor" className="text-accent-yellow" strokeWidth="1" strokeDasharray="4 4" />
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
            <h2 className="font-serif text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">Latest Events.</h2>
            <div className="relative inline-block mt-4">
              <p className="font-sans uppercase tracking-widest text-accent-yellow text-sm md:text-base">Moments we've created</p>
            </div>
          </div>
          
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 12 }}
            viewport={{ once: true }}
            className="hidden md:block mb-4"
          >
            <div className="px-6 py-3 bg-accent-pink text-white font-hand text-2xl border-2 border-white shadow-[8px_8px_0px_rgba(255,255,255,0.1)] rotate-12">
              Our Impact!
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-6 flex flex-col gap-32 md:gap-48 pb-20">
        {events.map((item, index) => {
          const isEven = index % 2 !== 0;
          const yTransform = index === 0 ? y1 : index === 1 ? y3 : y1;
          const stableRotation = [ -3, 2, -2, 3 ][index % 4];
          
          return (
            <MotionLink 
              to={`/gallery/${item._id}`}
              key={item._id} 
              className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-20 relative z-10 group cursor-pointer`}
            >
              
              {/* Image Side */}
              <motion.div 
                style={{ y: yTransform }}
                whileHover={{ scale: 1.05 }}
                className="w-full md:w-1/2 flex justify-center relative"
              >
                <Polaroid 
                  src={item.coverPhoto ? urlFor(item.coverPhoto).url() : ''} 
                  alt={item.title} 
                  rotation={stableRotation} 
                  caption={item.shortWords || "Memory"} 
                  className="w-[85%] md:w-[75%]" 
                  captionClassname={isEven ? 'text-accent-pink' : 'text-accent-yellow'}
                  onImageClick={(data) => setSelectedImage({ url: data.src, alt: data.alt })}
                />
                
                {/* Decorative elements per item */}
                {index === 0 && (
                  <motion.div 
                    className="absolute -bottom-12 -right-8 text-[#00FFFF] opacity-80 rotate-12"
                    animate={{ rotate: [12, 20, 12] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  </motion.div>
                )}
                {index === 1 && (
                  <motion.div 
                    className="absolute -top-12 -left-8 text-accent-pink opacity-80 -rotate-12"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </motion.div>
                )}
                {index === 2 && (
                  <motion.div 
                    className="absolute -bottom-10 -left-10 text-accent-yellow opacity-80 rotate-45"
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
                <div className="bg-[#ffffff] text-black p-8 md:p-12 shadow-2xl relative border border-gray-200 transition-shadow group-hover:shadow-accent-pink/20">
                  <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 z-10" rotation={isEven ? -3 : 3} />
                  <Tape className="absolute -bottom-4 right-8 z-10" rotation={isEven ? 4 : -4} />
                  
                  <h3 className={cn("font-serif font-bold text-3xl md:text-5xl mb-6 text-accent-red transition-colors", isEven ? "group-hover:text-accent-pink" : "group-hover:text-accent-yellow")}>{item.title}</h3>
                  <p className="font-sans text-lg md:text-xl leading-relaxed opacity-90">{item.description}</p>
                  
                  <div className="mt-8 flex items-center gap-2 font-sans text-xs uppercase tracking-widest font-black text-accent-red group-hover:translate-x-2 transition-transform h-5">
                    View Gallery <span>→</span>
                  </div>
                </div>
              </motion.div>
            </MotionLink>
          );
        })}
      </div>
      <div className="mt-10 flex justify-center relative z-20">
        <PageTransitionLink to="/gallery">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-accent-yellow text-black px-8 py-4 md:px-12 md:py-6 font-sans uppercase tracking-[0.2em] font-black border-2 border-black shadow-[8px_8px_0px_rgba(255,255,255,1)] hover:shadow-[12px_12px_0px_rgba(255,255,255,1)] transition-all hover-trigger flex items-center gap-4 text-sm md:text-base hover:scale-105"
          >
            View Event Gallery <ArrowRight size={24} />
          </motion.button>
        </PageTransitionLink>
      </div>
    </section>
      <Lightbox 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        src={selectedImage?.url || ''} 
        alt={selectedImage?.alt || ''} 
      />
    </>
  );
};

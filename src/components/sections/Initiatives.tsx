import React from 'react';
import { Polaroid } from '../ui/Polaroid';

export const Initiatives = () => {
  return (
    <section id="initiatives" data-cursor="drag" className="py-32 bg-[#024a70] text-[#ffffff]   relative">
      <div className="px-6 md:px-20 max-w-7xl mx-auto mb-20">
        <h2 className="font-serif text-6xl md:text-8xl font-bold tracking-tighter text-outline-white">Initiatives</h2>
        <p className="font-sans uppercase tracking-widest mt-4">Moments we've created</p>
      </div>

      <div className="relative w-full overflow-hidden py-10">
        <div className="flex flex-wrap md:flex-nowrap gap-10 md:gap-20 px-6 md:px-20">
          <div className="w-full md:w-[400px] shrink-0 mt-0 md:mt-20">
            <Polaroid 
              src="https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=2070" 
              alt="Prom" 
              rotation={-4} 
              caption="Winter Gala" 
            />
            <p className="mt-8 font-sans text-sm opacity-80 leading-relaxed">
              Organizing the annual winter gala, bringing together over 500 students for a night of celebration and community building.
            </p>
          </div>
          <div className="w-full md:w-[400px] shrink-0">
            <Polaroid 
              src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070" 
              alt="Sports" 
              rotation={6} 
              caption="Sports Fest" 
            />
            <p className="mt-8 font-sans text-sm opacity-80 leading-relaxed">
              A week-long inter-house sports competition promoting physical wellness, teamwork, and school spirit.
            </p>
          </div>
          <div className="w-full md:w-[400px] shrink-0 mt-0 md:mt-32">
            <Polaroid 
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2049" 
              alt="Charity" 
              rotation={-2} 
              caption="Charity Drive" 
            />
            <p className="mt-8 font-sans text-sm opacity-80 leading-relaxed">
              Partnering with local NGOs to raise funds and awareness, teaching students the value of giving back.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

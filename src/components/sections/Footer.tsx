import React from 'react';
import { Mail, Instagram, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer id="contact" className="bg-[#000000] text-[#fff9ef] pt-32 pb-10 px-6 md:px-20 relative overflow-hidden torn-top">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div>
            <h2 className="font-serif text-[12vw] leading-[0.8] tracking-tighter font-black text-outline-white hover:text-[#fff9ef] transition-colors duration-500 cursor-pointer hover-trigger">
              LET'S
            </h2>
            <h2 className="font-serif text-[12vw] leading-[0.8] tracking-tighter font-black">
              TALK.
            </h2>
          </div>
          
          <div className="flex flex-col gap-4 mt-10 md:mt-0">
            <a href="mailto:sc@jny.sch.id" className="hover-trigger flex items-center gap-4 text-xl font-sans uppercase tracking-wider hover:text-[#FFC21A] transition-colors">
              <Mail size={24} /> sc@jny.sch.id
            </a>
            <a href="#" className="hover-trigger flex items-center gap-4 text-xl font-sans uppercase tracking-wider hover:text-[#FFC21A] transition-colors">
              <Instagram size={24} /> @jny.sc
            </a>
            <p className="flex items-center gap-4 text-xl font-sans uppercase tracking-wider opacity-50">
              <MapPin size={24} /> Jakarta, ID
            </p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-sm uppercase tracking-widest opacity-50">© {new Date().getFullYear()} JNY Student Council</p>
          <p className="font-hand text-2xl text-[#a30037]">Made with passion.</p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-[#a30037] rounded-full blur-[100px] opacity-50" />
      <div className="absolute bottom-0 left-20 w-64 h-64 bg-[#005986] rounded-full blur-[120px] opacity-30" />
    </footer>
  );
};

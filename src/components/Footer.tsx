import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Mail, MapPin, Youtube, Music } from 'lucide-react';
import { Tape } from './Tape';

export const Footer = () => {
  return (
    <footer id="contact" data-cursor="hello" className="fixed bottom-0 left-0 w-full h-[100vh] bg-[#ffbd9b] overflow-hidden flex flex-col justify-between p-10 md:p-20 pt-32 md:pt-48 z-0">
      <div className="noise-overlay opacity-30" />
      
      {/* Background Doodles - Repositioned to avoid overlap and improve composition */}
      <div className="absolute top-[25%] right-[5%] text-[#a30037] opacity-20 pointer-events-none rotate-12">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <path d="M10,50 Q30,10 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
      <div className="absolute top-[60%] left-[5%] text-[#005986] opacity-20 pointer-events-none -rotate-12">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
        </svg>
      </div>
      <div className="absolute top-[15%] right-[15%] text-[#FF1493] opacity-20 pointer-events-none rotate-[30deg]">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
      <div className="absolute bottom-[15%] left-[40%] text-black opacity-10 pointer-events-none">
        <svg width="150" height="150" viewBox="0 0 100 100">
          <path d="M20,20 L80,80 M80,20 L20,80" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-16 md:gap-20">
        {/* Left Side: Contact Info */}
        <div className="flex-1">
          <h2 className="font-serif text-6xl md:text-8xl font-black tracking-tighter text-[#1a1a1a] mb-10">SAY<br/>HELLO.</h2>
          
          <div className="flex flex-col gap-8">
            <a href="mailto:jny.sc@example.com" className="hover-trigger flex items-center gap-4 text-lg font-sans uppercase tracking-widest hover:text-[#a30037] transition-colors group">
              <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:border-[#a30037] transition-colors shrink-0">
                <Mail size={18} />
              </div>
              jny.sc@example.com
            </a>
            
            <div className="h-[1px] w-full bg-black/10 my-4" />
            
            <div className="flex flex-wrap gap-8">
              <a href="https://instagram.com/jny.sc" target="_blank" rel="noreferrer" className="hover-trigger flex items-center gap-4 text-lg font-sans uppercase tracking-widest hover:text-[#FF1493] transition-colors group">
                <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:border-[#FF1493] transition-colors shrink-0">
                  <Instagram size={18} />
                </div>
                @jny.sc
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="hover-trigger flex items-center gap-4 text-lg font-sans uppercase tracking-widest hover:text-[#005986] transition-colors group">
                <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:border-[#005986] transition-colors shrink-0">
                  <Youtube size={18} />
                </div>
                YouTube
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="hover-trigger flex items-center gap-4 text-lg font-sans uppercase tracking-widest hover:text-[#a30037] transition-colors group">
                <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:border-[#a30037] transition-colors shrink-0">
                  <Music size={18} />
                </div>
                TikTok
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form (Pinned Note) */}
        <div className="flex-1 w-full max-w-md relative">
          <motion.div 
            initial={{ rotate: -2 }}
            whileHover={{ rotate: 0 }}
            className="bg-[#fff9ef] text-black p-8 md:p-10 shadow-[20px_20px_0px_rgba(0,0,0,0.1)] relative"
          >
            <Tape rotation={-15} className="absolute -top-6 left-10 w-32 opacity-90" />
            <Tape rotation={10} className="absolute -bottom-4 -right-6 w-24 opacity-80" />
            
            <h3 className="font-serif text-3xl font-bold mb-6 border-b-2 border-black pb-2">Drop a message</h3>
            
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-1">
                <label className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-50">Message</label>
                <textarea rows={6} className="bg-transparent border-b border-black/20 py-2 focus:border-black outline-none font-hand text-xl resize-none" placeholder="Write something..." />
              </div>
              <button className="mt-4 bg-black text-white py-4 font-sans uppercase tracking-widest font-bold hover:bg-[#a30037] transition-colors hover-trigger">
                Send Note
              </button>
            </form>
          </motion.div>
          
          {/* Scribble Doodle */}
          <div className="absolute -bottom-12 -left-12 text-[#FF1493] opacity-40 pointer-events-none hidden md:block">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <path d="M10,10 C30,40 70,0 90,50 S10,90 50,70" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Signature */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mt-auto pt-10 border-t border-black/10">
        <p className="font-sans text-xs uppercase tracking-[0.3em] opacity-60 mb-4 md:mb-0">© {new Date().getFullYear()} JNY Student Council</p>
        <p className="font-hand text-2xl md:text-3xl text-[#1a1a1a]">
          Made with <span className="text-[#FF1493] inline-block animate-pulse">♥️</span> by JNY Student Council
        </p>
      </div>
    </footer>
  );
};

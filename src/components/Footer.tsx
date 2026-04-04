import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Tape } from './Tape';
import { FOOTER_LINKS } from "../constants/links";
import Confetti from 'react-confetti';
import { useDeviceDimensions } from '../hooks/useDeviceDimensions';

const SocialLinks = () => (
  <div className="flex flex-col gap-4 lg:gap-8 w-full">
    <a 
      href={FOOTER_LINKS.email.href} 
      data-cursor="arrow"
      className="hover-trigger flex items-center gap-4 text-sm lg:text-lg font-sans uppercase tracking-widest transition-colors group"
      style={{ '--hover-color': FOOTER_LINKS.email.hoverColor } as React.CSSProperties}
    >
      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:border-(--hover-color) transition-colors shrink-0">
        <FOOTER_LINKS.email.icon className="w-4 h-4 lg:w-5 lg:h-5 group-hover:text-(--hover-color) transition-colors" />
      </div>
      <span className="group-hover:text-(--hover-color) transition-colors">
        {FOOTER_LINKS.email.label}
      </span>
    </a>
    
    <div className="h-px w-full bg-black/10 my-1 lg:my-4" />
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-4 lg:gap-8">
      {FOOTER_LINKS.socials.map((link) => (
        <a 
          key={link.label}
          href={link.href} 
          target="_blank" 
          rel="noreferrer" 
          data-cursor="arrow"
          className="hover-trigger flex items-center gap-4 text-sm lg:text-lg font-sans uppercase tracking-widest transition-colors group"
          style={{ '--hover-color': link.hoverColor } as React.CSSProperties}
        >
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:border-(--hover-color) transition-colors shrink-0">
            <link.icon className="w-4 h-4 lg:w-5 lg:h-5 group-hover:text-(--hover-color) transition-colors" />
          </div>
          <span className="group-hover:text-(--hover-color) transition-colors">
            {link.handle}
          </span>
        </a>
      ))}
    </div>
  </div>
);

export const Footer = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [confettiActive, setConfettiActive] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const windowSize = useDeviceDimensions()
  const confettiTimeoutRef = useRef<number | null>(null);

  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = message.trim();

    if (!trimmed) {
      setStatus('error');
      setErrorMessage('Please enter a message before sending.');
      return;
    }

    try {
      setStatus('sending');
      setErrorMessage('');

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const error = typeof payload?.error === 'string' ? payload.error : 'Failed to send message.';
        throw new Error(error);
      }

      setMessage('');
      setStatus('success');
      setConfettiActive(true);
      setConfettiKey((prev) => prev + 1);

      if (confettiTimeoutRef.current) {
        window.clearTimeout(confettiTimeoutRef.current);
      }
      confettiTimeoutRef.current = window.setTimeout(() => {
        setConfettiActive(false);
      }, 8000);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Failed to send message.';
      setStatus('error');
      setErrorMessage(messageText);
    }
  };

  return (
    <footer id="contact" data-cursor="hello" className="relative w-full h-screen bg-[#ffbd9b] overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-20 pt-32 sm:pt-40 lg:pt-48">
      {confettiActive && (
        <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-none absolute inset-0 z-20">
          <Confetti
            key={confettiKey}
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={400}
            recycle={false}
            gravity={0.25}
          />
        </motion.div>
      )}
      <div className="hidden opacity-30" />
      
      {/* Background Doodles - Repositioned to avoid overlap and improve composition */}
      <div className="absolute top-[10%] right-[3%] text-[#8b0836] opacity-20 pointer-events-none rotate-12">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <path d="M10,50 Q30,10 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
      <div className="absolute top-[15%] left-[25%] text-[#024a70] opacity-20 pointer-events-none -rotate-12">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
        </svg>
      </div>
      <div className="absolute top-[40%] right-[2%] text-[#FF1493] opacity-20 pointer-events-none rotate-[30deg]">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
      <div className="absolute top-[12%] left-[45%] text-black opacity-10 pointer-events-none">
        <svg width="150" height="150" viewBox="0 0 100 100">
          <path d="M20,20 L80,80 M80,20 L20,80" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-20 overflow-y-auto lg:overflow-visible no-scrollbar flex-1 mb-4 lg:mb-0">
        {/* Title Section */}
        <div className="flex-none lg:flex-1 w-full">
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-[#1a1a1a] mb-8 lg:mb-10">SAY<br/>HELLO.</h2>
          
          {/* Desktop Socials */}
          <div className="hidden lg:flex flex-col gap-8">
            <SocialLinks />
          </div>
        </div>

        {/* Note Section (Middle on Mobile/Tablet) */}
        <div className="flex-none lg:flex-1 w-full max-w-md relative group">
          <motion.div 
            initial={{ rotate: -2 }}
            whileHover={{ rotate: 0 }}
            className="bg-[#ffffff] text-black p-5 sm:p-6 lg:p-10 shadow-[10px_10px_0px_rgba(0,0,0,0.1)] lg:shadow-[20px_20px_0px_rgba(0,0,0,0.1)] relative"
          >
            <Tape rotation={-15} className="absolute -top-6 left-10 w-24 lg:w-32 opacity-90" />
            <Tape rotation={10} className="absolute -bottom-4 -right-6 w-20 lg:w-24 opacity-80" />
            
            <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 lg:mb-6 border-b-2 border-black pb-2">Drop a message</h3>
            
            <form className="flex flex-col gap-2 sm:gap-3 lg:gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1">
                <label className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-50">Message</label>
                <textarea
                  rows={6}
                  data-cursor="normal"
                  className="bg-transparent border-b border-black/20 py-1 lg:py-4 focus:border-black outline-none font-hand text-lg lg:text-2xl resize-none cursor-auto"
                  placeholder="Write something..."
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    if (status !== 'idle') {
                      setStatus('idle');
                      setErrorMessage('');
                    }
                  }}
                  disabled={status === 'sending'}
                  required
                />
              </div>
              <button
                className="mt-2 lg:mt-6 bg-black text-white py-2 sm:py-3 lg:py-4 font-sans uppercase tracking-widest font-bold hover:bg-[#8b0836] transition-colors hover-trigger text-xs sm:text-sm lg:text-base disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending...' : 'Send Note'}
              </button>
              {status === 'success' && (
                <p className="text-xs sm:text-sm font-sans uppercase tracking-widest text-[#024a70]" aria-live="polite">
                  Message sent. Thanks for reaching out!
                </p>
              )}
              {status === 'error' && (
                <p className="text-xs sm:text-sm font-sans uppercase tracking-widest text-[#8b0836]" aria-live="polite">
                  {errorMessage}
                </p>
              )}
            </form>
          </motion.div>
          
          {/* Scribble Doodle */}
          <div className="absolute -bottom-12 -left-12 text-[#FF1493] opacity-40 pointer-events-none hidden lg:block">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <path d="M10,10 C30,40 70,0 90,50 S10,90 50,70" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>
        </div>

        {/* Mobile/Tablet Socials (Bottom on Mobile/Tablet) */}
        <div className="flex lg:hidden flex-col gap-6 w-full pt-4">
          <SocialLinks />
        </div>
      </div>

      {/* Bottom Signature */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center mt-auto pt-4 lg:pt-24 border-t border-black/10 shrink-0">
        <p className="font-sans text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.2em] lg:tracking-[0.3em] opacity-60 mb-1 lg:mb-0 text-center lg:text-left">© {new Date().getFullYear()} JNY Student Council</p>
        <p className="font-hand text-base sm:text-lg lg:text-xl text-[#1a1a1a] text-center lg:text-right">
          Made with <span className="text-[#FF1493] inline-block animate-pulse">♥️</span> by JNY Student Council
        </p>
      </div>
    </footer>
  );
};

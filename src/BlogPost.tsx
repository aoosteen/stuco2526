import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, Calendar, Tag, Share2, Loader2 } from 'lucide-react';
import { Tape } from './components/Tape';
import Lenis from 'lenis';
import { urlFor } from './lib/sanity';
import { PortableText } from '@portabletext/react';
import { useRouteTransitionMotion } from './lib/routeTransitionMotion';
import { useBlogPost } from './hooks/useBlog';

const ScribbleLine = ({ className, enabled = true }: { className?: string; enabled?: boolean }) => (
  <svg className={className} viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M0 10C20 5 40 15 60 10C80 5 100 15 120 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={enabled ? { pathLength: 0 } : false}
      whileInView={enabled ? { pathLength: 1 } : undefined}
      transition={enabled ? { duration: 1.5, ease: "easeInOut" } : { duration: 0 }}
    />
  </svg>
);

// Custom Portable Text components for consistent styling
const components = {
  types: {
    image: ({ value }: any) => (
      <div className="my-10 relative group">
        <div className="p-4 border-2 border-black bg-white shadow-[10px_10px_0px_rgba(0,0,0,0.1)]">
          <img
            src={urlFor(value).url()}
            alt={value.alt || 'Blog content image'}
            className="w-full h-auto border border-black/10"
          />
        </div>
        {value.caption && (
          <p className="mt-4 font-hand text-xl text-center text-accent-darkblue italic">
            {value.caption}
          </p>
        )}
      </div>
    ),
  },
  block: {
    h1: ({ children }: any) => <h1 className="font-serif text-4xl md:text-5xl font-black mt-16 mb-8 tracking-tighter text-ink leading-tight">{children}</h1>,
    h2: ({ children }: any) => <h2 className="font-serif text-3xl md:text-4xl font-bold mt-12 mb-6 tracking-tighter text-ink leading-tight">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-serif text-2xl md:text-3xl font-bold mt-10 mb-4 text-ink">{children}</h3>,
    normal: ({ children }: any) => <p className="font-sans text-lg md:text-xl leading-relaxed mb-6 text-black/80">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-accent-pink pl-6 my-10 font-hand text-2xl md:text-3xl text-accent-darkblue italic leading-relaxed bg-accent-lightblue/20 py-4 pr-4">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a 
        href={value.href} 
        target="_blank" 
        rel="noreferrer" 
        className="text-accent-pink underline decoration-2 underline-offset-4 hover:bg-accent-pink hover:text-white transition-all px-1"
      >
        {children}
      </a>
    ),
    strong: ({ children }: any) => <strong className="font-black text-ink">{children}</strong>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside mb-6 space-y-2 font-sans text-lg md:text-xl ml-4">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside mb-6 space-y-2 font-sans text-lg md:text-xl ml-4">{children}</ol>,
  },
};

export default function BlogPost() {
  const { shouldRunEnter, incomingEnterDelaySec } = useRouteTransitionMotion();
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, loading } = useBlogPost(id);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);


  useEffect(() => {
    if (!loading && post) {
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loading, post]);

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

    // Initial scroll reset
    lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    return () => {
      lenis.destroy();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-accent-red" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center flex-col gap-6">
        <h1 className="font-serif text-4xl font-bold text-ink">Story not found</h1>
        <button onClick={() => navigate('/blog')} className="px-6 py-3 bg-black text-white font-sans uppercase tracking-widest font-bold">
          Back to Blog
        </button>
      </div>
    );
  }

  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-accent-yellow selection:text-ink overflow-x-hidden relative">
      <div className="noise-overlay" />

      {/* Hero Image Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden border-b-4 border-black">
        <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
          {post.coverImage && (
            <img 
              src={urlFor(post.coverImage).url()} 
              alt={post.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
        
        {/* Back Button */}
        <div className="absolute top-24 left-6 md:left-20 z-20">
          <Link to="/blog" className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black font-sans text-xs uppercase tracking-widest font-bold hover:bg-accent-yellow transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <ArrowLeft size={16} /> Back to Stories
          </Link>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 md:px-20 max-w-4xl mx-auto relative z-10 -mt-20 md:-mt-32 pb-32">
        {/* Title Card */}
        <motion.div 
          initial={shouldRunEnter ? { opacity: 0, y: 50 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldRunEnter
              ? { duration: 0.6, delay: incomingEnterDelaySec + 0.2 }
              : { duration: 0 }
          }
          className="bg-white p-8 md:p-12 border-2 border-black shadow-[16px_16px_0px_rgba(0,0,0,0.1)] relative mb-16"
        >
          <Tape rotation={-2} className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 opacity-90 z-20" />
          <Tape rotation={3} className="absolute -bottom-4 right-10 w-32 opacity-80 z-20" />
          
          <div className="flex flex-wrap items-center gap-4 mb-6 font-sans text-xs uppercase tracking-widest font-bold opacity-60">
            <span className="flex items-center gap-1"><Calendar size={14} /> {formattedDate}</span>
            <span className="flex items-center gap-1"><Tag size={14} /> {post.category}</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter text-ink">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-2 mb-8 opacity-40 font-sans text-sm tracking-widest uppercase font-black">
            <span>By {post.author}</span>
          </div>
          
          <ScribbleLine className="w-32 text-accent-pink mb-8" enabled={shouldRunEnter} />
          
          <p className="font-hand text-2xl md:text-3xl leading-relaxed text-accent-darkblue">
            {post.description}
          </p>
        </motion.div>

        {/* Article Body */}
        <motion.div 
          initial={shouldRunEnter ? { opacity: 0 } : false}
          whileInView={shouldRunEnter ? { opacity: 1 } : undefined}
          viewport={{ once: true, margin: "-100px" }}
          transition={shouldRunEnter ? { duration: 0.5, delay: incomingEnterDelaySec } : { duration: 0 }}
          className="max-w-none"
        >
          <PortableText value={post.blog} components={components} />
        </motion.div>

        {/* Footer Actions */}
        <div className="mt-20 pt-10 border-t-2 border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="font-sans text-xs uppercase tracking-widest font-bold opacity-50">Share this story:</span>
            <button className="p-3 border-2 border-black rounded-full hover:bg-paper hover:-translate-y-1 transition-all">
              <Share2 size={18} />
            </button>
          </div>
          
          <Link to="/blog" className="group flex items-center gap-2 font-sans text-sm uppercase tracking-widest font-black text-accent-red hover:text-black transition-colors">
            Read More Stories <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Decorative Elements */}
      <div className="fixed bottom-10 right-10 opacity-10 pointer-events-none z-0 hidden md:block">
        <svg width="150" height="150" viewBox="0 0 100 100">
          <path d="M10,90 Q50,10 90,90" fill="none" stroke="#000" strokeWidth="2" strokeDasharray="5 5" />
          <circle cx="90" cy="90" r="5" fill="#000" />
        </svg>
      </div>
    </div>
  );
}

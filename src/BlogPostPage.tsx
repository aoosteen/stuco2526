import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, Calendar, Tag, Share2, Check, Loader2 } from 'lucide-react';
import { Tape } from './components/Tape';
import Lenis from 'lenis';
import { urlFor } from './lib/sanity';
import { PortableText } from '@portabletext/react';
import { useRouteTransitionMotion } from './lib/routeTransitionMotion';
import { useBlogPost } from './hooks/useBlog';
import { Lightbox } from './components/Lightbox';
import { PageTransitionLink } from './components/PageTransitionLink';
import { usePageTransitionNavigation } from './hooks/usePageTransitionNavigation';
import { ScribbleLine } from './components/ScribbleLine';



// Portable text components moved inside BlogPost component to access state

export default function BlogPost() {
  const { shouldRunEnter, incomingEnterDelaySec } = useRouteTransitionMotion();
  const { id } = useParams();
  const navigateWithTransition = usePageTransitionNavigation();
  const { post, loading } = useBlogPost(id);
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  // Custom Portable Text components for consistent styling
  const customComponents = {
    types: {
      image: ({ value }: any) => (
        <div className="my-10 relative group">
          <div 
            className="p-4 border-2 border-black bg-white shadow-[10px_10px_0px_rgba(0,0,0,0.1)] cursor-zoom-in"
            onClick={() => setSelectedImage({ url: urlFor(value).url(), alt: value.alt || 'Blog content image' })}
          >
            <img
              src={urlFor(value).url()}
              alt={value.alt || 'Blog content image'}
              className="w-full h-auto border border-black/10 transition-transform duration-500 group-hover:scale-[1.01]"
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

  const handleShare = async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('input');
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const progressOpacity = useTransform(scrollYProgress,[0,0.98,1],[1,1,0])

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
        <button onClick={() => navigateWithTransition('/blog')} className="px-6 py-3 bg-black text-white font-sans uppercase tracking-widest font-bold">
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

      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-2 bg-accent-darkblue z-50 origin-left pointer-events-none transition-opacity duration-1000"
        style={{ scaleX: scrollYProgress , 
          opacity: progressOpacity
        }}

      />

      {/* Hero Image Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden border-b-4 border-black">
        <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full">
          {post.coverImage && (
            <img 
              src={urlFor(post.coverImage).url()} 
              alt={post.title} 
              className="w-full h-full object-cover cursor-zoom-in"
              referrerPolicy="no-referrer"
              onClick={() => setSelectedImage({ url: urlFor(post.coverImage).url(), alt: post.title })}
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
        
        {/* Back Button */}
        <div className="absolute top-24 left-6 md:left-20 z-20">
          <PageTransitionLink to="/blog" className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black font-sans text-xs uppercase tracking-widest font-bold hover:bg-accent-yellow transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            <ArrowLeft size={16} /> Back to Stories
          </PageTransitionLink>
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
          
          <ScribbleLine className="w-32 text-accent-darkblue mb-8" enabled={shouldRunEnter} />
          
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
          <PortableText value={post.blog} components={customComponents} />
        </motion.div>

        {/* Footer Actions */}
        <div className="mt-20 pt-10 border-t-2 border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied-label"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="font-sans text-xs uppercase tracking-widest font-bold text-green-600"
                >
                  Link copied!
                </motion.span>
              ) : (
                <motion.span
                  key="share-label"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="font-sans text-xs uppercase tracking-widest font-bold opacity-50"
                >
                  Share this story:
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              onClick={handleShare}
              whileTap={{ scale: 0.88 }}
              animate={copied ? { borderColor: '#16a34a' } : { borderColor: '#000000' }}
              transition={{ duration: 0.2 }}
              className="relative p-3 border-2 border-black rounded-full hover:bg-paper hover:-translate-y-1 transition-colors overflow-hidden"
              aria-label="Copy link to clipboard"
            >
              {/* Ripple ring on copy */}
              <AnimatePresence>
                {copied && (
                  <motion.span
                    key="ring"
                    className="absolute inset-0 rounded-full bg-green-100"
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 2.4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                )}
              </AnimatePresence>

              {/* Icon swap */}
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, opacity: 0, rotate: -45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: 45 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="block text-green-600"
                  >
                    <Check size={18} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="share"
                    initial={{ scale: 0, opacity: 0, rotate: 45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: -45 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="block"
                  >
                    <Share2 size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
          
          <PageTransitionLink to="/blog" className="group flex items-center gap-2 font-sans text-sm uppercase tracking-widest font-black text-accent-red hover:text-black transition-colors">
            Read More Stories <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </PageTransitionLink>
        </div>
      </section>

      {/* Decorative Elements */}
      <div className="fixed bottom-10 right-10 opacity-10 pointer-events-none z-0 hidden md:block">
        <svg width="150" height="150" viewBox="0 0 100 100">
          <path d="M10,90 Q50,10 90,90" fill="none" stroke="#000" strokeWidth="2" strokeDasharray="5 5" />
          <circle cx="90" cy="90" r="5" fill="#000" />
        </svg>
      </div>
      <Lightbox 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        src={selectedImage?.url || ''} 
        alt={selectedImage?.alt || ''} 
      />
    </div>
  );
}

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Tape } from './components/Tape';
import Lenis from 'lenis';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag, Search, ChevronDown } from 'lucide-react';
import { useRouteTransitionMotion } from './lib/routeTransitionMotion';
import { useBlogPosts } from './hooks/useBlog';

const cardColors = ['bg-[#b8e6fe]', 'bg-[#ffbd9b]', 'bg-[#fff9ef]', 'bg-[#ffc21a]'];
const cardRotations = [-2, 3, -1, 2, -3];


const Sticker = ({
  text,
  color,
  className,
  enabled = true,
}: {
  text: string;
  color: string;
  className?: string;
  enabled?: boolean;
}) => (
  <motion.div
    initial={enabled ? { scale: 0, rotate: -20 } : false}
    whileInView={enabled ? { scale: 1, rotate: (Math.random() * 20) - 10 } : undefined}
    viewport={{ once: true }}
    transition={enabled ? { duration: 0.4 } : { duration: 0 }}
    className={`px-4 py-2 ${color} border-2 border-black font-hand text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] whitespace-nowrap ${className}`}
  >
    {text}
  </motion.div>
);

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

export default function Blog() {
  const { shouldRunEnter, incomingEnterDelaySec } = useRouteTransitionMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const { posts: allPosts, loading } = useBlogPosts();


  useEffect(() => {
    if (!loading && allPosts.length > 0) {
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loading, allPosts]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(allPosts.map(p => p.category)))], [allPosts]);

  const isFiltering = searchQuery !== '' || selectedCategory !== 'All' || sortBy !== 'newest';

  const displayedPosts = useMemo(() => {
    let posts = isFiltering ? [...allPosts] : allPosts.slice(1);

    if (selectedCategory !== 'All') {
      posts = posts.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.excerpt.toLowerCase().includes(query)
      );
    }

    posts.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.dateStr).getTime() - new Date(a.dateStr).getTime();
      if (sortBy === 'oldest') return new Date(a.dateStr).getTime() - new Date(b.dateStr).getTime();
      if (sortBy === 'a-z') return a.title.localeCompare(b.title);
      if (sortBy === 'z-a') return b.title.localeCompare(a.title);
      return 0;
    });

    return posts;
  }, [searchQuery, selectedCategory, sortBy, isFiltering, allPosts]);

  const featuredPost = allPosts.length > 0 ? allPosts[0] : null;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

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
    
    // Initial scroll reset
    lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    return () => {
      lenis.destroy();
    };
  }, []);

  const heroScrollX = useTransform(smoothProgress, [0, 1], [0, -300]);
  const storiesScrollX = useTransform(smoothProgress, [0, 1], [0, -800]);
  const legacyScrollX = useTransform(smoothProgress, [0, 1], [0, 800]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="font-serif text-2xl animate-pulse text-ink">Reading Stories...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-paper text-ink font-sans selection:bg-accent-yellow selection:text-ink overflow-x-hidden relative">
      <div className="noise-overlay" />

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center px-6 md:px-20 max-w-7xl mx-auto relative overflow-hidden" data-cursor="magic">
        <motion.div
          initial={shouldRunEnter ? { opacity: 0, y: 50 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldRunEnter
              ? { duration: 0.8, ease: "easeOut", delay: incomingEnterDelaySec }
              : { duration: 0 }
          }
          className="text-center relative z-10"
        >
          <h1 className="font-serif text-[12vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter text-[#1a1a1a] mb-6">
            THE<br/>CHRONICLES.
          </h1>
          <p className="font-hand text-2xl md:text-4xl text-accent-red max-w-2xl mx-auto">
            Stories, updates, and behind-the-scenes from your student council.
          </p>
          <ScribbleLine className="w-48 mx-auto mt-8 text-[#a30037]" enabled={shouldRunEnter} />
        </motion.div>

        {/* Floating Background Doodles */}
        <div className="absolute top-20 left-10 opacity-20 rotate-12 pointer-events-none hidden md:block">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <path d="M10,50 Q30,10 50,50 T90,50" fill="none" stroke="#a30037" strokeWidth="4" />
          </svg>
        </div>
        <div className="absolute top-40 right-10 opacity-20 -rotate-12 pointer-events-none hidden md:block">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#005986" strokeWidth="3" strokeDasharray="10 10" />
          </svg>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="px-6 md:px-20 max-w-7xl mx-auto mb-16 relative z-20">
        <div className="bg-[#fff9ef] p-6 md:p-8 border-2 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] flex flex-col gap-6 relative">
          <Tape rotation={2} className="absolute -top-4 right-10 w-24 opacity-80" />
          <Tape rotation={-3} className="absolute -bottom-4 left-10 w-32 opacity-80" />
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/50" size={20} />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-black py-3 pl-12 pr-4 font-hand text-xl focus:outline-none focus:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-shadow"
              />
            </div>
            
            {/* Sort */}
            <div className="relative w-full md:w-auto min-w-[200px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white border-2 border-black py-3 pl-4 pr-10 font-sans text-xs uppercase tracking-widest font-bold focus:outline-none focus:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">Title A-Z</option>
                <option value="z-a">Title Z-A</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
            </div>
          </div>
          
          {/* Categories */}
          <div className="pt-6 border-t border-black/10">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-50 mr-2 hidden sm:block">Filter by:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 border-2 border-black rounded-full font-sans text-[10px] uppercase tracking-widest font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-[#FF1493] text-white shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-y-0.5' 
                      : 'bg-white hover:bg-black/5 hover:-translate-y-0.5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {!isFiltering && featuredPost && (
        <section className="px-6 md:px-20 max-w-7xl mx-auto mb-32 relative z-10" data-cursor="read">
          <Link 
            to={`/blog/${featuredPost.id}`}
            className="relative group cursor-pointer block"
          >
            <motion.div 
              initial={shouldRunEnter ? { opacity: 0, y: 50 } : false}
              whileInView={shouldRunEnter ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={shouldRunEnter ? { duration: 0.6, delay: incomingEnterDelaySec } : { duration: 0 }}
              className={`p-6 md:p-10 border-2 border-black ${cardColors[0]} shadow-[20px_20px_0px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-[1.01]`}
            >
              <Tape rotation={-2} className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 opacity-90 z-20" />
              
              <div className="flex flex-col lg:flex-row gap-10 items-center">
                <div className="w-full lg:w-3/5 aspect-video overflow-hidden border-2 border-black relative">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover transition-all duration-700" 
                    referrerPolicy="no-referrer"
                  />
                  <Sticker
                    text="Featured"
                    color="bg-[#FFC21A]"
                    className="absolute top-4 left-4 -rotate-6"
                    enabled={shouldRunEnter}
                  />
                </div>
                
                <div className="w-full lg:w-2/5 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4 font-sans text-[10px] uppercase tracking-widest font-bold opacity-60">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {featuredPost.date}</span>
                    <span className="flex items-center gap-1"><Tag size={12} /> {featuredPost.category}</span>
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight text-ink">{featuredPost.title}</h2>
                  <p className="font-hand text-2xl leading-relaxed mb-8 text-black/80">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-2 font-sans uppercase tracking-[0.2em] font-black text-accent-red group-hover:text-black transition-colors w-fit">
                    Read Full Story <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </section>
      )}

      {/* Grid Posts */}
      <section className="px-6 md:px-20 max-w-7xl mx-auto pb-32 relative z-10" data-cursor="read">
        <div className="flex items-center gap-6 mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tighter">
            {isFiltering ? 'Search Results.' : 'More Stories.'}
          </h2>
          <div className="flex-1 h-[2px] bg-black/10 relative">
            <motion.div 
              style={{ scaleX: smoothProgress }}
              className="absolute inset-0 bg-[#005986] origin-left"
            />
          </div>
        </div>

        {displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            <AnimatePresence mode="popLayout">
              {displayedPosts.map((post, i) => (
                <Link 
                  to={`/blog/${post.id}`}
                  key={post.id}
                  className="relative group cursor-pointer block"
                >
                  <motion.div
                    layout
                    initial={shouldRunEnter ? { opacity: 0, scale: 0.9 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={
                      shouldRunEnter
                        ? { duration: 0.3, delay: incomingEnterDelaySec }
                        : { duration: 0 }
                    }
                    className="h-full"
                  >
                    <div 
                      className={`h-full flex flex-col p-6 border-2 border-black ${cardColors[i % 4]} shadow-[12px_12px_0px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-[1.02]`}
                      style={{ transform: `rotate(${cardRotations[i % 5]}deg)` }}
                    >
                      <Tape rotation={cardRotations[i % 5] * -4} className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 opacity-80 z-20" />
                      
                      <div className="w-full aspect-video overflow-hidden border-2 border-black mb-6 relative">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-all duration-700" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-3 font-sans text-[9px] uppercase tracking-widest font-bold opacity-60">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                          <span className="flex items-center gap-1"><Tag size={10} /> {post.category}</span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold mb-3 leading-tight group-hover:text-accent-darkblue transition-colors text-ink">{post.title}</h3>
                        <p className="font-hand text-xl leading-snug mb-6 text-black/70 flex-1">
                          {post.excerpt}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-black/10 flex items-center justify-between">
                          <span className="font-sans text-xs uppercase tracking-widest font-black">Read</span>
                          <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block relative mb-6">
              <svg width="120" height="120" viewBox="0 0 100 100" className="text-[#005986] opacity-50">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="8 8" />
                <path d="M35,40 L45,40 M55,40 L65,40 M40,65 Q50,55 60,65" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <Tape rotation={-10} className="absolute -top-2 -right-4 w-16 opacity-80" />
            </div>
            <h3 className="font-serif text-3xl font-bold mb-2">No stories found</h3>
            <p className="font-hand text-xl text-black/60">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSortBy('newest'); }}
              className="mt-8 px-6 py-3 bg-black text-white font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#a30037] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Decorative Background Text */}
      <div className="absolute top-[60%] left-0 w-full pointer-events-none opacity-[0.03] select-none z-0 overflow-hidden">
        <motion.div 
          style={{ x: storiesScrollX }}
          className="font-serif text-[25vw] font-black whitespace-nowrap leading-none text-[#005986] flex gap-20"
        >
          <span>STORIES</span>
          <span>MEMORIES</span>
          <span>JOURNAL</span>
        </motion.div>
      </div>

      {/* Additional Decorative Background Text */}
      <div className="absolute top-[90%] left-0 w-full pointer-events-none opacity-[0.03] select-none z-0 overflow-hidden">
        <motion.div 
          style={{ x: legacyScrollX }}
          className="font-serif text-[25vw] font-black whitespace-nowrap leading-none text-[#005986] flex gap-20"
        >
          <span>THE CHRONICLES</span>
          <span>THE LEGACY</span>
          <span>THE STORY</span>
        </motion.div>
      </div>
    </div>
  );
}

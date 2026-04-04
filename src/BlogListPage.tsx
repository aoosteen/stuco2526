import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Tape } from './components/Tape';
import Lenis from 'lenis';
import { Search, ChevronDown } from 'lucide-react';
import { useRouteTransitionMotion } from './lib/routeTransitionMotion';
import { useBlogPosts } from './hooks/useBlog';
import { BlogGridCard } from './components/Card';
import { Eyebrow } from './components/Eyebrow';
import { Lightbox } from './components/Lightbox';
import { PageTransitionLink } from './components/PageTransitionLink';
import { ScribbleLine } from './components/ScribbleLine';

const cardColors = ['bg-[#b8e6fe]', 'bg-[#ffbd9b]', 'bg-[#fff9ef]', 'bg-[#ffc21a]'];
const cardRotations = [-2, 3, -1, 2, -3];




const CustomSortDropdown = ({ 
  value, 
  onChange, 
  options 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  options: { label: string; value: string }[] 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full md:w-auto min-w-[200px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border-2 border-black py-3 px-4 font-sans text-[10px]  tracking-[0.2em] font-black focus:outline-none shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
      >
        <span>{selectedOption?.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "anticipate" }}
        >
          <ChevronDown size={14} strokeWidth={3} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] z-50 overflow-hidden"
          >
            {options.map((option, idx) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 font-sans text-[10px]  tracking-widest font-bold transition-colors border-b last:border-b-0 border-black/10 hover:bg-accent-yellow ${
                  value === option.value ? 'bg-paper text-[#005986]' : 'text-black'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Blog() {
  const { shouldRunEnter, incomingEnterDelaySec } = useRouteTransitionMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  const { posts: allPosts, loading, loadingMore, hasMore, total, loadMore } = useBlogPosts();
  const categories = useMemo(() => ['All', ...Array.from(new Set(allPosts.map(p => p.category)))], [allPosts]);

  const isFiltering = searchQuery !== '' || selectedCategory !== 'All' || sortBy !== 'newest';

  const displayedPosts = useMemo(() => {
    let posts = [...allPosts];

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
    <div ref={containerRef} className="min-h-screen bg-paper text-ink font-sans selection:bg-accent-yellow selection:text-ink overflow-x-clip relative">
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
          <Eyebrow 
            text="Our Blogs" 
            color="text-accent-red" 
            delay={incomingEnterDelaySec} 
          />
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

      {/* Filter & Search Bar Wrapper */}
      <div className="sticky top-0 z-30 w-full bg-paper/80 backdrop-blur-sm py-6 mb-16">
        <section className="px-6 md:px-20 max-w-7xl mx-auto">
          <div className="bg-paper p-6 md:p-8 border-2 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] flex flex-col gap-6 relative">
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
              <CustomSortDropdown
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { label: 'Newest First', value: 'newest' },
                  { label: 'Oldest First', value: 'oldest' },
                  { label: 'Title A-Z', value: 'a-z' },
                  { label: 'Title Z-A', value: 'z-a' },
                ]}
              />
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
      </div>



      {/* Grid Posts */}
      <section className="px-6 md:px-20 max-w-7xl mx-auto pb-32 relative z-10" data-cursor="read">
        <div className="flex items-center gap-6 mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tighter">
            {isFiltering ? 'Search Results.' : 'All Stories.'}
          </h2>
          <div className="flex-1 h-[2px] bg-black/10 relative">
            <motion.div 
              style={{ scaleX: smoothProgress }}
              className="absolute inset-0 bg-[#005986] origin-left"
            />
          </div>
          {!isFiltering && total > 0 && (
            <span className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-40 whitespace-nowrap">
              {allPosts.length} / {total}
            </span>
          )}
        </div>

        {displayedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
              <AnimatePresence mode="popLayout">
                {displayedPosts.map((post, i) => (
                  <PageTransitionLink
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
                      data-cursor-color={['#b8e6fe', '#ffbd9b', '#fff9ef', '#ffc21a'][i % 4]}
                    >
                      <BlogGridCard
                        color={cardColors[i % 4]}
                        rotation={cardRotations[i % 5]}
                        image={post.image}
                        imageAlt={post.title}
                        date={post.date}
                        category={post.category}
                        title={post.title}
                        excerpt={post.excerpt}
                      />
                    </motion.div>
                  </PageTransitionLink>
                ))}
              </AnimatePresence>
            </div>

            {/* Load More — only shown when not filtering and more posts exist */}
            {!isFiltering && hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 mt-20"
              >
                <p className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-40">
                  Showing {allPosts.length} of {total} stories
                </p>
                <button
                  id="blog-load-more"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="group relative flex items-center gap-3 px-10 py-4 bg-black text-white font-sans text-xs uppercase tracking-widest font-black border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.15)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[6px_6px_0px_rgba(0,0,0,0.15)]"
                >
                  {loadingMore ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Loading Stories...
                    </>
                  ) : (
                    <>
                      Load More Stories
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* All loaded indicator */}
            {!isFiltering && !hasMore && total > 0 && allPosts.length > 9 && (
              <div className="flex flex-col items-center gap-2 mt-20 opacity-40">
                <div className="w-12 h-[2px] bg-black" />
                <p className="font-sans text-[10px] uppercase tracking-widest font-bold">All {total} stories loaded</p>
                <div className="w-12 h-[2px] bg-black" />
              </div>
            )}
          </>
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
    </div>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { sanityClient } from '../lib/sanity';
import { ArrowRight } from 'lucide-react';
import { BlogPreviewCard } from './Card';
import { PageTransitionLink } from './PageTransitionLink';

const bgColors = ["bg-[#fff9ef]", "bg-[#b8e6fe]", "bg-[#ffbd9b]"];
const rotations = [-2, 3, -1];
const MotionLink = motion.create(PageTransitionLink);

export const HomeBlogPreview = () => {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await sanityClient.fetch(
        `*[_type == "Blogs"] | order(publishedAt desc, _createdAt desc)[0..2] {
          _id,
          title,
          author,
          publishedAt,
          _createdAt,
          description
        }`
      );
      
      const formattedBlogs = data.map((blog: any, index: number) => {
        const dateObj = new Date(blog.publishedAt || blog._createdAt);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        
        return {
          id: blog._id,
          title: blog.title,
          author: blog.author || 'Council Member',
          date: dateObj.toLocaleDateString('en-US', options),
          excerpt: blog.description || 'Read more about this council update.',
          color: bgColors[index % bgColors.length],
          rotation: rotations[index % rotations.length]
        };
      });

      setBlogs(formattedBlogs);
    };

    fetchBlogs();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={containerRef} id="blogs"  className="py-32 md:py-48 bg-[#b8e6fe] text-[#1a1a1a] relative overflow-hidden z-10">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
      
      {/* Background Doodles */}
      <div className="absolute top-[5%] left-[2%] opacity-30 pointer-events-none rotate-12">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <path d="M50,10 L61,35 L88,35 L67,52 L75,77 L50,62 L25,77 L33,52 L12,35 L39,35 Z" fill="none" stroke="#a30037" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="absolute top-[5%] right-[2%] opacity-30 pointer-events-none -rotate-12">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path d="M10,50 C10,10 90,10 90,50 S10,90 10,50" fill="none" stroke="#005986" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-[5%] left-[2%] opacity-20 pointer-events-none rotate-45">
        <svg width="60" height="60" viewBox="0 0 100 100">
          <path d="M10,50 L90,50 M70,30 L90,50 L70,70" fill="none" stroke="#FF1493" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="absolute bottom-[5%] right-[2%] opacity-20 pointer-events-none">
        <svg width="50" height="50" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#FFC21A" strokeWidth="8" strokeDasharray="10 10" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-20 ">
          <h2 className="font-serif text-6xl md:text-8xl font-black tracking-tighter text-[#1a1a1a] ">
            COUNCIL<br/>NOTES.
          </h2>
          <p className="font-hand text-3xl text-[#a30037] max-w-sm mt-6 md:mt-0 text-center lg:text-left">
            Thoughts, updates, and ramblings from your student reps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {blogs.map((blog, i) => {
            const y = i === 0 ? y1 : i === 1 ? y2 : y3;
            return (
              <MotionLink
                to={`/blog/${blog.id}`}
                key={blog.id}
                style={{ y }}
                className="cursor-pointer hover-trigger"
                data-cursor="read"
                data-cursor-color={['#fff9ef', '#b8e6fe', '#ffbd9b'][i % 3]}
              >
                <BlogPreviewCard
                  color={blog.color}
                  rotation={blog.rotation}
                  date={blog.date}
                  author={blog.author}
                  title={blog.title}
                  excerpt={blog.excerpt}
                />
              </MotionLink>
            );
          })}
        </div>
          <div className="mt-20 flex justify-center relative z-20">
          <PageTransitionLink to="/blog" data-cursor="read">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-[#a30037] text-white px-8 py-4 md:px-12 md:py-6 font-sans uppercase tracking-[0.2em] font-black border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all hover-trigger flex items-center gap-4 text-sm md:text-base hover:scale-105"
            >
              Read more blogs <ArrowRight size={24} />
            </motion.button>
          </PageTransitionLink>
        </div>
      </div>
    </section>
  );
};

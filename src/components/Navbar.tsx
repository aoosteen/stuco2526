import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight } from "lucide-react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";

import { NAV_ITEMS, FOOTER_LINKS } from "../constants/links";
import { useDeviceDimensions } from "../hooks/useDeviceDimensions";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();
  const { width, height } = useDeviceDimensions();
  const isHome = location.pathname === "/";

  // Scroll Lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("nav-menu-open");
    } else {
      document.body.style.overflow = "unset";
      document.body.classList.remove("nav-menu-open");
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.classList.remove("nav-menu-open");
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);

    // Footer is global and fixed; scroll the current page to its bottom reveal.
    const scrollToFooter = () => {
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      window.scrollTo({
        top: maxScroll,
        behavior: "smooth",
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToFooter);
    });

    const nextUrl = `${window.location.pathname}${window.location.search}#contact`;
    window.history.replaceState(null, "", nextUrl);
  };

  return (
    <>
      <div className="pointer-events-auto fixed top-6 left-6 md:top-10 md:left-10 z-[1305]">
        <Link to="/" className="cursor-pointer">
          <img
            src="/StucoLogo.png"
            alt="Stuco Logo"
            className="h-10 md:h-12 w-auto object-contain  "
          />
        </Link>
      </div>
      <nav className="fixed top-0 right-0 w-full p-6 md:p-10 z-[1305] flex justify-end items-center text-white pointer-events-none mix-blend-difference">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="pointer-events-auto hover-trigger w-12 h-12 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors cursor-pointer "
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Fullscreen Menu */}
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
            initial={{ clipPath: "circle(0% at 100% 0)" }}
            animate={{ clipPath: "circle(150% at 100% 0)" }}
            exit={{ clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-[#d1fae5] z-[1200] flex flex-col justify-center px-10 md:px-32 text-[#1a1a1a] menu-container"
          >
            <div className="hidden opacity-30" />

            {/* Floating Decorative Elements - Repositioned for better composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-40 right-20 pointer-events-none hidden md:block"
            >
              <svg
                width="120"
                height="60"
                viewBox="0 0 120 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 30 Q 35 5, 60 30 T 110 30"
                  stroke="#FF1493"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute top-1/2 left-10 pointer-events-none hidden md:block"
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#8b0836"
                  strokeWidth="6"
                  strokeDasharray="12 12"
                />
              </svg>
            </motion.div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
              <ul className="flex flex-col gap-2 md:gap-6 w-full">
                {NAV_ITEMS.map((item, i) => {
                  const isActive =
                    item.name !== "Contact" &&
                    (item.isHash
                      ? isHome && location.hash === `#${item.path}`
                      : location.pathname === item.path);

                  const isHovered = hoveredItem === item.name;
                  const isFaded =
                    hoveredItem !== null && hoveredItem !== item.name;

                  return (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="w-full "
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div
                        className={`group flex items-center gap-6 transition-all duration-500 ${isFaded ? "opacity-20" : "opacity-100"}`}
                      >
                        {/* Interactive Link */}
                        <div className="relative flex items-center">
                          {/* Active Indicator (Scrapbook Star) */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.span
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 45 }}
                                className="absolute -left-12 md:-left-16 text-3xl hidden md:block"
                                style={{ color: item.color }}
                              >
                                ★
                              </motion.span>
                            )}
                          </AnimatePresence>

                          {item.name === "Contact" ? (
                            <Link
                              to="#contact"
                              onClick={handleContactClick}
                              className="font-serif font-black tracking-tighter text-5xl md:text-8xl transition-all duration-500 hover-trigger inline-block relative cursor-pointer"
                              style={{
                                color: isHovered ? item.color : "#1a1a1a",
                              }}
                            >
                              <span className="relative z-10">{item.name}</span>
                            </Link>
                          ) : item.isHash ? (
                            isHome ? (
                              <Link
                                to={`#${item.path}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="font-serif font-black tracking-tighter text-5xl md:text-8xl transition-all duration-500 hover-trigger inline-block relative cursor-pointer"
                                style={{
                                  color:
                                    isHovered || isActive
                                      ? item.color
                                      : "#1a1a1a",
                                }}
                              >
                                <span className="relative z-10 ">
                                  {item.name}
                                </span>
                              </Link>
                            ) : (
                              <Link
                                to={`/#${item.path}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="font-serif font-black tracking-tighter text-5xl md:text-8xl transition-all duration-500 hover-trigger inline-block relative cursor-pointer"
                                style={{
                                  color:
                                    isHovered || isActive
                                      ? item.color
                                      : "#1a1a1a",
                                }}
                              >
                                <span className="relative z-10 ">
                                  {item.name}
                                </span>
                              </Link>
                            )
                          ) : (
                            <Link
                              to={item.path}
                              onClick={() => setIsMenuOpen(false)}
                              className="font-serif font-black tracking-tighter text-5xl md:text-8xl transition-all duration-500 hover-trigger inline-block relative cursor-pointer"
                              style={{
                                color:
                                  isHovered || isActive
                                    ? item.color
                                    : "#1a1a1a",
                              }}
                            >
                              <span className="relative z-10 ">
                                {item.name}
                              </span>
                            </Link>
                          )}
                        </div>

                        {/* Animated Arrow & Description */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: isHovered ? 1 : 0,
                            x: isHovered ? 0 : -20,
                          }}
                          className="hidden md:flex items-center gap-4 pointer-events-none"
                        >
                          <ArrowRight size={40} style={{ color: item.color }} />
                          <span
                            className="font-hand text-2xl"
                            style={{ color: item.color }}
                          >
                            {item.desc}
                          </span>
                        </motion.div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Decorative Side Element */}
              <div className="hidden lg:block w-1/3 text-right">
                <motion.div
                  initial={{ opacity: 0, rotate: 10 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 10, transition: { duration: 0.3 } }}
                  transition={{ delay: 0.8 }}
                  className="inline-block p-6 border-2 border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)] -rotate-3"
                >
                  <p className="font-hand text-2xl mb-2 text-black">
                    "Making memories
                  </p>
                  <p className="font-hand text-2xl text-black">
                    one event at a time!"
                  </p>
                  <div className="mt-4 flex justify-end">
                    <div className="w-12 h-12 bg-[#FF1493] rounded-full border-2 border-black flex items-center justify-center">
                      <span className="font-serif font-bold text-xl text-white">
                        ★
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Footer inside menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ delay: 0.9 }}
              className="absolute bottom-10 left-10 md:left-32 right-10 md:right-32 flex justify-between items-end border-t-2 border-black/10 pt-6"
            >
              <div className="font-sans text-xs font-bold tracking-widest uppercase text-black/60">
                © {new Date().getFullYear()} JNY Student Council
              </div>
              <div className="flex gap-4">
                {FOOTER_LINKS.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-6 h-6 md:w-10 md:h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-(--hover-color) hover:text-white transition-colors text-black cursor-pointer"
                    style={{ '--hover-color': social.hoverColor } as React.CSSProperties}
                  >
                    <social.icon size={width < 768 ? 12 : 18} />
                  </a>
                ))}
              </div>
            </motion.div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
};

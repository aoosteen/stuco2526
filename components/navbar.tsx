"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useDeviceWidth } from "@/hooks/useDeviceWidth";
import { useLenis } from "lenis/react";

const links = [
  {
    name: "Home",
    href: "/",
    textColor: "text-blue-800",
    hoverColor: "hover:text-blue-800",
  },
  {
    name: "Members",
    href: "/members",
    textColor: "text-rose-800",
    hoverColor: "hover:text-rose-800/90",
  },
  {
    name: "Gallery",
    href: "/gallery",
    textColor: "text-yellow-800",
    hoverColor: "hover:text-yellow-800/90",
  },
  {
    name: "Blog",
    href: "/blog",
    textColor: "text-sky-800",
    hoverColor: "hover:text-sky-800/90",
  },
];

const Navbar = ({ className }: { className?: string }) => {
  const [scrollY, setScrollY] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const deviceWidth = useDeviceWidth();
  const pathname = usePathname();

  const lenis = useLenis();

  useEffect(() => {
    if (open) {
      lenis?.stop();
      document.body.setAttribute("data-lenis-prevent", "true");
    } else {
      lenis?.start();
      document.body.removeAttribute("data-lenis-prevent");
    }
  }, [open, lenis]);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Set initial scroll position
    handleScroll();

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!mounted) return null; // Ensure the component is mounted before rendering

  return (
    <motion.div
      className={cn(
        "fixed top-0 right-0 bg-transparent z-[49]  w-full   flex flex-row justify-between px-6 md:px-12 py-4 items-center  transition-opacity duration-300 ",
        pathname === "/"
          ? pathname === "/" &&
            window.scrollY > window.innerHeight * 4.05 &&
            window.scrollY < window.innerHeight * 9
            ? "opacity-100 "
            : "opacity-0 pointer-events-none"
          : "opacity-100",
        pathname.includes("/gallery/")
          ? "bg-[url(/gallery/GalleryBanner.webp)] bg-cover"
          : "",
        deviceWidth > 1024 ? "" : "opacity-100 pointer-events-auto",
        className
      )}
    >
      <Image
        src={"/navPaper.png"}
        alt="Blog cover image"
        width={1000}
        height={1000}
        className={cn(
          "object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-300 w-full h-full  -z-1",
          window.scrollY > 0 ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        className={cn(
          "w-fit p-3 rounded-full ",
          window.scrollY > 0 ? "" : "bg-white"
        )}
      >
        <Link href={"/"}>
          <Image
            priority
            src="/StucoLogo.png"
            alt="Stuco Logo"
            width={40}
            height={40}
            className="object-fit "
          />
        </Link>
      </div>
      <motion.div className=" gap-4 origin-right flex  ">
        {links.map((link, i) => {
          return (
            <AnimatePresence mode="popLayout" key={link.name} initial={false}>
              {(deviceWidth > 768 ? window.scrollY === 0 : false) && (
                <motion.div
                  // key={link.name}
                  initial={{
                    opacity: 0,
                    x:
                      i !== links.length - 1
                        ? (links.length - i) * 15 * (links.length - i)
                        : 0,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    x:
                      i !== links.length - 1
                        ? (links.length - i) * 15 * (links.length - i)
                        : 0,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    // key={link.name}
                    scroll={true}
                    className={cn(
                      "  transition-colors font-thin ",
                      pathname !== "/"
                        ? "text-white "
                        : " hover:text-blue-500 ",
                      pathname.includes("/blog/") ? "text-black" : "",
                      (pathname === link.href && pathname === "/") ||
                        (pathname.includes("/blog/") && link.href === "/blog")
                        ? "text-black font-bold decoration-dotted underline underline-offset-4"
                        : pathname === link.href && pathname !== "/"
                        ? "font-bold decoration-dotted underline underline-offset-4 "
                        : ""
                    )}
                  >
                    <motion.span>{link.name}</motion.span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
        <AnimatePresence mode="popLayout">
          {(deviceWidth > 768 ? window.scrollY > 0 : true) ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <Sheet
                open={open}
                onOpenChange={() => {
                  setOpen(!open);
                }}
              >
                <SheetTrigger>
                  <Menu
                    size={40}
                    className="cursor-pointer"
                    // stroke={
                    //   pathname === "/" || pathname.includes("/blog/")
                    //     ? "#000"
                    //     : "#fff"
                    // }
                    stroke={
                      (deviceWidth < 768 &&
                      (pathname.includes("/gallery") ||
                        pathname.includes("/blog") || pathname.includes('/members')) &&
                      scrollY === 0)
                        ? "#fff"
                        : "#000"
                    }
                  />
                </SheetTrigger>
                <SheetContent className=" p-8 bg-transparent bg-[url(../public/main/TornPaper.png)]  bg-no-repeat bg-cover border-none shadow-none ">
                  {/* <Image
                    src={"/main/TornPaper.png"}
                    width={400}
                    height={800}
                    alt="Torn Paper background"
                    className="absolute top-0 right-0 h-screen object-cover scale-x-90 origin-right  -z-2 "
                    priority
                  /> */}
                  <SheetTitle className="text-right"></SheetTitle>
                  <div className="flex flex-col gap-8 w-full h-full items-end mt-24">
                    {links.map((link) => {
                      return (
                        <motion.div
                          key={link.name}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={() => setOpen(!open)}
                        >
                          <Link
                            href={link.href}
                            scroll={true}
                            // key={link.name}
                            className={cn(
                              `${link.hoverColor} transition-colors font-thin text-3xl `,
                              pathname === link.href
                                ? `${link.textColor} font-bold decoration-dotted underline underline-offset-4`
                                : "text-black"
                            )}
                          >
                            <motion.span>{link.name}</motion.span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Navbar;

export const NavBlogSheet = () => {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    if (open) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [open, lenis]);

  // useEffect(() => {
  //   if (open) {
  //     lenis?.stop();
  //   } else {
  //     lenis?.start();
  //   }
  // }, [open, lenis]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Menu
          size={40}
          className="cursor-pointer "
          // stroke={
          //   pathname === "/" || pathname.includes("/blog/") ? "#000" : "#fff"
          // }
          stroke="#fff"
        />
      </SheetTrigger>
      <SheetContent className=" p-8  bg-transparent bg-[url(../public/main/TornPaper.png)] bg-cover bg-no-repeat border-none shadow-none">
        {/* <Image
          src={"/main/TornPaper.png"}
          width={400}
          height={800}
          alt="Torn Paper background"
          className="absolute  h-screen object-contain -z-2"
          priority
        /> */}
        <SheetTitle className="text-right"></SheetTitle>
        <div className="flex flex-col gap-8 w-full h-full items-end mt-24">
          {links.map((link) => {
            return (
              <motion.div
                key={link.name}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setOpen(!open)}
              >
                <Link
                  href={link.href}
                  // scroll={false}
                  // key={link.name}
                  className={cn(
                    `${link.hoverColor} transition-colors font-thin text-3xl `,
                    pathname === link.href
                      ? `${link.textColor} font-bold decoration-dotted underline underline-offset-4`
                      : "text-black"
                  )}
                >
                  <motion.span>{link.name}</motion.span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

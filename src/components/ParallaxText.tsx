import { useMotionValue, useScroll, useVelocity, useSpring, useTransform, useAnimationFrame, motion, wrap } from "motion/react";
import { useState, useEffect, useRef } from "react";

interface ParallaxProps {
  children: React.ReactNode;
  baseVelocity: number;
  disableScrollVelocity?: boolean;
}

export function ParallaxText({ 
  children, 
  baseVelocity = 100,
  disableScrollVelocity = false 
}: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (!disableScrollVelocity && !isMobile) {
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }

      moveBy += directionFactor.current * moveBy * velocityFactor.get();
    } else {
      moveBy = baseVelocity * (delta / 1000);
    }

    baseX.set(baseX.get() + moveBy);
  });

  /**
   * The number of times to repeat the content.
   * If the content is short, we need more repetitions to avoid empty space.
   */
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  return (
    <div className=" whitespace-nowrap m-0 flex flex-nowrap w-full">
      <motion.div className="flex whitespace-nowrap flex-nowrap will-change-transform" style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}
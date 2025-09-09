"use client";
import React, {  useRef,  } from "react";

const BlogPageTraacker = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef(null);
  // const [progress, setProgress] = useState(0);
  // const { scrollYProgress } = useScroll({
  //   target: containerRef,
  //   offset: ["start start", "end end"],
  // });
  // useEffect(() => {
  //   scrollYProgress.on("change", (latest) => {
  //     setProgress(latest);
  //   });

  //   return () => {
  //     scrollYProgress.on("change", (latest) => {
  //       setProgress(latest);
  //     });
  //   };
  // }, [scrollYProgress]);
  return (
    <main
      className="flex lg:flex-row flex-col  gap-8  px-6 sm:px-12 pt-32 pb-12 "
      ref={containerRef}
    >
      {/* <div className="w-2  bg-sky-200  rounded-md relative overflow-hidden ">
        <motion.div
          animate={{
            scaleY: progress,
          }}
          transition={{
            delay: 0.25,
            duration: 0.45,
            type: "tween",
            // ease:'easeOut'
          }}
          className="bg-gradient-to-b from-sky-200 to-sky-800 w-2 h-full  origin-top  "
        ></motion.div>
      </div> */}
      {children}
    </main>
  );
};

export default BlogPageTraacker;

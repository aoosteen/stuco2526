import { LayoutTransition } from "@/components/LayoutTransition";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutTransition
      animate={{
        opacity: 1,
      }}
      initial={{
        opacity: 0,
      }}
      exit={{
        opacity: 0,
      }}
      className=""
    >
      {children}
    </LayoutTransition>
  );
};

export default layout;

import { LayoutTransition } from "@/components/LayoutTransition";
import Navbar from "@/components/navbar";

export default function layout({ children }: { children: React.ReactNode }) {
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
      <Navbar />
      {children}
    </LayoutTransition>
  );
}

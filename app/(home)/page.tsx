import About from "@/components/main/About";
import Banners from "@/components/main/Banners";
import Blog from "@/components/main/Blog";
import ContactCard from "@/components/main/ContactCard";
import Gallery from "@/components/main/Gallery";
import InfiniteScroll from "@/components/main/InfiniteScroll";
import Landing from "@/components/main/Landing";
import SkipFirstRender from "@/components/SkipFirstRender";
import Image from "next/image";
// import dynamic from "next/dynamic";

export default function Home() {
  // const LandingDynamic = dynamic(() => import("@/components/main/Landing"), {
  //   ssr: false,
  // });
  return (
    <InfiniteScroll>
      <Landing />
      <SkipFirstRender>
        <Banners />
        <About />
        <Image
          src={"/main/SeperatorMainStuco.svg"}
          alt="Seperator"
          width={1000}
          height={100}
          className="mb-8 mt-42 sm:mt-36 sm:px-8 px-4"
          priority
        />
        <Blog />
        <Gallery />
        <ContactCard />
      </SkipFirstRender>

      
    </InfiniteScroll>
  );
}

import Navbar from "@/components/navbar";
import Script from "next/script";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="notes-bg ">
     
      {/* <div></div> */}
      <div className="md:bg-[url(../public/members/MembersDoodleBg.webp)] bg-size-[105%] bg-center ">
        <Navbar />
        {children}
      </div>

       <Script id="preload-member-images">
        {`
          // This script runs on the client side to preload images
          (function() {
            // Only run once per session
            if (sessionStorage.getItem('memberImagesPreloaded')) return;
            
            // Helper function to preload an image
            function preloadImage(url) {
              const img = new Image();
              img.src = url;
            }
            
           preloadImage('/members/MembersBanner.webp');
            
            {/* Add more images here */}
            
            // Mark these images as preloaded for this session
            sessionStorage.setItem('memberImagesPreloaded', 'true');
          })();
        `}
      </Script>
    </div>
  );
}

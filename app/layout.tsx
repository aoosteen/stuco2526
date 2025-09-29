import type { Metadata } from "next";
import { Merriweather, Neucha } from "next/font/google";
import "./globals.css";
import { LayoutTransition } from "@/components/LayoutTransition";
import TitleManager from "@/components/main/TitleManager";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["400", "700", "300", "900"],
  subsets: ["latin"],
});

const neucha = Neucha({
  variable: "--font-neucha",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JNY Student Council",
  description: "JNY Student Council",
  icons: "/StucoLogo.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/main/TornPaper.png"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="../public/main/galleryMainVideo.mp4"
          as="video"
          type="video/mp4"
          fetchPriority="high"
        />
           <link
          rel="preload"
          href="/main/Text1.png"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
           <link
          rel="preload"
          href="/main/Text2.png"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
           <link
          rel="preload"
          href="/main/Text3.png"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body
        className={` ${merriweather.className} ${neucha.variable} overflow-x-hidden  antialiased bg-[var(--main-bg)]   
           `}
      >
        <TitleManager />
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
      </body>
    </html>
  );
}

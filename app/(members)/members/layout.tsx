import Navbar from "@/components/navbar";


export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="notes-bg ">
      <div className="md:bg-[url(../public/members/doodle.webp)] bg-contain   ">
      <Navbar />
      {children}
      </div>
    </div>
  );
}

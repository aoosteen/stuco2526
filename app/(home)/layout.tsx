import Navbar from "@/components/navbar";


export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="notes-bg">
      <Navbar />
      {children}
    </div>
  );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Members from './Members';
import Blog from './Blog';
import Gallery from './Gallery';
import EventGallery from './EventGallery';
import { CustomCursor } from './components/CustomCursor';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <Router>
      <CustomCursor />
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:id" element={<EventGallery />} />
          </Routes>
        </div>
        {/* Global Spacer for Fixed Footer Reveal */}
        <div className="h-[100vh] pointer-events-none" />
      </div>
      <Footer />
    </Router>
  );
}

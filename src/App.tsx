import { BrowserRouter as Router, Route, Routes, useLocation, type Location } from 'react-router-dom';
import Home from './Home';
import Members from './Members';
import Blog from './Blog';
import Gallery from './Gallery';
import EventGallery from './EventGallery';
import { CustomCursor } from './components/CustomCursor';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import BlogPost from './BlogPost';
import { RouteTransitionMotionContext } from './lib/routeTransitionMotion';
import { usePageTransition, type SlotKey } from './hooks/usePageTransition';
import TitleManager from './hooks/titleManager';

const AppContent = () => {
  const location = useLocation();
  const {
    slotLocations,
    activeSlot,
    transitionSlots,
    stacked,
    isTransitioning,
    transitionMode,
    transitionTint,
    slotAPageRef,
    slotBPageRef,
    cornersRef,
    mobileWipeRef,
  } = usePageTransition(location);

  const renderRoutes = (routeLocation: Location) => (
    <Routes location={routeLocation}>
      <Route path="/" element={<Home />} />
      <Route path="/members" element={<Members />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/gallery/:id" element={<EventGallery />} />
      <Route path="/blog/:id" element={<BlogPost />} />
    </Routes>
  );

  const renderSlot = (slot: SlotKey) => {
    const slotLocation = slotLocations[slot];
    if (!slotLocation) {
      return null;
    }

    if (!stacked && activeSlot !== slot) {
      return null;
    }

    const isOutgoing = Boolean(stacked && transitionSlots?.outgoing === slot);
    const isIncoming = Boolean(stacked && transitionSlots?.incoming === slot);

    if (stacked && !isOutgoing && !isIncoming) {
      return null;
    }

    const layer = isIncoming ? 'incoming' : 'current';
    const slotClass = [
      'aod-transition-page',
      stacked ? 'aod-transition-page--stacked' : '',
      isOutgoing ? 'aod-transition-page--current' : '',
      isIncoming ? 'aod-transition-page--next pointer-events-none' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div key={slot} ref={slot === 'A' ? slotAPageRef : slotBPageRef} className={slotClass}>
        <RouteTransitionMotionContext.Provider
          value={{
            layer,
            isTransitioning,
            mode: transitionMode,
          }}
        >
          <div className={isIncoming ? 'pointer-events-none' : 'pointer-events-auto'}>
            {renderRoutes(slotLocation)}
          </div>
        </RouteTransitionMotionContext.Provider>
        <div className="h-screen pointer-events-none" />
      </div>
    );
  };

  return (
    <>
      <TitleManager />
      <CustomCursor />
      <Navbar />

      <div
        className={isTransitioning ? 'fixed inset-0  pointer-events-none transition-opacity duration-300 opacity-100' : 'fixed inset-0  pointer-events-none transition-opacity duration-300 opacity-0'}
        style={{ backgroundColor: transitionTint }}
        aria-hidden="true"
      />

      <div className="relative z-10 pointer-events-none">
        {renderSlot('A')}
        {renderSlot('B')}
      </div>

      <div
        className={
          isTransitioning
            ? 'opacity-0 pointer-events-none transition-opacity duration-200'
            : 'opacity-100 transition-opacity duration-200'
        }
      >
        <Footer />
      </div>

      <div
        className={`aod-transition-corners-wrap ${transitionMode === 'desktop' ? 'aod-transition-corners-wrap--active' : ''}`}
        aria-hidden="true"
      >
        <div ref={cornersRef} className="aod-transition-corners" />
      </div>

      <div
        ref={mobileWipeRef}
        className={`aod-transition-mobile-wipe ${transitionMode === 'mobile' ? 'aod-transition-mobile-wipe--active' : ''}`}
        aria-hidden="true"
      />
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

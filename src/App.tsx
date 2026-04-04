import { useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  resolvePath,
  useLocation,
  useNavigate,
  type Location,
  type NavigateOptions,
  type To,
} from 'react-router-dom';
import Home from './HomePage';
import Members from './MembersPage';
import Blog from './BlogListPage';
import Gallery from './GalleryPage';
import EventGallery from './EventGalleryPage';
import NotFoundPage from './NotFoundPage';
import { CustomCursor } from './components/CustomCursor';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import BlogPost from './BlogPostPage';
import { RouteTransitionMotionContext } from './lib/routeTransitionMotion';
import { usePageTransition, type SlotKey } from './hooks/usePageTransition';
import { PageTransitionNavigationProvider } from './hooks/usePageTransitionNavigation';
import TitleManager from './components/TabTitleManager';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    startTransitionForLocation,
  } = usePageTransition(location);

  const navigateWithTransition = useCallback(
    (to: To, options?: NavigateOptions) => {
      const resolved = resolvePath(to, location.pathname);
      const nextLocation = {
        pathname: resolved.pathname,
        search: resolved.search ?? '',
        hash: resolved.hash ?? '',
        state: options?.state ?? null,
        key: `pt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      } as Location;

      startTransitionForLocation(nextLocation);
      navigate(to, options);
    },
    [location.pathname, navigate, startTransitionForLocation],
  );

  const renderRoutes = (routeLocation: Location) => (
    <Routes location={routeLocation}>
      <Route path="/" element={<Home />} />
      <Route path="/members" element={<Members />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/gallery/:id" element={<EventGallery />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="*" element={<NotFoundPage />} />
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
    const shouldRenderFooter = !stacked || isOutgoing;
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
        <div data-transition-inner="true" className="aod-transition-page-inner">
          {shouldRenderFooter ? (
            <div className={`fixed inset-x-0 bottom-0 h-screen z-0 ${stacked ? 'pointer-events-none' : 'pointer-events-auto'}`}>
              <Footer />
            </div>
          ) : null}
          <RouteTransitionMotionContext.Provider
            value={{
              layer,
              isTransitioning,
              mode: transitionMode,
            }}
          >
            <div className={`relative z-10 ${isIncoming ? 'pointer-events-none' : 'pointer-events-auto'}`}>
              {renderRoutes(slotLocation)}
            </div>
          </RouteTransitionMotionContext.Provider>
          <div className="h-screen pointer-events-none relative z-10" />
        </div>
      </div>
    );
  };

  return (
    <PageTransitionNavigationProvider value={navigateWithTransition}>
      <>
        <TitleManager />
        <CustomCursor />
        <Navbar />

        <div
          className={isTransitioning ? 'fixed inset-0  pointer-events-none transition-opacity duration-300 opacity-100' : 'fixed inset-0  pointer-events-none transition-opacity duration-300 opacity-0'}
          style={{ backgroundColor: transitionTint }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          {renderSlot('A')}
          {renderSlot('B')}
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
    </PageTransitionNavigationProvider>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

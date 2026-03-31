import { useEffect, useRef, useState } from 'react';
import type { Location } from 'react-router-dom';

const MOBILE_BREAKPOINT = 480;
const DESKTOP_ENTER_START_SCALE = 0.8;
const DESKTOP_EXIT_END_SCALE = 0.82;
const DESKTOP_TRAVEL_MULTIPLIER = 1.24;
const DESKTOP_MIN_TRAVEL_PADDING_REM = 56;
const DESKTOP_SWAP_DURATION_MS = 2400;
const TRANSITION_TIMEOUT_MS = 3500;
const EASE_SWAP = 'cubic-bezier(0.4, 0, 0.2, 1)';
const EASE_I3 = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
const EASE_O3 = 'cubic-bezier(0.215, 0.61, 0.355, 1)';

const routeTransitionKey = (value: Location | null) => {
  if (!value) {
    return '';
  }

  return `${value.pathname}${value.search}`;
};

const routeTransitionTint = (value: Location | null) => {
  if (!value) {
    return '#fff9ef';
  }

  if (value.pathname.startsWith('/members')) {
    return '#b8e6fe';
  }

  if (value.pathname.startsWith('/blog')) {
    return '#ffd3e8';
  }

  if (value.pathname.startsWith('/gallery')) {
    return '#ffe8a3';
  }

  return '#ffbd9b';
};

const toResponsivePixels = (remValue: number, viewportWidth: number) => {
  if (viewportWidth <= MOBILE_BREAKPOINT) {
    return (remValue / 3.75) * viewportWidth / 100;
  }

  return (remValue / 14.4) * viewportWidth / 100;
};

const animateElement = (
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
  activeAnimations: Animation[],
) => {
  const animation = element.animate(keyframes, {
    fill: 'forwards',
    ...options,
  });

  activeAnimations.push(animation);
  return animation.finished.catch(() => undefined);
};

const cleanupPageStyles = (element: HTMLElement) => {
  element.style.removeProperty('position');
  element.style.removeProperty('inset');
  element.style.removeProperty('top');
  element.style.removeProperty('overflow');
  element.style.removeProperty('height');
  element.style.removeProperty('translate');
  element.style.removeProperty('scale');
  element.style.removeProperty('opacity');
  element.style.removeProperty('will-change');
  element.scrollTop = 0;
};

export type SlotKey = 'A' | 'B';
type SlotLocations = Record<SlotKey, Location | null>;
type TransitionSlots = {
  outgoing: SlotKey;
  incoming: SlotKey;
};

const oppositeSlot = (slot: SlotKey): SlotKey => (slot === 'A' ? 'B' : 'A');

export const usePageTransition = (location: Location) => {
  const [slotLocations, setSlotLocations] = useState<SlotLocations>({ A: location, B: null });
  const [activeSlot, setActiveSlot] = useState<SlotKey>('A');
  const [transitionSlots, setTransitionSlots] = useState<TransitionSlots | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMode, setTransitionMode] = useState<'desktop' | 'mobile' | null>(null);

  const queuedLocationRef = useRef<Location | null>(null);
  const transitionIdRef = useRef(0);
  const currentScrollYRef = useRef(0);

  const slotAPageRef = useRef<HTMLDivElement | null>(null);
  const slotBPageRef = useRef<HTMLDivElement | null>(null);
  const cornersRef = useRef<HTMLDivElement | null>(null);
  const mobileWipeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const activeLocation = slotLocations[activeSlot];
    const nextKey = routeTransitionKey(location);
    const activeKey = routeTransitionKey(activeLocation);
    const inFlightKey = transitionSlots ? routeTransitionKey(slotLocations[transitionSlots.incoming]) : '';

    if (nextKey === activeKey || nextKey === inFlightKey) {
      return;
    }

    if (isTransitioning) {
      queuedLocationRef.current = location;
      return;
    }

    const outgoing = activeSlot;
    const incoming = oppositeSlot(outgoing);
    currentScrollYRef.current = window.scrollY;
    queuedLocationRef.current = null;
    setSlotLocations((prev) => ({ ...prev, [incoming]: location }));
    setTransitionSlots({ outgoing, incoming });
    setIsTransitioning(true);
  }, [location, activeSlot, isTransitioning, slotLocations, transitionSlots]);

  useEffect(() => {
    if (!isTransitioning || !transitionSlots) {
      return;
    }

    const outgoingPage = transitionSlots.outgoing === 'A' ? slotAPageRef.current : slotBPageRef.current;
    const incomingPage = transitionSlots.incoming === 'A' ? slotAPageRef.current : slotBPageRef.current;
    const corners = cornersRef.current;
    const wipe = mobileWipeRef.current;

    if (!outgoingPage || !incomingPage || !corners || !wipe) {
      return;
    }

    const activeAnimations: Animation[] = [];
    const cancelAllAnimations = () => {
      while (activeAnimations.length > 0) {
        const animation = activeAnimations.pop();

        if (!animation) {
          continue;
        }

        animation.cancel();
      }
    };

    let cancelled = false;
    let finalized = false;
    const transitionId = ++transitionIdRef.current;
    const mode = window.innerWidth <= MOBILE_BREAKPOINT ? 'mobile' : 'desktop';

    setTransitionMode(mode);

    const previousBodyPointerEvents = document.body.style.pointerEvents;
    const previousBodyCursor = document.body.style.cursor;
    document.body.style.pointerEvents = 'none';
    document.body.style.cursor = 'wait';

    const resetTransitionStyles = () => {
      cleanupPageStyles(outgoingPage);
      cleanupPageStyles(incomingPage);
      corners.style.removeProperty('width');
      corners.style.removeProperty('height');
      wipe.style.removeProperty('translate');
    };

    const resetTransitionStylesDeferred = () => {
      requestAnimationFrame(() => {
        if (cancelled || transitionId !== transitionIdRef.current) {
          return;
        }

        resetTransitionStyles();
      });
    };

    const restoreBodyStyles = () => {
      document.body.style.pointerEvents = previousBodyPointerEvents;
      document.body.style.cursor = previousBodyCursor;
    };

    const finalizeTransition = (shouldProcessQueue: boolean, promoteIncoming: boolean) => {
      if (finalized) {
        return;
      }

      finalized = true;
      clearTimeout(timeoutId);
      if (!promoteIncoming) {
        cancelAllAnimations();
      }
      restoreBodyStyles();

      const promotedSlot = promoteIncoming ? transitionSlots.incoming : transitionSlots.outgoing;
      const cleanupSlot = promoteIncoming ? transitionSlots.outgoing : transitionSlots.incoming;
      const promotedLocation = slotLocations[promotedSlot];

      setActiveSlot(promotedSlot);
      setSlotLocations((prev) => ({ ...prev, [cleanupSlot]: null }));
      setTransitionSlots(null);
      setIsTransitioning(false);
      setTransitionMode(null);
      resetTransitionStylesDeferred();

      if (!shouldProcessQueue) {
        return;
      }

      const queuedLocation = queuedLocationRef.current;
      queuedLocationRef.current = null;

      if (!queuedLocation) {
        return;
      }

      if (routeTransitionKey(queuedLocation) === routeTransitionKey(promotedLocation)) {
        return;
      }

      const nextOutgoing = promotedSlot;
      const nextIncoming = oppositeSlot(nextOutgoing);
      setSlotLocations((prev) => ({ ...prev, [nextIncoming]: queuedLocation }));
      setTransitionSlots({ outgoing: nextOutgoing, incoming: nextIncoming });
      setIsTransitioning(true);
    };

    const timeoutId = window.setTimeout(() => {
      if (cancelled || finalized || transitionId !== transitionIdRef.current) {
        return;
      }

      finalizeTransition(true, true);
    }, TRANSITION_TIMEOUT_MS);

    outgoingPage.style.position = 'fixed';
    outgoingPage.style.inset = '0';
    outgoingPage.style.overflow = 'hidden';
    outgoingPage.style.height = '100vh';
    outgoingPage.style.willChange = 'translate, scale, opacity';

    incomingPage.style.position = 'fixed';
    incomingPage.style.inset = '0';
    incomingPage.style.overflow = 'hidden';
    incomingPage.style.height = '100vh';
    incomingPage.style.willChange = 'translate, scale, opacity';

    const runTransition = async () => {
      if (mode === 'mobile') {
        wipe.style.setProperty('translate', '0 120%');

        await animateElement(
          wipe,
          [{ translate: '0 120%' }, { translate: '0 0%' }],
          { duration: 900, easing: EASE_I3 },
          activeAnimations,
        );

        if (cancelled || transitionId !== transitionIdRef.current) {
          return;
        }

        await animateElement(
          wipe,
          [{ translate: '0 0%' }, { translate: '0 -120%' }],
          { duration: 900, easing: EASE_O3 },
          activeAnimations,
        );

        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const desktopTravelY = Math.round(
        Math.max(
          viewportHeight * DESKTOP_TRAVEL_MULTIPLIER,
          viewportHeight + toResponsivePixels(DESKTOP_MIN_TRAVEL_PADDING_REM, viewportWidth),
        ),
      );

      // Keep the outgoing viewport frozen at the user's current scroll position.
      outgoingPage.scrollTop = currentScrollYRef.current;
      incomingPage.scrollTop = 0;

      const expandedWidth = viewportWidth + toResponsivePixels(32, viewportWidth);
      const expandedHeight = viewportHeight + toResponsivePixels(32, viewportWidth);
      const contractedWidth = viewportWidth - toResponsivePixels(174, viewportWidth);
      const contractedHeight = viewportHeight - toResponsivePixels(60, viewportWidth);

      outgoingPage.style.setProperty('scale', '1');
      outgoingPage.style.setProperty('translate', '0 0');
      outgoingPage.style.setProperty('opacity', '1');

      incomingPage.style.setProperty('scale', `${DESKTOP_ENTER_START_SCALE}`);
      incomingPage.style.setProperty('translate', `0 ${desktopTravelY}px`);
      incomingPage.style.setProperty('opacity', '1');

      corners.style.width = `${expandedWidth}px`;
      corners.style.height = `${expandedHeight}px`;

      await Promise.all([
        animateElement(
          outgoingPage,
          [
            { scale: '1', offset: 0 },
            { scale: '0.88', offset: 0.35 },
            { scale: `${DESKTOP_EXIT_END_SCALE}`, offset: 1 },
          ],
          { duration: DESKTOP_SWAP_DURATION_MS, easing: EASE_SWAP },
          activeAnimations,
        ),
        animateElement(
          outgoingPage,
          [
            { translate: '0 0', offset: 0 },
            { translate: '0 0', offset: 0.28 },
            { translate: `0 ${-desktopTravelY}px`, offset: 1 },
          ],
          { duration: DESKTOP_SWAP_DURATION_MS, easing: EASE_SWAP },
          activeAnimations,
        ),
        animateElement(
          outgoingPage,
          [
            { opacity: 1, offset: 0 },
            { opacity: 0.95, offset: 0.58 },
            { opacity: 0, offset: 1 },
          ],
          { duration: DESKTOP_SWAP_DURATION_MS, easing: EASE_SWAP },
          activeAnimations,
        ),
        animateElement(
          incomingPage,
          [
            { translate: `0 ${desktopTravelY}px`, offset: 0 },
            { translate: '0 0', offset: 0.86 },
            { translate: '0 0', offset: 1 },
          ],
          { duration: DESKTOP_SWAP_DURATION_MS, easing: EASE_SWAP },
          activeAnimations,
        ),
        animateElement(
          incomingPage,
          [
            { scale: `${DESKTOP_ENTER_START_SCALE}`, offset: 0 },
            { scale: `${DESKTOP_ENTER_START_SCALE}`, offset: 0.8 },
            { scale: '1', offset: 1 },
          ],
          { duration: DESKTOP_SWAP_DURATION_MS, easing: EASE_SWAP },
          activeAnimations,
        ),
        animateElement(
          corners,
          [
            { width: `${expandedWidth}px`, height: `${expandedHeight}px`, offset: 0 },
            { width: `${contractedWidth}px`, height: `${contractedHeight}px`, offset: 0.46 },
            { width: `${expandedWidth}px`, height: `${expandedHeight}px`, offset: 1 },
          ],
          { duration: DESKTOP_SWAP_DURATION_MS, easing: EASE_SWAP },
          activeAnimations,
        ),
      ]);

      if (cancelled || transitionId !== transitionIdRef.current) {
        return;
      }

      outgoingPage.style.setProperty('opacity', '0');
    };

    void (async () => {
      try {
        await runTransition();

        if (cancelled || transitionId !== transitionIdRef.current) {
          finalizeTransition(false, false);
          return;
        }

        finalizeTransition(true, true);
      } catch {
        finalizeTransition(true, true);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      if (!finalized) {
        cancelAllAnimations();
      }
      restoreBodyStyles();
      if (!finalized) {
        resetTransitionStyles();
      }
    };
  }, [isTransitioning, slotLocations, transitionSlots]);

  const stacked = Boolean(isTransitioning && transitionSlots);
  const activeLocation = slotLocations[activeSlot];
  const incomingLocation = transitionSlots ? slotLocations[transitionSlots.incoming] : null;
  const transitionTint = routeTransitionTint(incomingLocation ?? activeLocation);

  return {
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
  };
};

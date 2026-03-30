import { createContext, useContext } from 'react';

export type RouteTransitionLayer = 'current' | 'incoming';
export type RouteTransitionMode = 'desktop' | 'mobile' | null;

type RouteTransitionMotionContextValue = {
  layer: RouteTransitionLayer;
  isTransitioning: boolean;
  mode: RouteTransitionMode;
};

export const RouteTransitionMotionContext = createContext<RouteTransitionMotionContextValue>({
  layer: 'current',
  isTransitioning: false,
  mode: null,
});

const DESKTOP_INCOMING_ENTER_DELAY_SEC = 0.55;
const MOBILE_INCOMING_ENTER_DELAY_SEC = 0.15;

export const useRouteTransitionMotion = () => {
  const { layer, isTransitioning, mode } = useContext(RouteTransitionMotionContext);

  const shouldRunEnter = layer === 'incoming' || !isTransitioning;
  const incomingEnterDelaySec =
    layer === 'incoming'
      ? mode === 'desktop'
        ? DESKTOP_INCOMING_ENTER_DELAY_SEC
        : MOBILE_INCOMING_ENTER_DELAY_SEC
      : 0;

  return {
    layer,
    isTransitioning,
    mode,
    shouldRunEnter,
    incomingEnterDelaySec,
  };
};

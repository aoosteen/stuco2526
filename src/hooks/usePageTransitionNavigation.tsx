import { createContext, useContext } from 'react';
import type { NavigateOptions, To } from 'react-router-dom';

export type NavigateWithTransition = (to: To, options?: NavigateOptions) => void;

const PageTransitionNavigationContext = createContext<NavigateWithTransition | null>(null);

export const PageTransitionNavigationProvider = PageTransitionNavigationContext.Provider;

export const usePageTransitionNavigation = () => {
  const navigateWithTransition = useContext(PageTransitionNavigationContext);

  if (!navigateWithTransition) {
    throw new Error('usePageTransitionNavigation must be used inside PageTransitionNavigationProvider');
  }

  return navigateWithTransition;
};

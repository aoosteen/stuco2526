import React, { forwardRef } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { usePageTransitionNavigation } from '../hooks/usePageTransitionNavigation';

const isModifiedEvent = (event: React.MouseEvent<HTMLAnchorElement>) =>
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

export const PageTransitionLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ onClick, reloadDocument, replace, state, target, to, ...rest }, ref) => {
    const navigateWithTransition = usePageTransitionNavigation();

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);

      if (event.defaultPrevented || reloadDocument) {
        return;
      }

      if (event.button !== 0 || isModifiedEvent(event)) {
        return;
      }

      if (target && target !== '_self') {
        return;
      }

      event.preventDefault();
      navigateWithTransition(to, { replace, state });
    };

    return (
      <Link
        {...rest}
        ref={ref}
        onClick={handleClick}
        reloadDocument={reloadDocument}
        replace={replace}
        state={state}
        target={target}
        to={to}
      />
    );
  },
);

PageTransitionLink.displayName = 'PageTransitionLink';

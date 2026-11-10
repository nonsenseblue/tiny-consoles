'use client';

import { useEffect, type HTMLAttributes } from 'react';

export type PressCuttingsProps = HTMLAttributes<HTMLElement>;

/**
 * Four piles of torn paper that square up into a sentence when opened.
 * Renders the <press-cuttings> Web Component; the piece itself lives in components/press-cuttings/.
 */
export function PressCuttings(props: PressCuttingsProps) {
  // load the Web Component in the browser only, so server rendering never touches the DOM
  useEffect(() => {
    void import('../../components/press-cuttings/src/press-cuttings.js');
  }, []);

  return <press-cuttings {...props} />;
}

export default PressCuttings;

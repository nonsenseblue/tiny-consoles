'use client';

import { useEffect, type HTMLAttributes } from 'react';

export type PlioceneCoastProps = HTMLAttributes<HTMLElement>;

/**
 * A torn paper collage of what the Galactic Railroad left in the ground; touched bone chips crumble into powder.
 * Renders the <pliocene-coast> Web Component; the piece itself lives in components/pliocene-coast/.
 */
export function PlioceneCoast(props: PlioceneCoastProps) {
  // load the Web Component in the browser only, so server rendering never touches the DOM
  useEffect(() => {
    void import('../../components/pliocene-coast/src/pliocene-coast.js');
  }, []);

  return <pliocene-coast {...props} />;
}

export default PlioceneCoast;

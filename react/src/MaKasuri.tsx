'use client';

import { useEffect, type HTMLAttributes } from 'react';

export type MaKasuriProps = HTMLAttributes<HTMLElement>;

/**
 * Four squares of kasuri cloth whose woven labels, once washed, say what went unsaid.
 * Renders the <ma-kasuri> Web Component; the piece itself lives in components/ma-kasuri/.
 */
export function MaKasuri(props: MaKasuriProps) {
  // load the Web Component in the browser only, so server rendering never touches the DOM
  useEffect(() => {
    void import('../../components/ma-kasuri/src/ma-kasuri.js');
  }, []);

  return <ma-kasuri {...props} />;
}

export default MaKasuri;

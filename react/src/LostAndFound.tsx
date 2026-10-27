'use client';

import { useEffect, type HTMLAttributes } from 'react';

export type LostAndFoundProps = HTMLAttributes<HTMLElement>;

/**
 * Four sheets from an imagined lost property register that write and stamp themselves.
 * Renders the <lost-and-found> Web Component; the piece itself lives in components/lost-and-found/.
 */
export function LostAndFound(props: LostAndFoundProps) {
  // load the Web Component in the browser only, so server rendering never touches the DOM
  useEffect(() => {
    void import('../../components/lost-and-found/src/lost-and-found.js');
  }, []);

  return <lost-and-found {...props} />;
}

export default LostAndFound;

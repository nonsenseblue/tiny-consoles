'use client';

import { useEffect, type HTMLAttributes } from 'react';

export type DeepSpaceProps = HTMLAttributes<HTMLElement>;

/**
 * Six tiny 1-bit screens with dithered space scenes.
 * Renders the <deep-space> Web Component; the piece itself lives in components/deep-space/.
 */
export function DeepSpace(props: DeepSpaceProps) {
  // load the Web Component in the browser only, so server rendering never touches the DOM
  useEffect(() => {
    void import('../../components/deep-space/src/deep-space.js');
  }, []);

  return <deep-space {...props} />;
}

export default DeepSpace;

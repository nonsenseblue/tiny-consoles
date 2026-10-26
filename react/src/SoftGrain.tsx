'use client';

import { useEffect, type HTMLAttributes } from 'react';

export type SoftGrainProps = HTMLAttributes<HTMLElement>;

/**
 * Six grainy gradient covers with fine line patterns.
 * Renders the <soft-grain> Web Component; the piece itself lives in components/soft-grain/.
 */
export function SoftGrain(props: SoftGrainProps) {
  // load the Web Component in the browser only, so server rendering never touches the DOM
  useEffect(() => {
    void import('../../components/soft-grain/src/soft-grain.js');
  }, []);

  return <soft-grain {...props} />;
}

export default SoftGrain;

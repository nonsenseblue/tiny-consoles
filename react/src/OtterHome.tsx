'use client';

import { useEffect, type HTMLAttributes } from 'react';

export type OtterHomeProps = HTMLAttributes<HTMLElement>;

/**
 * A house by the sea, presented like a headset launch; open it to step inside.
 * Renders the <otter-home> Web Component; the piece itself lives in components/otter-home/.
 */
export function OtterHome(props: OtterHomeProps) {
  // load the Web Component in the browser only, so server rendering never touches the DOM
  useEffect(() => {
    void import('../../components/otter-home/src/otter-home.js');
  }, []);

  return <otter-home {...props} />;
}

export default OtterHome;

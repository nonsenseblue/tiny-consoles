'use client';

import { useEffect, type HTMLAttributes } from 'react';

export type LongWayRoundProps = HTMLAttributes<HTMLElement>;

/**
 * A brand book for an imagined drinks house, turned one landscape page at a time.
 * Renders the <long-way-round> Web Component; the piece itself lives in components/long-way-round/.
 */
export function LongWayRound(props: LongWayRoundProps) {
  // load the Web Component in the browser only, so server rendering never touches the DOM
  useEffect(() => {
    void import('../../components/long-way-round/src/long-way-round.js');
  }, []);

  return <long-way-round {...props} />;
}

export default LongWayRound;

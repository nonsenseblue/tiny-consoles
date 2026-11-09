'use client';

import { useEffect, type HTMLAttributes } from 'react';

export type ClaimCheckProps = HTMLAttributes<HTMLElement>;

/**
 * A stack of claim tickets that fill themselves in when opened.
 * Renders the <claim-check> Web Component; the piece itself lives in components/claim-check/.
 */
export function ClaimCheck(props: ClaimCheckProps) {
  // load the Web Component in the browser only, so server rendering never touches the DOM
  useEffect(() => {
    void import('../../components/claim-check/src/claim-check.js');
  }, []);

  return <claim-check {...props} />;
}

export default ClaimCheck;

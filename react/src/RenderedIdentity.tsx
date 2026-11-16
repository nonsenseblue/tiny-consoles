'use client';

import { useEffect, type HTMLAttributes } from 'react';

export type RenderedIdentityProps = HTMLAttributes<HTMLElement>;

/**
 * A generative collage for four papers on long conversations with a language model.
 * Renders the <rendered-identity> Web Component; the piece itself lives in components/rendered-identity/.
 */
export function RenderedIdentity(props: RenderedIdentityProps) {
  // load the Web Component in the browser only, so server rendering never touches the DOM
  useEffect(() => {
    void import('../../components/rendered-identity/src/rendered-identity.js');
  }, []);

  return <rendered-identity {...props} />;
}

export default RenderedIdentity;

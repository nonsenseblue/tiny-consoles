'use client';
/**
 * <SoftGrain /> · tiny-consoles
 * React wrapper for the <soft-grain> Web Component. The drawing and motion live in
 * components/soft-grain/src/soft-grain.js; this file only loads it in the browser and renders the tag.
 *
 * Usage:
 *   import { SoftGrain } from 'tiny-consoles/react';
 *   <SoftGrain className="..." style={{ maxWidth: 960 }} />
 */

import { createElement, useEffect } from 'react';

export function SoftGrain(props) {
  /* loaded on the client only, so server rendering never touches the DOM */
  useEffect(() => { import('../components/soft-grain/src/soft-grain.js'); }, []);
  return createElement('soft-grain', props);
}

export default SoftGrain;

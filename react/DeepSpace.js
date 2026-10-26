'use client';
/**
 * <DeepSpace /> · tiny-consoles
 * React wrapper for the <deep-space> Web Component. The drawing and motion live in
 * components/deep-space/src/deep-space.js; this file only loads it in the browser and renders the tag.
 *
 * Usage:
 *   import { DeepSpace } from 'tiny-consoles/react';
 *   <DeepSpace className="..." style={{ maxWidth: 960 }} />
 */

import { createElement, useEffect } from 'react';

export function DeepSpace(props) {
  /* loaded on the client only, so server rendering never touches the DOM */
  useEffect(() => { import('../components/deep-space/src/deep-space.js'); }, []);
  return createElement('deep-space', props);
}

export default DeepSpace;

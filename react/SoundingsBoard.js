'use client';
/**
 * <SoundingsBoard /> · tiny-consoles
 * React wrapper for the <soundings-board> Web Component. The drawing and motion live in
 * components/soundings-board/src/soundings-board.js; this file only loads it in the browser and renders the tag.
 *
 * Usage:
 *   import { SoundingsBoard } from 'tiny-consoles/react';
 *   <SoundingsBoard className="..." style={{ maxWidth: 960 }} />
 */

import { createElement, useEffect } from 'react';

export function SoundingsBoard(props) {
  /* loaded on the client only, so server rendering never touches the DOM */
  useEffect(() => { import('../components/soundings-board/src/soundings-board.js'); }, []);
  return createElement('soundings-board', props);
}

export default SoundingsBoard;

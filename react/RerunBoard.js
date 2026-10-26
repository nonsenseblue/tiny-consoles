'use client';
/**
 * <RerunBoard /> · tiny-consoles
 * React wrapper for the <rerun-board> Web Component. The drawing and motion live in
 * components/rerun-board/src/rerun-board.js; this file only loads it in the browser and renders the tag.
 *
 * Usage:
 *   import { RerunBoard } from 'tiny-consoles/react';
 *   <RerunBoard className="..." style={{ maxWidth: 960 }} />
 */

import { createElement, useEffect } from 'react';

export function RerunBoard(props) {
  /* loaded on the client only, so server rendering never touches the DOM */
  useEffect(() => { import('../components/rerun-board/src/rerun-board.js'); }, []);
  return createElement('rerun-board', props);
}

export default RerunBoard;

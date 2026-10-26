'use client';

import { useEffect, type HTMLAttributes } from 'react';

export type RerunBoardProps = HTMLAttributes<HTMLElement>;

/**
 * An identity board where colonies of cells grow, count down and grow back.
 * Renders the <rerun-board> Web Component; the piece itself lives in components/rerun-board/.
 */
export function RerunBoard(props: RerunBoardProps) {
  // load the Web Component in the browser only, so server rendering never touches the DOM
  useEffect(() => {
    void import('../../components/rerun-board/src/rerun-board.js');
  }, []);

  return <rerun-board {...props} />;
}

export default RerunBoard;

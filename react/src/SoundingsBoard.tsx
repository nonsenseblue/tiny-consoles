'use client';

import { useEffect, type HTMLAttributes } from 'react';

export type SoundingsBoardProps = HTMLAttributes<HTMLElement>;

/**
 * An identity board for an imagined coastal listening station.
 * Renders the <soundings-board> Web Component; the piece itself lives in components/soundings-board/.
 */
export function SoundingsBoard(props: SoundingsBoardProps) {
  // load the Web Component in the browser only, so server rendering never touches the DOM
  useEffect(() => {
    void import('../../components/soundings-board/src/soundings-board.js');
  }, []);

  return <soundings-board {...props} />;
}

export default SoundingsBoard;

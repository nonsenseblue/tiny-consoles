'use client';

import { useEffect, type HTMLAttributes } from 'react';

export type DayForNightProps = HTMLAttributes<HTMLElement>;

/**
 * Four sheets of French New Wave paperwork whose English subtitles do not quite agree.
 * Renders the <day-for-night> Web Component; the piece itself lives in components/day-for-night/.
 */
export function DayForNight(props: DayForNightProps) {
  // load the Web Component in the browser only, so server rendering never touches the DOM
  useEffect(() => {
    void import('../../components/day-for-night/src/day-for-night.js');
  }, []);

  return <day-for-night {...props} />;
}

export default DayForNight;

import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type PieceElement = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

// the custom elements, so they can be written as JSX tags
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'soft-grain': PieceElement;
      'deep-space': PieceElement;
      'soundings-board': PieceElement;
      'rerun-board': PieceElement;
      'lost-and-found': PieceElement;
      'day-for-night': PieceElement;
    }
  }
}

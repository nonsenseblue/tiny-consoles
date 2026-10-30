/**
 * What every piece in tiny-consoles needs, written once.
 *
 * definePiece   registers the element. Put on a page, it loads its faces into the document (so the
 *               shadow root can use them) and <tag>.css from next to the piece into its shadow root,
 *               keeps its markup hidden until both are in, so it never flashes unstyled, then runs it.
 * fitBoard      lays sheets on a board drawn at a fixed size, and scales the board to its container.
 * onScreen      tells a piece whether it is on screen, so it only moves while it can be seen.
 * seeded        a small repeatable random, so a piece draws the same every time.
 *
 * Code: MIT · nonsenseblue
 */

/* style is the piece's stylesheet URL, built in the piece's own file so bundlers can see the asset.
   faces is a list of font specs, or [spec, text] when only some letters are needed. */
export function definePiece(tag, { style, font = null, markup = '', hide = null, faces = [], run }) {
  if (customElements.get(tag)) return;
  customElements.define(tag, class extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      if (font && !document.querySelector(`link[href="${font}"]`)) document.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${font}">`);
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `<link rel="stylesheet" href="${style}">${markup}`;
      const shell = hide && root.querySelector(hide);
      if (shell) shell.style.visibility = 'hidden';
      const start = () => {
        const ready = document.fonts && faces.length
          ? Promise.all(faces.map(f => (Array.isArray(f) ? document.fonts.load(...f) : document.fonts.load(f)))).catch(() => {})
          : Promise.resolve();
        ready.then(() => { if (shell) shell.style.visibility = ''; run(root, this); });
      };
      const link = root.querySelector('link');
      link.addEventListener('load', start, { once: true });
      link.addEventListener('error', start, { once: true });
    }
  });
}

/* choose(width) picks a layout { w, h, … } for the space there is; lay(layout) puts the sheets where
   that layout says. The board is set to the layout's size and the stage scaled by --k to fit the host.
   Returns a function giving the current scale. */
export function fitBoard(host, board, stage, choose, lay) {
  let current = null, k = 1;
  const fit = () => {
    const width = host.getBoundingClientRect().width;
    if (!width) return;
    const L = choose(width);
    if (L !== current) {
      current = L;
      board.style.setProperty('--w', L.w); board.style.setProperty('--h', L.h);
      lay(L);
    }
    k = width / L.w;
    stage.style.setProperty('--k', k);
  };
  new ResizeObserver(fit).observe(host);
  fit();
  return () => k;
}

/* calls back with true or false whenever the element comes on or goes off screen */
export function onScreen(el, callback, options) {
  if (!('IntersectionObserver' in window)) { callback(true); return; }
  new IntersectionObserver(entries => callback(entries.some(e => e.isIntersecting)), options).observe(el);
}

/* the Park–Miller generator: the same seed gives the same numbers, between 0 and 1 */
export const seeded = s => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;

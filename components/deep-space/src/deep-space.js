/**
 * <deep-space> · tiny-consoles
 * Six tiny 1-bit screens, each a live-dithered space scene.
 *
 * Usage:
 *   <script type="module" src="components/deep-space/src/deep-space.js"></script>
 *   <deep-space></deep-space>
 *
 * Styles: deep-space.css, next to this file (loaded automatically).
 * Design notes: ../DESIGN.md.
 * No dependencies. Respects prefers-reduced-motion.
 * Code: MIT · Visual design: CC BY 4.0 · nonsenseblue
 */

/* Styles live next to this file in deep-space.css; resolved from this file's own URL so it works anywhere it is embedded */
/* carries this file's ?v= stamp (set at deploy) over to its stylesheet, so both always update together */
const STYLE = new URL('./deep-space.css', import.meta.url).href + new URL(import.meta.url).search;

/* ---------- full size: a tile can be lifted out and looked at on its own ----------
   Click a tile to open it over a dimmed page; Prev, Next, the arrow keys or a swipe go through the others,
   Esc, Close or a click outside puts it back. The tile itself is moved, so it keeps running.
   mode 'scale' enlarges the tile as drawn; mode 'resize' gives it more room and lets it lay out again. */
const ZOOM_CSS = `
.zoom { margin: auto; padding: 0; border: 0; background: none; overflow: visible; max-width: none; max-height: none; cursor: default; color: #f3f2ef; }
.zoom::backdrop { background: rgba(18, 17, 16, .8); backdrop-filter: blur(3px); }
.zoom .zbox { position: relative; }
.zoom .zopen { position: absolute !important; left: 0 !important; top: 0 !important; margin: 0 !important; transform-origin: 0 0 !important; box-shadow: 0 30px 80px -30px rgba(0, 0, 0, .7); }
.zoom .zopen.scaled { transform: scale(var(--zoom, 1)) !important; }
.zoom .zopen.resized { transform: none !important; width: 100% !important; height: 100% !important; }
.zoom .zcap { margin-top: 14px; font: 500 11px/1.4 system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; opacity: .7; }
.zoom button { font: 400 13px system-ui, sans-serif; color: inherit; background: none; border: 1px solid rgba(243, 242, 239, .4); border-radius: 999px; padding: 6px 16px; cursor: pointer; transition: padding .25s cubic-bezier(.2,.8,.2,1), border-color .2s; }
.zoom button:hover, .zoom button:focus-visible { padding: 6px 22px; border-color: rgba(243, 242, 239, .85); outline: none; }
.zoom .zclose { position: fixed; top: 22px; right: 26px; }
.zoom .zprev, .zoom .znext { position: fixed; top: 50%; transform: translateY(-50%); }
.zoom .zprev { left: 26px; } .zoom .znext { right: 26px; }
@media (max-width: 720px) { .zoom .zprev, .zoom .znext { top: auto; bottom: 22px; transform: none; } }
.zhold { visibility: hidden; }
`;
function zoomable(root, items, { mode = 'scale', label = el => el.getAttribute('aria-label') || '', skip = () => false, after = () => {}, ignore = 'a, button, input' } = {}) {
  if (typeof HTMLDialogElement === 'undefined' || !('showModal' in HTMLDialogElement.prototype)) return null;
  root.append(Object.assign(document.createElement('style'), { textContent: ZOOM_CSS }));
  const dialog = document.createElement('dialog');
  dialog.className = 'zoom';
  dialog.innerHTML = '<div class="zbox"></div><p class="zcap"></p><button class="zclose" type="button">Close</button><button class="zprev" type="button">Prev</button><button class="znext" type="button">Next</button>';
  root.append(dialog);
  const box = dialog.querySelector('.zbox'), cap = dialog.querySelector('.zcap');
  let open = null, hold = null, size = null;

  const fit = () => {
    const k = Math.min(innerWidth * .86 / size.w, innerHeight * .78 / size.h);
    box.style.width = `${size.w * k}px`; box.style.height = `${size.h * k}px`;
    if (mode === 'scale') open.style.setProperty('--zoom', k);
    after(open);
  };
  const put = () => {
    hold.replaceWith(open);
    open.classList.remove('zopen', 'scaled', 'resized');
    open.style.removeProperty('--zoom'); open.style.removeProperty('width'); open.style.removeProperty('height');
    const el = open; open = null; after(el);
  };
  const show = el => {
    if (open) put();
    size = { w: el.offsetWidth, h: el.offsetHeight };
    hold = document.createElement('div');
    hold.className = 'zhold';
    hold.style.cssText = `aspect-ratio:${size.w} / ${size.h}`;
    el.replaceWith(hold);
    open = el;
    el.classList.add('zopen', mode === 'scale' ? 'scaled' : 'resized');
    if (mode === 'scale') { el.style.width = `${size.w}px`; el.style.height = `${size.h}px`; }
    box.append(el);
    cap.textContent = `${items.indexOf(el) + 1} / ${items.length}${label(el) ? ' · ' + label(el) : ''}`;
    if (!dialog.open) dialog.showModal();
    fit();
  };

  dialog.addEventListener('close', () => { if (open) put(); });
  const step = d => { if (open) { const n = items.length; show(items[(items.indexOf(open) + d + n) % n]); } };
  dialog.addEventListener('click', e => {
    if (e.target.closest('.zprev')) return step(-1);
    if (e.target.closest('.znext')) return step(1);
    if (e.target === dialog || e.target.closest('.zclose')) dialog.close();
  });
  /* keep the gallery's own keys and swipes from turning the page behind */
  dialog.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  /* a sideways swipe on a phone goes to the next or previous one */
  let sx = null;
  dialog.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });
  dialog.addEventListener('touchmove', e => e.stopPropagation(), { passive: true });
  dialog.addEventListener('wheel', e => e.stopPropagation());
  addEventListener('resize', () => { if (open) fit(); });
  items.forEach(el => el.addEventListener('click', e => {
    if (open || skip() || e.target.closest(ignore)) return;
    show(el);
  }));
  return { isOpen: el => el === open, scale: () => (open && mode === 'scale' ? parseFloat(open.style.getPropertyValue('--zoom')) : 1) };
}

function run(root) {
  const TAU = Math.PI * 2;
  const clamp = v => Math.min(1, Math.max(0, v));
  const fract = v => v - Math.floor(v);
  const hash = n => fract(Math.sin(n * 127.1) * 43758.5453);
  const h2 = (x, y) => hash(x * 12.9898 + y * 78.233);
  const stars = (u, v, t, dens = 0.985, scale = 110) => {
    const cx = Math.floor(u * scale), cy = Math.floor(v * scale), h = h2(cx, cy);
    if (h < dens) return 0;
    return 0.55 + 0.45 * Math.sin(t * (1 + h * 3) + h * 40);
  };

  /* ---------- scenes: f(u, v, t, ox, oy) -> 0..1, u/v in 0..1 ---------- */
  const SCENES = [
    { lines: ['TWO SUNS', 'AT DUSK'], f(u, v, t, ox, oy) {
      u += ox * 0.02;
      const hz = 0.74 + 0.025 * Math.sin(u * 8 + 1.3) + 0.012 * Math.sin(u * 23);
      if (v > hz) {
        const d = v - hz;
        return 0.1 + 0.22 * Math.exp(-d * 9) + 0.12 * Math.max(0, Math.sin(d * 70 - u * 10 + 2));
      }
      let s = 0.02 + 0.5 * Math.pow(v / hz, 5);
      const sink = 0.012 * Math.sin(t * 0.12);
      const suns = [[0.32 - ox * 0.03, 0.27 + sink, 0.065], [0.7 - ox * 0.03, 0.2 + sink, 0.04]];
      for (const [cx, cy, r] of suns) {
        const d = Math.hypot(u - cx, v - cy);
        s = Math.max(s, d < r ? 1 : s + 0.45 * Math.exp(-(d - r) / 0.025));
      }
      return s + 0.6 * stars(u, v, t, 0.99) * clamp(1 - v / hz * 1.6);
    } },
    { lines: ['JUMP TO', 'LIGHTSPEED'], f(u, v, t, ox, oy) {
      const dx = u - 0.5 - ox * 0.06, dy = v - 0.5 - oy * 0.06;
      const r = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
      const b = Math.floor(((a + Math.PI) / TAU) * 220), hh = hash(b + 1);
      let s = 0.4 * Math.exp(-r / 0.05);
      if (hh > 0.45) {
        const ph = fract(hh * 7.31 + t * (0.18 + hh * 0.3));
        const head = 0.05 + ph * 0.8, len = 0.06 + ph * 0.3;
        if (r < head && r > head - len) s = Math.max(s, ((r - (head - len)) / len) * clamp(r * 4));
      }
      return s;
    } },
    { lines: ['THROUGH THE', 'ASTEROID BELT'], f(u, v, t, ox, oy) {
      let s = 0.8 * stars(u + t * 0.004, v, t);
      for (let i = 0; i < 8; i++) {
        const sp = 0.012 + hash(i + 3) * 0.03;
        const cx = fract(hash(i + 9) - t * sp) * 1.4 - 0.2 - ox * (0.02 + i * 0.006);
        const cy = 0.1 + hash(i + 21) * 0.8 - oy * (0.02 + i * 0.006);
        const R = 0.035 + hash(i + 40) * 0.09;
        const dx = u - cx, dy = v - cy, a = Math.atan2(dy, dx);
        const rr = R * (1 + 0.14 * Math.sin(5 * a + i * 2.1 + t * 0.2) + 0.07 * Math.sin(9 * a + i));
        const d = Math.hypot(dx, dy);
        if (d < rr) {
          const nz = Math.sqrt(Math.max(0, 1 - (d / rr) ** 2));
          const lit = (-dx / rr) * 0.55 + (-dy / rr) * 0.45 + nz * 0.6;
          s = 0.05 + 0.8 * clamp(lit) + 0.12 * h2(Math.floor(u * 90), Math.floor(v * 90));
        }
      }
      return s;
    } },
    { lines: ['COLD', 'OUTPOST'], f(u, v, t, ox, oy) {
      let s = 0.06 + 0.16 * v;
      const far = 0.56 + 0.06 * Math.sin((u + ox * 0.01) * 6 + 0.5) + 0.025 * Math.sin(u * 19);
      const near = 0.72 + 0.03 * Math.sin((u + ox * 0.03) * 4 + 2);
      if (v > far) s = 0.3 + 0.2 * (v - far) * 4;
      if (v > near) s = 0.9 - 0.25 * Math.exp(-(v - near) * 30);
      const bx = 0.66 - ox * 0.03, by = near - 0.005;
      if (u > bx && u < bx + 0.07 && v > by - 0.05 && v < by) s = 0.12;
      if (u > bx + 0.02 && u < bx + 0.025 && v > by - 0.11 && v < by - 0.05) s = 0.12;
      if (Math.hypot(u - (bx + 0.0225), v - (by - 0.115)) < 0.008) s = 0.5 + 0.5 * Math.sin(t * 3);
      for (let i = 0; i < 70; i++) {
        const fx = fract(hash(i) + 0.03 * Math.sin(t * 0.6 + i) - ox * 0.02);
        const fy = fract(hash(i + 100) + t * (0.03 + hash(i + 7) * 0.04));
        if (Math.hypot(u - fx, v - fy) < 0.006 + hash(i + 50) * 0.004) s = 1;
      }
      return s;
    } },
    { lines: ['A RINGED', 'WORLD'], f(u, v, t, ox, oy) {
      const cx = 0.6 - ox * 0.04, cy = 0.66 - oy * 0.04, R = 0.22;
      let s = 0.85 * stars(u, v, t, 0.982);
      const dx = u - cx, dy = v - cy, d = Math.hypot(dx, dy);
      const tilt = -0.32, c = Math.cos(tilt), sn = Math.sin(tilt);
      const rx = dx * c - dy * sn, ry = dx * sn + dy * c;
      const e = Math.sqrt((rx / 0.46) ** 2 + (ry / 0.11) ** 2);
      const ring = e > 0.8 && e < 1 ? 0.3 + 0.35 * (0.5 + 0.5 * Math.sin(e * 70)) : 0;
      if (ring && ry < 0) s = ring;
      if (d < R) {
        const nz = Math.sqrt(1 - (d / R) ** 2);
        const lit = (-dx / R) * (0.6 + 0.1 * Math.sin(t * 0.07)) + (-dy / R) * 0.45 + nz * 0.55;
        const band = 0.06 * Math.sin((dy / R) * 18 + Math.sin(dx * 30) * 0.6);
        s = clamp(0.03 + 0.85 * clamp(lit) + band);
      }
      if (ring && ry >= 0) s = ring;
      return s;
    } },
    { lines: ['SIGNAL', 'RECEIVED'], f(u, v, t, ox, oy) {
      const cx = 0.5 + ox * 0.03, cy = 0.5 + oy * 0.03;
      const dx = u - cx, dy = v - cy, r = Math.hypot(dx, dy);
      if (r > 0.46) return 0.6 * stars(u, v, t, 0.988);
      const a = Math.atan2(dy, dx), sweep = fract(t * 0.12) * TAU;
      const diff = ((sweep - a) % TAU + TAU) % TAU;
      let s = 0.55 * Math.exp(-diff * 1.8);
      if (Math.abs(fract(r * 10) - 0.5) > 0.47) s = Math.max(s, 0.38);
      if (Math.abs(dx) < 0.003 || Math.abs(dy) < 0.003) s = Math.max(s, 0.3);
      for (let i = 0; i < 6; i++) {
        const ba = hash(i + 61) * TAU, br = 0.1 + hash(i + 71) * 0.32;
        const bd = Math.hypot(u - (cx + Math.cos(ba) * br), v - (cy + Math.sin(ba) * br));
        const bdiff = ((sweep - ba) % TAU + TAU) % TAU;
        if (bd < 0.016) s = Math.max(s, 0.25 + 0.75 * Math.exp(-bdiff * 0.9));
      }
      return s;
    } },
  ];

  /* ---------- 8x8 Bayer ---------- */
  const B = [0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,62,30,54,22,
             3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,29,53,21]
             .map(b => (b + 0.5) / 64);
  const INK = [242, 239, 230], VOID = [14, 14, 14];

  /* ---------- spring (stiffness 70, damping ratio 0.86) ---------- */
  const K = 70, C = 2 * 0.86 * Math.sqrt(K);
  class Spring {
    constructor() { this.x = 0; this.v = 0; this.t = 0; }
    step(dt) { const a = -K * (this.x - this.t) - C * this.v; this.v += a * dt; this.x += this.v * dt; }
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const PX = 3;                       /* css px per dither pixel */
  const wall = root.getElementById('wall');

  const cards = SCENES.map((sc, i) => {
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `<canvas></canvas><div class="idx">${String(i + 1).padStart(2, '0')}/06</div>
      <h2 class="title">${sc.lines.map(l => `<span>${l}</span>`).join('')}</h2>`;
    wall.appendChild(el);
    const cv = el.querySelector('canvas');
    const card = { el, cv, ctx: cv.getContext('2d'), sc, sx: new Spring(), sy: new Spring(), img: null, n: 0 };
    el.addEventListener('pointermove', e => {
      if (reduce.matches) return;
      const r = el.getBoundingClientRect();
      card.sx.t = ((e.clientX - r.left) / r.width) * 2 - 1;
      card.sy.t = ((e.clientY - r.top) / r.height) * 2 - 1;
    });
    el.addEventListener('pointerleave', () => { card.sx.t = card.sy.t = 0; });
    return card;
  });

  function size(card) {
    const w = card.el.getBoundingClientRect().width;
    const n = Math.max(40, Math.round(w / PX));
    if (n !== card.n) {
      card.n = n;
      card.cv.width = card.cv.height = n;
      card.img = card.ctx.createImageData(n, n);
    }
  }
  function draw(card, t) {
    const { n, img, sc } = card, d = img.data, ox = card.sx.x, oy = card.sy.x;
    for (let y = 0; y < n; y++) {
      const v = y / n, row = (y & 7) * 8;
      for (let x = 0; x < n; x++) {
        const val = sc.f(x / n, v, t, ox, oy);
        const on = val > 0.04 && clamp(val) > B[row + (x & 7)];
        const c = on ? INK : VOID, i = (y * n + x) * 4;
        d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
      }
    }
    card.ctx.putImageData(img, 0, 0);
  }

  const resizeAll = () => cards.forEach(size);
  zoomable(root, cards.map(c => c.el), { label: el => [...el.querySelectorAll('.title span')].map(s => s.textContent).join(' ') });
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => { resizeAll(); if (reduce.matches) cards.forEach(c => draw(c, 0)); });
    cards.forEach(c => ro.observe(c.el));
  }
  resizeAll();

  let last = performance.now(), acc = 0;
  function frame(now) {
    if (reduce.matches) { cards.forEach(c => draw(c, 0)); return; }
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    for (const c of cards) for (let k = 0; k < 4; k++) { c.sx.step(dt / 4); c.sy.step(dt / 4); }
    acc += dt;
    if (acc >= 1 / 30) {               /* dither at 30fps, it reads as a screen */
      acc = 0;
      const t = now / 1000;
      cards.forEach(c => draw(c, t));
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  reduce.addEventListener('change', () => {
    cards.forEach(c => { c.sx.x = c.sy.x = c.sx.v = c.sy.v = c.sx.t = c.sy.t = 0; });
    if (!reduce.matches) { last = performance.now(); requestAnimationFrame(frame); }
    else cards.forEach(c => draw(c, 0));
  });
}

class DeepSpace extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<link rel="stylesheet" href="${STYLE}"><div class="wall" id="wall" part="wall" style="visibility:hidden"></div>`;
    /* start only once the stylesheet is in, so the cards measure their real size and never flash unstyled */
    const link = root.querySelector('link');
    const start = () => { root.getElementById('wall').style.visibility = ''; run(root); };
    link.addEventListener('load', start, { once: true });
    link.addEventListener('error', start, { once: true });
  }
}

if (!customElements.get('deep-space')) customElements.define('deep-space', DeepSpace);

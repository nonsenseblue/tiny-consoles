/**
 * <soft-grain> · tiny-consoles
 * Six grainy gradient covers. Fine line patterns draw themselves in,
 * breathe slowly, and ripple outward line by line from the cursor.
 *
 * Usage:
 *   <script type="module" src="soft-grain.js"></script>
 *   <soft-grain></soft-grain>
 *
 * No dependencies. Respects prefers-reduced-motion.
 * Code: MIT · Visual design: CC BY 4.0 · nonsenseblue
 */

const CSS = ":host { display: block; container-type: inline-size; font-family: Inter, \"Inter Variable\", \"Helvetica Neue\", Arial, sans-serif; }\n  * { box-sizing: border-box; margin: 0; }\n\n  .wall {\n    width: 100%;\n    max-width: 1080px;\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: clamp(12px, 2.2vw, 28px);\n  }\n  @container (max-width: 760px) { .wall { grid-template-columns: repeat(2, 1fr); } }\n  @container (max-width: 460px) { .wall { grid-template-columns: 1fr; } }\n\n  /* ---------- card ---------- */\n  .card {\n    --ox: 0;               /* spring offset, -1..1, driven by JS */\n    --oy: 0;\n    position: relative;\n    aspect-ratio: 1;\n    border-radius: 20px;\n    overflow: hidden;\n    isolation: isolate;\n    container-type: inline-size;\n    background: linear-gradient(180deg, var(--top) 0%, var(--bottom) 100%);\n    transform: translateZ(0);\n  }\n  .card::after {             /* 0.5px inner hairline */\n    content: \"\";\n    position: absolute;\n    inset: 0;\n    border-radius: inherit;\n    box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.16);\n    pointer-events: none;\n    z-index: 6;\n  }\n\n  /* ---------- color blobs ---------- */\n  .blobs { position: absolute; inset: -12%; z-index: 0; }\n  .blob {\n    position: absolute;\n    width: var(--s);\n    height: var(--s);\n    left: calc(var(--x) - var(--s) / 2);\n    top: calc(var(--y) - var(--s) / 2);\n    border-radius: 50%;\n    background: radial-gradient(closest-side,\n      var(--c) 0%,\n      color-mix(in srgb, var(--c) 55%, transparent) 42%,\n      transparent 100%);\n    /* spring offset toward the cursor (composes with the drift animation) */\n    translate: calc(var(--ox) * var(--d) * 1cqw) calc(var(--oy) * var(--d) * 1cqw);\n    animation: var(--anim) var(--dur) ease-in-out var(--delay) infinite alternate;\n    will-change: transform, translate;\n  }\n  @keyframes drift-a {\n    0%   { transform: translate(0, 0) scale(1); }\n    50%  { transform: translate(7%, 5%) scale(1.07); }\n    100% { transform: translate(-4%, 8%) scale(0.96); }\n  }\n  @keyframes drift-b {\n    0%   { transform: translate(0, 0) scale(1.03); }\n    50%  { transform: translate(-8%, 4%) scale(0.95); }\n    100% { transform: translate(-3%, -6%) scale(1.06); }\n  }\n  @keyframes drift-c {\n    0%   { transform: translate(0, 0) scale(0.97); }\n    50%  { transform: translate(6%, -7%) scale(1.05); }\n    100% { transform: translate(9%, 2%) scale(1); }\n  }\n  @keyframes drift-d {\n    0%   { transform: translate(0, 0) scale(1.05); }\n    50%  { transform: translate(-6%, -5%) scale(0.98); }\n    100% { transform: translate(4%, -8%) scale(1.08); }\n  }\n\n  /* ---------- line pattern ---------- */\n  .pattern {\n    position: absolute;\n    left: -5%;\n    top: -5%;\n    width: 110%;\n    height: 110%;\n    z-index: 1;\n    opacity: 0.42;\n    pointer-events: none;\n    -webkit-mask-image: radial-gradient(circle at 50% 50%, transparent 0 19%, #000 56%);\n            mask-image: radial-gradient(circle at 50% 50%, transparent 0 19%, #000 56%);\n  }\n  .pattern path, .pattern line {\n    fill: none;\n    stroke: #fff;\n    stroke-width: 0.8;\n    vector-effect: non-scaling-stroke;\n    stroke-linecap: round;\n  }\n  .pattern circle { fill: #fff; }\n  /* each line draws itself in, then a slow brightness wave travels along the pattern */\n  .pattern .seg {\n    opacity: var(--base, 0.7);\n    stroke-dasharray: 1;\n    stroke-dashoffset: 1;\n    animation:\n      draw 2.8s cubic-bezier(.45, 0, .2, 1) var(--dl) forwards,\n      breathe 9s ease-in-out var(--bd) infinite;\n  }\n  @keyframes draw { to { stroke-dashoffset: 0; } }\n  .pattern .seg.dot {\n    stroke-dasharray: none;\n    stroke-dashoffset: 0;\n    animation:\n      pop 1.6s cubic-bezier(.45, 0, .2, 1) var(--dl) backwards,\n      breathe 9s ease-in-out var(--bd) infinite;\n  }\n  @keyframes pop { from { opacity: 0; } }\n  @keyframes breathe {\n    0%, 100% { stroke-opacity: 1; }\n    50%      { stroke-opacity: 0.4; }\n  }\n  .pattern circle.ln { fill: none; stroke: #fff; stroke-width: 0.8; vector-effect: non-scaling-stroke; }\n\n  /* ---------- shading: darker on the side away from the light ---------- */\n  .shade {\n    position: absolute;\n    inset: 0;\n    z-index: 2;\n    pointer-events: none;\n    mix-blend-mode: multiply;\n    background:\n      radial-gradient(120% 120% at calc(50% + var(--ox) * 22%) calc(42% + var(--oy) * 22%),\n        rgba(0, 0, 0, 0) 42%, rgba(4, 10, 18, 0.30) 100%);\n  }\n\n  /* ---------- cursor glow ---------- */\n  .glow {\n    position: absolute;\n    inset: 0;\n    z-index: 2;\n    pointer-events: none;\n    opacity: 0;\n    transition: opacity 0.7s ease;\n    mix-blend-mode: screen;\n    background: radial-gradient(circle at\n      calc(50% + var(--ox) * 50%) calc(50% + var(--oy) * 50%),\n      rgba(255, 255, 255, 0.26) 0%,\n      rgba(255, 255, 255, 0.10) 20%,\n      rgba(255, 255, 255, 0) 46%);\n  }\n  .card.is-hover .glow { opacity: 1; }\n\n  /* ---------- grain ---------- */\n  .noise {\n    position: absolute;\n    inset: 0;\n    width: 100%;\n    height: 100%;\n    z-index: 3;\n    mix-blend-mode: overlay;\n    opacity: 0.4;\n    pointer-events: none;\n    image-rendering: pixelated;\n  }\n\n  /* ---------- title ---------- */\n  .title {\n    position: absolute;\n    inset: 0;\n    z-index: 4;\n    display: grid;\n    place-content: center;\n    text-align: center;\n    color: #fff;\n    font-weight: 400;\n    font-size: 8cqw;\n    line-height: 1.18;\n    letter-spacing: -0.01em;\n    pointer-events: none;\n    translate: calc(var(--ox) * -1.4cqw) calc(var(--oy) * -1.4cqw);\n    text-shadow:\n      calc(var(--ox) * -0.4cqw) calc(0.5cqw + var(--oy) * -0.4cqw) 2.2cqw rgba(0, 10, 20, 0.22);\n  }\n  .title span { display: block; }\n\n  /* ---------- reduced motion ---------- */\n  @media (prefers-reduced-motion: reduce) {\n    .blob { animation: none !important; }\n    .blob { translate: none !important; }\n    .pattern .seg { animation: none !important; stroke-dasharray: none; stroke-dashoffset: 0; }\n    .glow { display: none; }\n    .title { translate: none; }\n  }\n";

function run(root) {
  /* ---------- data: one adjacent-hue family per card ---------- */
  const CARDS = [
    { lines: ['Slow Light', 'in Bloom'],  top: '#efe4f3', bottom: '#d6884c',
      blobs: ['#c98bd6', '#ee9fbf', '#f1a86f', '#e6b247'], pattern: 'rays' },
    { lines: ['Dust and', 'Driftwood'],   top: '#d3dbe2', bottom: '#4b3628',
      blobs: ['#9fb0c0', '#8e8b87', '#76563f', '#3e2a1d'], pattern: 'dots' },
    { lines: ['Under', 'Deep Water'],     top: '#dbe6ef', bottom: '#0e2747',
      blobs: ['#adc5d9', '#6d93ba', '#2c5a8c', '#122f57'], pattern: 'wave' },
    { lines: ['Moss', 'and Mist'],        top: '#d8e4e8', bottom: '#1d382f',
      blobs: ['#a8c4cc', '#7ca7a2', '#3f6e5f', '#21423a'], pattern: 'contour' },
    { lines: ['Lavender', 'Midnight'],    top: '#e8e1f5', bottom: '#20183d',
      blobs: ['#c6b6ea', '#9b86d3', '#5c479b', '#2c205a'], pattern: 'lens' },
    { lines: ['Rust', 'Weather'],         top: '#e1e5e8', bottom: '#6b2819',
      blobs: ['#bfc8ce', '#c99c8b', '#ab5639', '#7b2d1c'], pattern: null },
  ];

  /* blob layout inside the (inset -12%) blob layer: corners and edges */
  const SLOTS = [
    { x: '16%', y: '14%', s: '64%', d: 6, anim: 'drift-a', dur: 20 },
    { x: '86%', y: '24%', s: '58%', d: 8, anim: 'drift-b', dur: 23 },
    { x: '18%', y: '84%', s: '68%', d: 7, anim: 'drift-c', dur: 26 },
    { x: '84%', y: '88%', s: '72%', d: 9, anim: 'drift-d', dur: 28 },
  ];

  /* ---------- SVG line patterns (viewBox 0 0 100 100) ---------- */
  const f = n => n.toFixed(2);
  const seeded = seed => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const PATTERNS = {
    rays() {
      let s = '';
      const n = 64;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const c = Math.cos(a), si = Math.sin(a);
        s += `<line x1="${f(50 + c * 6)}" y1="${f(50 + si * 6)}" x2="${f(50 + c * 92)}" y2="${f(50 + si * 92)}"/>`;
      }
      return s;
    },
    contour() {
      let s = '';
      const cx = 53, cy = 47;
      for (let i = 1; i <= 17; i++) {
        const r = 3 + i * 3.6;
        let d = '';
        for (let k = 0; k <= 96; k++) {
          const a = (k / 96) * Math.PI * 2;
          const rr = r * (1 + 0.07 * Math.sin(3 * a + i * 0.45) + 0.04 * Math.sin(5 * a - i * 0.3));
          d += (k ? 'L' : 'M') + f(cx + Math.cos(a) * rr) + ' ' + f(cy + Math.sin(a) * rr);
        }
        s += `<path d="${d}Z"/>`;
      }
      return s;
    },
    wave() {
      let s = '';
      const lines = 13;
      for (let i = 0; i < lines; i++) {
        const y0 = 14 + i * 6;
        const amp = 9 * (1 - Math.abs(i - (lines - 1) / 2) / (lines / 2 + 1));
        let d = '';
        for (let x = -6; x <= 106; x += 0.8) {
          const env = Math.exp(-Math.pow((x - 50) / 24, 2));
          const y = y0 + env * amp * Math.sin(x * 0.55 + i * 0.8) * Math.sin(x * 0.11 + 1.2);
          d += (x === -6 ? 'M' : 'L') + f(x) + ' ' + f(y);
        }
        s += `<path d="${d}"/>`;
      }
      return s;
    },
    dots() {
      let s = '';
      for (let x = 2.5; x < 100; x += 5) {
        for (let y = 2.5; y < 100; y += 5) {
          const dist = Math.hypot(x - 50, y - 50);
          s += `<circle cx="${x}" cy="${y}" r="${f(0.22 + dist * 0.006)}"/>`;
        }
      }
      return s;
    },
    lens() {
      let s = '';
      const radii = [];
      for (let r = 41; r < 600; r *= 1.32) radii.push(r);
      for (const r of radii) {
        s += `<path d="M50 9A${f(r)} ${f(r)} 0 0 1 50 91A${f(r)} ${f(r)} 0 0 1 50 9Z"/>`;
        s += `<path d="M9 50A${f(r)} ${f(r)} 0 0 0 91 50A${f(r)} ${f(r)} 0 0 0 9 50Z"/>`;
      }
      return s;
    },
    ripple() {
      /* water rings: two drops, circles interfering */
      let s = '';
      const drops = [[30, 70, 46], [74, 28, 40]];
      for (const [cx, cy, max] of drops) {
        for (let r = 3; r <= max; r += 3.4) {
          s += `<circle class="ln" cx="${cx}" cy="${cy}" r="${f(r)}"/>`;
        }
      }
      return s;
    },
    rings() {
      /* tree rings: uneven growth, slightly off-round */
      const rnd = seeded(7);
      let s = '', r = 2;
      const cx = 46, cy = 55;
      while (r < 70) {
        r += 1.4 + rnd() * 2.8;
        const p1 = rnd() * 6, p2 = rnd() * 6;
        let d = '';
        for (let k = 0; k <= 120; k++) {
          const a = (k / 120) * Math.PI * 2;
          const rr = r * (1 + 0.05 * Math.sin(2 * a + p1) + 0.025 * Math.sin(7 * a + p2)) + Math.max(0, Math.cos(a - 0.6)) * r * 0.08;
          d += (k ? 'L' : 'M') + f(cx + Math.cos(a) * rr) + ' ' + f(cy + Math.sin(a) * rr);
        }
        s += `<path d="${d}Z"/>`;
      }
      return s;
    },
    strata() {
      /* rock strata: gently folded layers of uneven thickness */
      const rnd = seeded(3);
      let s = '', y0 = 2;
      while (y0 < 112) {
        y0 += 2 + rnd() * 5;
        const ph = rnd() * 2;
        let d = '';
        for (let x = -6; x <= 106; x += 1) {
          const fold = 10 * Math.exp(-Math.pow((x - 58) / 26, 2));
          const y = y0 - 14 + fold + 1.6 * Math.sin(x * 0.07 + ph) + (x - 50) * 0.12;
          d += (x === -6 ? 'M' : 'L') + f(x) + ' ' + f(y);
        }
        s += `<path d="${d}"/>`;
      }
      return s;
    },
  };

  /* ---------- build DOM ---------- */
  const wall = root.getElementById('wall');
  for (const c of CARDS) {
    const card = document.createElement('article');
    card.className = 'card';
    card.style.setProperty('--top', c.top);
    card.style.setProperty('--bottom', c.bottom);

    const blobs = SLOTS.map((p, i) =>
      `<div class="blob" style="--c:${c.blobs[i]};--x:${p.x};--y:${p.y};--s:${p.s};--d:${p.d};` +
      `--anim:${p.anim};--dur:${p.dur}s;--delay:-${(Math.random() * p.dur).toFixed(1)}s"></div>`
    ).join('');

    const pattern = c.pattern
      ? `<svg class="pattern" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${PATTERNS[c.pattern]()}</svg>`
      : '';

    card.innerHTML =
      `<div class="blobs" aria-hidden="true">${blobs}</div>` +
      pattern +
      `<div class="shade" aria-hidden="true"></div>` +
      `<div class="glow" aria-hidden="true"></div>` +
      `<canvas class="noise" aria-hidden="true"></canvas>` +
      `<h2 class="title">${c.lines.map(l => `<span>${l}</span>`).join('')}</h2>`;
    wall.appendChild(card);
  }
  const cards = [...wall.querySelectorAll('.card')];

  /* ---------- grain: 128x128 grayscale tile, 1 noise px = 1 device px ---------- */
  const tile = document.createElement('canvas');
  tile.width = tile.height = 128;
  {
    const tx = tile.getContext('2d');
    const img = tx.createImageData(128, 128);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 256) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    tx.putImageData(img, 0, 0);
  }

  function paintNoise(cv) {
    const rect = cv.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = ctx.createPattern(tile, 'repeat');
    ctx.fillRect(0, 0, w, h);
  }
  const paintAll = () => cards.forEach(c => paintNoise(c.querySelector('.noise')));

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(entries => entries.forEach(e => paintNoise(e.target.querySelector('.noise'))));
    cards.forEach(c => ro.observe(c));
  }
  window.addEventListener('resize', paintAll);
  /* re-render when devicePixelRatio changes (zoom, moving between screens) */
  (function watchDpr() {
    const mq = matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    mq.addEventListener('change', () => { paintAll(); watchDpr(); }, { once: true });
  })();
  paintAll();

  /* ---------- spring: stiffness 70, damping ratio 0.86, mass 1 ---------- */
  const K = 70, ZETA = 0.86, C = 2 * ZETA * Math.sqrt(K);
  class Spring {
    constructor() { this.x = 0; this.v = 0; this.t = 0; }
    step(dt) {
      const a = -K * (this.x - this.t) - C * this.v;
      this.v += a * dt;           /* semi-implicit Euler */
      this.x += this.v * dt;
    }
    atRest() { return Math.abs(this.x - this.t) < 1e-4 && Math.abs(this.v) < 1e-4; }
    snap() { this.x = this.t; this.v = 0; }
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const resets = [];
  const DELAY_PER_UNIT = 11;   /* ms of lag per viewBox unit of distance from the cursor */
  const SHIFT = 2.6;           /* max line shift, viewBox units */
  const sampleAt = (hist, t) => {
    for (let i = hist.length - 1; i >= 0; i--) if (hist[i].t <= t) return hist[i];
    return hist[0];
  };

  cards.forEach(card => {
    const sx = new Spring(), sy = new Spring();

    /* every line of the pattern gets its own springs and its own lag */
    const segs = [];
    const svg = card.querySelector('.pattern');
    if (svg) {
      const els = [...svg.querySelectorAll('path, line, circle')];
      const n = els.length;
      els.forEach((el, i) => {
        const L = el.getTotalLength();
        const pts = [];
        for (let k = 0; k <= 32; k++) {
          const q = el.getPointAtLength((L * k) / 32);
          pts.push(q.x, q.y);
        }
        el.classList.add('seg');
        if (el.tagName === 'circle' && !el.classList.contains('ln')) el.classList.add('dot');
        el.setAttribute('pathLength', '1');
        el.style.setProperty('--dl', (0.3 + (i / n) * 2.2).toFixed(2) + 's');
        el.style.setProperty('--bd', (3.4 + (i / n) * 6).toFixed(2) + 's');
        /* depth: inner / upper lines sit far back, outer / lower lines come forward */
        const z = 0.3 + (n > 1 ? i / (n - 1) : 1) * 1.5;
        el.style.setProperty('--base', (0.35 + 0.55 * (z - 0.3) / 1.5).toFixed(3));
        segs.push({ el, pts, z, x: new Spring(), y: new Spring(), g: new Spring(), delay: 0, prox: 0 });
      });
    }

    let hist = [{ t: 0, x: 0, y: 0, h: 0 }];
    let lastChange = 0, maxDelay = 0, raf = 0, last = 0;

    const push = (x, y, h) => {
      const t = performance.now();
      hist.push({ t, x, y, h });
      lastChange = t;
      while (hist.length > 2 && hist[1].t < t - 2500) hist.shift();
    };
    const measure = (cx, cy) => {
      maxDelay = 0;
      for (const sg of segs) {
        let d = Infinity;
        for (let k = 0; k < sg.pts.length; k += 2) {
          const dd = Math.hypot(sg.pts[k] - cx, sg.pts[k + 1] - cy);
          if (dd < d) d = dd;
        }
        sg.delay = d * DELAY_PER_UNIT;
        sg.prox = Math.max(0, 1 - d / 32);
        if (sg.delay > maxDelay) maxDelay = sg.delay;
      }
    };

    const apply = () => {
      card.style.setProperty('--ox', sx.x.toFixed(4));
      card.style.setProperty('--oy', sy.x.toFixed(4));
      for (const sg of segs) {
        sg.el.setAttribute('transform', `translate(${sg.x.x.toFixed(3)} ${sg.y.x.toFixed(3)})`);
        sg.el.style.opacity = `calc(var(--base) + ${(0.45 * sg.g.x).toFixed(3)})`;
      }
    };
    const tick = now => {
      const dt = Math.min(Math.max((now - last) / 1000, 0), 1 / 20);
      last = now;
      for (const sg of segs) {
        const h = sampleAt(hist, now - sg.delay);
        sg.x.t = -h.x * SHIFT * sg.z;
        sg.y.t = -h.y * SHIFT * sg.z;
        sg.g.t = h.h * sg.prox;
      }
      const sub = 4;
      for (let i = 0; i < sub; i++) {
        sx.step(dt / sub); sy.step(dt / sub);
        for (const sg of segs) { sg.x.step(dt / sub); sg.y.step(dt / sub); sg.g.step(dt / sub); }
      }
      const waiting = now - lastChange < maxDelay + 40;
      const moving = !sx.atRest() || !sy.atRest() || segs.some(sg => !sg.x.atRest() || !sg.y.atRest() || !sg.g.atRest());
      if (!waiting && !moving) {
        sx.snap(); sy.snap();
        segs.forEach(sg => { sg.x.snap(); sg.y.snap(); sg.g.snap(); });
        apply(); raf = 0; return;
      }
      apply();
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    };

    card.addEventListener('pointermove', e => {
      if (reduce.matches) return;
      const r = card.getBoundingClientRect();
      const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
      const nx = Math.min(1, Math.max(-1, u * 2 - 1));
      const ny = Math.min(1, Math.max(-1, v * 2 - 1));
      sx.t = nx; sy.t = ny;
      /* cursor in pattern coordinates (svg spans -5%..105% of the card) */
      measure((u * 100 + 5) / 1.1, (v * 100 + 5) / 1.1);
      push(nx, ny, 1);
      card.classList.add('is-hover');
      kick();
    });
    card.addEventListener('pointerleave', () => {
      sx.t = sy.t = 0;
      push(0, 0, 0);   /* the return also ripples outward from where the cursor left */
      card.classList.remove('is-hover');
      if (!reduce.matches) kick();
    });

    resets.push(() => {
      cancelAnimationFrame(raf); raf = 0;
      hist = [{ t: 0, x: 0, y: 0, h: 0 }];
      sx.t = sy.t = 0; sx.snap(); sy.snap();
      segs.forEach(sg => { sg.x.t = sg.y.t = sg.g.t = 0; sg.x.snap(); sg.y.snap(); sg.g.snap(); });
      apply();
      card.classList.remove('is-hover');
    });
  });

  reduce.addEventListener('change', () => { if (reduce.matches) resets.forEach(fn => fn()); });
}

class SoftGrain extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${CSS}</style><div class="wall" id="wall" part="wall"></div>`;
    run(root);
  }
}

if (!customElements.get('soft-grain')) customElements.define('soft-grain', SoftGrain);

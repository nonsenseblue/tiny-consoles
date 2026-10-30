/**
 * <soft-grain> · tiny-consoles
 * Six record sleeves from Slow Weather Records, an imagined label. On each, a grainy gradient
 * is cut into its own shape: a flower, an arch, the sea, moss, a record, rain on iron.
 * Fine line patterns draw themselves in, breathe slowly, and ripple outward line by line,
 * all six at once while idle, and from the cursor when it is over a sleeve.
 *
 * Usage:
 *   <script type="module" src="components/soft-grain/src/soft-grain.js"></script>
 *   <soft-grain></soft-grain>
 *
 * Styles: soft-grain.css, next to this file (loaded automatically).
 * Design notes: ../DESIGN.md.
 * No outside dependencies; shares a little code with the other pieces in components/shared/. Respects prefers-reduced-motion.
 * Code: MIT · Visual design: CC BY 4.0 · nonsenseblue
 */

import { definePiece, onScreen, seeded } from '../../shared/piece.js';
const STYLE = new URL('./soft-grain.css', import.meta.url).href + new URL(import.meta.url).search;

const FONT = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,300&display=swap';

function run(root) {
  /* ---------- data: one adjacent-hue family per card ---------- */
  const CARDS = [
    { title: 'Slow Light in Bloom', no: 'SWR-001 · LP', top: '#efe4f3', bottom: '#d6884c',
      blobs: ['#c98bd6', '#ee9fbf', '#f1a86f', '#e6b247'], pattern: 'rays', full: true,
      cut: 'left:30px;top:-110px;width:440px;height:440px', clip: 'bloom',
      at: 'left:16px;bottom:44px', meta: 'left:16px;bottom:14px' },
    { title: 'Dust and<br>Driftwood', no: 'SWR-002 · LP', top: '#d3dbe2', bottom: '#4b3628',
      blobs: ['#9fb0c0', '#8e8b87', '#76563f', '#3e2a1d'], pattern: 'dots', full: true,
      cut: 'left:150px;top:40px;width:180px;height:320px;border-radius:90px 90px 0 0',
      at: 'left:16px;top:16px', meta: 'left:16px;bottom:14px' },
    { title: 'Under Deep Water', no: 'SWR-003 · 2LP', top: '#dbe6ef', bottom: '#0e2747',
      blobs: ['#adc5d9', '#6d93ba', '#2c5a8c', '#122f57'], pattern: 'wave',
      cut: 'left:-60px;top:-60px;width:480px;height:480px', sticker: true,
      at: 'left:30px;bottom:52px', meta: 'left:30px;bottom:28px' },
    { title: 'Moss and Mist', no: 'SWR-004 · EP', top: '#d8e4e8', bottom: '#1d382f',
      blobs: ['#a8c4cc', '#7ca7a2', '#3f6e5f', '#21423a'], pattern: 'contour', full: true,
      cut: 'left:-50px;top:10px;width:340px;height:380px', clip: 'blob',
      at: 'right:16px;top:16px;text-align:right', meta: 'right:16px;bottom:14px;text-align:right' },
    { title: 'Lavender Midnight', no: 'SWR-005 · LP', top: '#e8e1f5', bottom: '#20183d',
      blobs: ['#c6b6ea', '#9b86d3', '#5c479b', '#2c205a'], pattern: 'lens', full: true,
      cut: 'left:30px;top:56px;width:250px;height:250px;border-radius:50%',
      at: 'left:16px;bottom:16px', meta: 'right:16px;top:18px;text-align:right' },
    { title: 'Rust Weather', no: 'SWR-006 · LP', top: '#e1e5e8', bottom: '#6b2819',
      blobs: ['#bfc8ce', '#c99c8b', '#ab5639', '#7b2d1c'], pattern: null,
      cut: 'left:0;top:0;width:360px;height:360px', clip: 'rain',
      at: 'left:16px;bottom:44px', meta: 'left:16px;bottom:14px' },
  ];

  /* ---------- the shapes the covers are cut into, in sleeve units (a sleeve is 360 across) ---------- */
  const CLIPS = {
    /* eight rounded petals around a small heart */
    bloom() {
      const cx = 220, cy = 220, n = 8, R = 214, r0 = 67;
      let d = '';
      for (let k = 0; k < n; k++) {
        const a = k / n * Math.PI * 2 - Math.PI / 2, a1 = a - Math.PI / n * 0.92, a2 = a + Math.PI / n * 0.92;
        const P = (ang, r) => `${(cx + Math.cos(ang) * r).toFixed(1)},${(cy + Math.sin(ang) * r).toFixed(1)}`;
        d += `${k ? ' L' : 'M'}${P(a1, r0)} C${P(a - 0.32, R * 1.12)} ${P(a + 0.32, R * 1.12)} ${P(a2, r0)}`;
      }
      return d + ' Z';
    },
    /* a soft, lopsided patch of moss */
    blob() {
      let d = '';
      for (let k = 0; k <= 64; k++) {
        const a = k / 64 * Math.PI * 2, r = 140 + Math.sin(a * 3 + 1) * 16 + Math.sin(a * 5) * 9;
        d += `${k ? ' L' : 'M'}${(165 + Math.cos(a) * r).toFixed(1)},${(190 + Math.sin(a) * r * 1.12).toFixed(1)}`;
      }
      return d + ' Z';
    },
    /* rain running down rusted iron: bars of uneven length, rounded at the foot */
    rain() {
      return [[150, 26, 250], [184, 22, 300], [214, 30, 214], [252, 18, 330], [278, 34, 270], [320, 22, 224]]
        .map(([x, w, h]) => `M${x},0 L${x + w},0 L${x + w},${h - w / 2} A${w / 2},${w / 2} 0 0 1 ${x},${h - w / 2} Z`).join(' ');
    },
  };

  /* blob layout inside the (inset -12%) blob layer: corners and edges */
  const SLOTS = [
    { x: '16%', y: '14%', s: '64%', d: 6, anim: 'drift-a', dur: 20 },
    { x: '86%', y: '24%', s: '58%', d: 8, anim: 'drift-b', dur: 23 },
    { x: '18%', y: '84%', s: '68%', d: 7, anim: 'drift-c', dur: 26 },
    { x: '84%', y: '88%', s: '72%', d: 9, anim: 'drift-d', dur: 28 },
  ];

  /* ---------- SVG line patterns (viewBox 0 0 100 100) ---------- */
  const f = n => n.toFixed(2);
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
      `<canvas class="noise" aria-hidden="true"></canvas>`;
    /* the full patterns keep their lines right into the middle; the sea keeps its soft, misty centre */
    if (c.full) card.classList.add('full');

    const sleeve = document.createElement('article');
    sleeve.className = 'sleeve';
    sleeve.innerHTML =
      `<div class="stage"><div class="cut" style="${c.cut}${c.clip ? `;clip-path:path('${CLIPS[c.clip]()}')` : ''}"></div>` +
      (c.sticker ? '<div class="sticker" aria-hidden="true"></div>' : '') +
      `<h2 class="title" style="${c.at}">${c.title}</h2>` +
      `<p class="meta" style="${c.meta}">Slow Weather Records<br>${c.no}</p></div>`;
    sleeve.querySelector('.cut').appendChild(card);
    wall.appendChild(sleeve);
  }
  const sleeves = [...wall.querySelectorAll('.sleeve')];
  /* every sleeve is drawn at 360 units and scaled to its cell */
  const fit = () => sleeves.forEach(sl => sl.style.setProperty('--k', sl.getBoundingClientRect().width / 360));
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(wall);
  fit();
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
  const drifters = [];
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
      const px = (svg.getBoundingClientRect().width || 100) / 100;
      els.forEach((el, i) => {
        const L = el.getTotalLength();
        const pts = [];
        for (let k = 0; k <= 32; k++) {
          const q = el.getPointAtLength((L * k) / 32);
          pts.push(q.x, q.y);
        }
        el.classList.add('seg');
        if (el.tagName === 'circle' && !el.classList.contains('ln')) el.classList.add('dot');
        /* non-scaling strokes dash in screen pixels, so give the draw-in the on-screen length
           (pathLength would cut lines short), then drop the dash once the line is fully drawn */
        el.style.setProperty('--len', (L * px + 2).toFixed(1));
        el.addEventListener('animationend', e => { if (e.animationName === 'draw') el.classList.add('drawn'); });
        el.style.setProperty('--dl', (0.3 + (i / n) * 2.2).toFixed(2) + 's');
        el.style.setProperty('--bd', (3.4 + (i / n) * 6).toFixed(2) + 's');
        /* depth: inner / upper lines sit far back, outer / lower lines come forward */
        const z = 0.3 + (n > 1 ? i / (n - 1) : 1) * 1.5;
        el.style.setProperty('--base', (0.55 + 0.45 * (z - 0.3) / 1.5).toFixed(3));
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

    /* aim the pattern at a point on the card (u, v in 0..1): from the cursor, or from the slow idle drift */
    const aim = (u, v) => {
      const nx = Math.min(1, Math.max(-1, u * 2 - 1));
      const ny = Math.min(1, Math.max(-1, v * 2 - 1));
      sx.t = nx; sy.t = ny;
      /* the point in pattern coordinates (svg spans -5%..105% of the card) */
      measure((u * 100 + 5) / 1.1, (v * 100 + 5) / 1.1);
      push(nx, ny, 1);
      kick();
    };
    let hovering = false;
    card.addEventListener('pointermove', e => {
      if (reduce.matches) return;
      const r = card.getBoundingClientRect();
      hovering = true;
      card.classList.add('is-hover');
      aim((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    });
    card.addEventListener('pointerleave', () => {
      hovering = false;
      card.classList.remove('is-hover');
    });
    drifters.push((t, i) => {
      if (hovering) return;
      aim(0.5 + 0.38 * Math.sin(t * 0.45 + i * 1.7), 0.5 + 0.38 * Math.sin(t * 0.31 + i * 2.3 + 1));
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

  /* idle: once the lines are drawn, all six sleeves breathe together, each on its own slow path.
     Only while the wall is on screen, and never with reduced motion. */
  let visible = true;
  onScreen(wall, on => { visible = on; });
  let t0 = 0;
  const drift = now => {
    if (!t0) t0 = now;
    if (visible && !reduce.matches && document.visibilityState === 'visible') {
      const t = (now - t0) / 1000;
      drifters.forEach((fn, i) => fn(t, i));
    }
    setTimeout(() => requestAnimationFrame(drift), 66);
  };
  setTimeout(() => requestAnimationFrame(drift), 3400);
}

definePiece('soft-grain', { style: STYLE, font: FONT, markup: '<div class="wall" id="wall" part="wall"></div>', hide: '#wall', run });

/**
 * <rerun-board> · tiny-consoles
 * An identity board for Rerun, an imagined institute that runs the same small life again and again.
 * Colonies of rounded cells grow in from a corner. The clock counts down eight minutes
 * (one real minute); at zero everything clears and grows again, almost the same.
 *
 * Usage:
 *   <script type="module" src="components/rerun-board/src/rerun-board.js"></script>
 *   <rerun-board></rerun-board>
 *
 * Styles: rerun-board.css, next to this file (loaded automatically).
 * Design notes: ../DESIGN.md.
 * No outside dependencies; shares a little code with the other pieces in components/shared/. Respects prefers-reduced-motion.
 * Code: MIT · Visual design: CC BY 4.0 · nonsenseblue
 */

import { definePiece, onScreen, seeded } from '../../shared/piece.js';

const FONT = 'https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap';

const MARKUP = `
<div class="board" part="board">
  <section class="tile front">
    <canvas data-c="front"></canvas>
    <div class="t serif wm" style="left:7%;top:10%">Rerun</div>
    <div class="t" style="left:7%;top:24%;color:var(--soft)">Same rule. Same seed.</div>
  </section>

  <section class="tile back">
    <i class="h" style="top:28%"></i><i class="h" style="top:70%"></i>
    <i class="v" style="left:6%"></i><i class="v" style="left:52%"></i><i class="v" style="left:94%"></i>
    <canvas data-c="mini" style="left:8%;top:8%;width:9%;height:auto;aspect-ratio:1"></canvas>
    <div class="t" style="left:55%;top:9%;color:var(--soft)">Registered<br>at first division</div>
    <div class="t" style="left:8%;top:34%"><span class="k">Subject</span></div>
    <div class="t serif no" style="left:8%;top:42%">No. <span data-n="3">013</span></div>
    <div class="t" style="left:55%;top:34%"><span class="k">Sequence</span>GATC TCGA<br>AGCT CTAG</div>
    <div class="t" style="left:8%;top:76%"><span class="k">Loop</span>08:00</div>
    <div class="t" style="left:55%;top:76%"><span class="k">Status</span><span class="valid">Valid</span></div>
  </section>

  <section class="tile poster">
    <canvas data-c="poster"></canvas>
    <div class="t serif hl" style="left:7%;top:5%">Small things,<br>run again.</div>
    <div class="t" style="left:7%;bottom:3.5%">Run <span data-n="4">0013</span> · <span data-clock>08:00</span> remaining</div>
  </section>

  <section class="tile mark">
    <canvas data-c="mark"></canvas>
    <div class="t" style="left:7%;bottom:6%"><span class="k">Mark</span>One cell and what it grew into</div>
  </section>

  <section class="tile label">
    <canvas data-c="label"></canvas>
    <div class="t" style="left:7%;top:8%"><span class="k" style="color:var(--muted)">Attempt</span></div>
    <div class="t serif big" style="left:7%;top:15%"><b data-n="3" style="font-weight:400">013</b><span> / ∞</span></div>
    <div class="t" style="left:7%;bottom:8%;color:var(--pink)">Each run lasts eight minutes.<br>Each one is almost the same.</div>
  </section>
</div>`;

function run(root, host) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = s => [...root.querySelectorAll(s)];

  function noise(seed) {
    const r = seeded(seed), P = new Uint8Array(512), p = [...Array(256).keys()];
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) P[i] = p[i & 255];
    const fade = t => t * t * (3 - 2 * t), v = (x, y) => P[P[x & 255] + (y & 255)] / 255;
    return (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), u = fade(x - xi), w = fade(y - yi);
      const a = v(xi, yi), b = v(xi + 1, yi), c = v(xi, yi + 1), d = v(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
    };
  }

  const RUN = { n: 13 };

  /* a colony: rounded cells on a grid, growing in from a corner, smaller at the frontier,
     fused through soft necks once full grown, sprouting under the cursor */
  function colony(canvas, o) {
    const tile = canvas.parentElement;
    const st = { canvas, o, n: noise(o.seed), m: noise(o.seed + 1), mx: -1e4, my: -1e4, S: null };
    tile.addEventListener('pointermove', e => { const b = canvas.getBoundingClientRect(); st.mx = e.clientX - b.left; st.my = e.clientY - b.top; });
    tile.addEventListener('pointerleave', () => { st.mx = st.my = -1e4; });
    st.size = () => {
      const r = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      if (!r.width) return;
      st.W = r.width; st.H = r.height; canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d);
      st.ctx = canvas.getContext('2d'); st.ctx.setTransform(d, 0, 0, d, 0, 0);
      st.cell = r.width / o.across; st.cols = Math.ceil(r.width / st.cell) + 1; st.rows = Math.ceil(r.height / st.cell) + 1;
      st.S = new Float32Array(st.cols * st.rows); st.B = new Float32Array(st.cols * st.rows);
      /* keep every line of text clear */
      st.clear = [...tile.querySelectorAll('.t')].map(e => { const b = e.getBoundingClientRect(), p = st.cell * 0.6;
        return [b.left - r.left - p, b.top - r.top - p, b.right - r.left + p, b.bottom - r.top + p]; });
    };
    st.frame = (t, dt) => {
      if (!st.S) return;
      const { ctx, cols, rows, cell, n } = st, [fx, fy] = o.from, asp = st.H / st.W;
      const far = Math.hypot(Math.max(fx, 1 - fx), Math.max(fy, 1 - fy) * asp);
      const blocked = (i, j) => st.clear.some(([a, b, c, d]) => (i + 1) * cell > a && i * cell < c && (j + 1) * cell > b && j * cell < d);
      const dist = (i, j) => Math.hypot(i / cols - fx, (j / rows - fy) * asp) / far;
      /* the same field every run, plus a whisper that changes with the run number */
      const drift = RUN.n * 3.7;
      const base = (i, j) => n(i * 0.22, j * 0.22) + (st.m(i * 0.35 + drift, j * 0.35) - 0.5) * 0.14 + (1 - dist(i, j)) * o.reach;
      const arrive = (i, j) => dist(i, j) + (1.6 - base(i, j)) * 0.3;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const k = j * cols + i;
        if (blocked(i, j)) { st.S[k] += -st.S[k] * Math.min(1, dt * 7); continue; }
        const d = Math.hypot(i * cell + cell / 2 - st.mx, j * cell + cell / 2 - st.my);
        if (d < cell * 2.6 && n(i * 0.9 + 7, j * 0.9) > 0.42) st.B[k] = Math.max(st.B[k], 1 - d / (cell * 3.4));
        else st.B[k] = Math.max(0, st.B[k] - dt * 0.12);
        const reach = Math.min(1, Math.max(0, (t * 0.15 - arrive(i, j)) * 5));
        const v = base(i, j) + 0.04 * Math.sin(t * 0.8 + i * 0.5 + j * 0.3);
        const want = v > 1.15 ? Math.min(1, Math.max(0.35, (v - 1.1) * 4)) : 0;
        st.S[k] += (Math.max(want * reach, st.B[k]) - st.S[k]) * Math.min(1, dt * 7);
      }
      ctx.clearRect(0, 0, st.W, st.H); ctx.fillStyle = o.color;
      const sc = (i, j) => (i >= 0 && j >= 0 && i < cols && j < rows) ? st.S[j * cols + i] : 0;
      const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); };
      const c = cell * 0.78;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const k = sc(i, j); if (k < 0.08) continue;
        const s = c * k, x = i * cell + (c - s) / 2, y = j * cell + (c - s) / 2, r = s * 0.3;
        rr(x, y, s, s, r);
        if (k > 0.8 && sc(i + 1, j) > 0.8) { const w = s * 0.6; rr(x + s - r, j * cell + (c - w) / 2, cell - s + 2 * r, w, w * 0.3); }
        if (k > 0.8 && sc(i, j + 1) > 0.8) { const w = s * 0.6; rr(i * cell + (c - w) / 2, y + s - r, w, cell - s + 2 * r, w * 0.3); }
      }
    };
    return st;
  }

  /* the mark: one large cell and its first generation, joined by soft necks */
  function mark(canvas, small) {
    const r = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    if (!r.width) return;
    canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d);
    const ctx = canvas.getContext('2d'); ctx.setTransform(d, 0, 0, d, 0, 0);
    const G = ['00100', '01110', '11111', '01110', '00100'];
    const near = { '1,2': 1, '3,2': 1, '2,1': 1, '2,3': 1 };
    const u = Math.min(r.width, r.height) * (small ? 0.19 : 0.11), ox = r.width / 2 - u * 2.5, oy = r.height * (small ? 0.5 : 0.44) - u * 2.5;
    ctx.fillStyle = '#3a0b10';
    G.forEach((row, j) => [...row].forEach((v, i) => {
      if (v !== '1') return;
      const k = i === 2 && j === 2 ? 1 : near[`${i},${j}`] ? 0.82 : 0.55;
      const s = u * 0.8 * k, x = ox + i * u + (u * 0.8 - s) / 2, y = oy + j * u + (u * 0.8 - s) / 2;
      ctx.beginPath(); ctx.roundRect(x, y, s, s, s * 0.3); ctx.fill();
    }));
    const cx = ox + 2 * u + u * 0.4, cy = oy + 2 * u + u * 0.4, w = u * 0.4;
    ctx.beginPath(); ctx.roundRect(cx - u, cy - w / 2, u * 2, w, w * 0.3); ctx.fill();
    ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - u, w, u * 2, w * 0.3); ctx.fill();
  }

  const colonies = [], marks = [];
  $$('canvas[data-c]').forEach(cv => {
    const k = cv.dataset.c;
    if (k === 'poster') colonies.push(colony(cv, { seed: 3, from: [1, 1], across: 17, reach: 1.25, color: '#3a0b10' }));
    if (k === 'front')  colonies.push(colony(cv, { seed: 9, from: [1, 1], across: 30, reach: 0.95, color: '#ff4b2b' }));
    if (k === 'label')  colonies.push(colony(cv, { seed: 21, from: [1, 0.15], across: 20, reach: 1.0, color: '#ff4b2b' }));
    if (k === 'mark' || k === 'mini') marks.push([cv, k === 'mini']);
  });

  /* eight minutes on the clock, one real minute per run; at zero everything clears and grows again */
  const RUN_SECONDS = 60, SHOWN = 480, CLEAR = 1.4;
  const pad = (v, n) => String(v).padStart(n, '0');
  const clockEl = root.querySelector('[data-clock]');
  const label = () => $$('[data-n]').forEach(e => { e.textContent = pad(RUN.n, +e.dataset.n); });

  let lastW = 0, timer = 0;
  const layout = () => {
    const w = host.getBoundingClientRect().width;
    if (!w || Math.abs(w - lastW) < 1) return;
    lastW = w;
    colonies.forEach(c => c.size()); marks.forEach(([cv, small]) => mark(cv, small));
  };
  new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(layout, lastW ? 150 : 0); }).observe(host);
  layout();

  /* animate only while on screen; the clock keeps its own time either way */
  let visible = false, raf = 0, t0 = null, last = performance.now(), shown = '';
  const loop = now => {
    raf = 0;
    if (t0 === null) t0 = now;
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
    let e = (now - t0) / 1000;
    if (!reduce && e >= RUN_SECONDS) {
      t0 = now; e = 0; RUN.n++; label();
      colonies.forEach(c => c.B && c.B.fill(0));
    }
    const left = Math.max(0, Math.ceil(SHOWN * (1 - e / RUN_SECONDS)));
    const clock = reduce ? '08:00' : `${pad(Math.floor(left / 60), 2)}:${pad(left % 60, 2)}`;
    if (clock !== shown) { clockEl.textContent = clock; shown = clock; }
    const t = reduce ? 60 : e - CLEAR;
    colonies.forEach(c => c.frame(t, reduce ? 1 : dt));
    if (visible && !reduce) raf = requestAnimationFrame(loop);
  };
  onScreen(host, on => {
    visible = on;
    if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  });
  if (reduce) { layout(); loop(performance.now()); }
}

definePiece('rerun-board', { here: import.meta.url, font: FONT, markup: MARKUP, hide: '.board', faces: ['40px "Instrument Serif"'], run });

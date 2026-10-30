/**
 * <soundings-board> · tiny-consoles
 * An identity board for an imagined coastal listening station: a seabed section,
 * a business card on a visible grid, a depth readout that surfaces words on the way down,
 * an engraved swell and a traced seafloor chart. Everything is drawn in code.
 *
 * Usage:
 *   <script type="module" src="components/soundings-board/src/soundings-board.js"></script>
 *   <soundings-board></soundings-board>
 *
 * Styles: soundings-board.css, next to this file (loaded automatically).
 * Design notes: ../DESIGN.md.
 * No outside dependencies; shares a little code with the other pieces in components/shared/. Respects prefers-reduced-motion.
 * Code: MIT · Visual design: CC BY 4.0 · nonsenseblue
 */

import { definePiece, seeded } from '../../shared/piece.js';


const MARKUP = `
<div class="board" part="board">
  <section class="tile front">
    <div class="wm">Soundings</div>
    <div class="t no">Section 07 · Hyuga-nada</div>
    <canvas data-c="section"></canvas>
  </section>

  <section class="tile back">
    <svg class="t mark" style="left:5%;top:8%" viewBox="0 0 100 100" aria-hidden="true"></svg>
    <div class="t" style="left:58%;top:9%;color:var(--soft)">Listening station<br>for the coast</div>
    <div class="t name" style="left:5%;top:42%">Ren<br>Hayase</div>
    <div class="t" style="left:5%;top:78%"><span class="k">Role</span>Field Researcher</div>
    <div class="t" style="left:35%;top:78%"><span class="k">Tel</span>0985 XX XX XX</div>
    <div class="t" style="left:58%;top:78%"><span class="k">Mail</span>ren@soundings.example</div>
  </section>

  <section class="tile depth">
    <canvas data-c="water"></canvas>
    <div class="t hl">Readout</div>
    <div class="t hr">31.91 N · 131.42 E</div>
    <div class="line"></div>
  </section>

  <section class="tile swell">
    <canvas data-c="swell"></canvas>
    <div class="cap">Surface, engraved</div>
  </section>

  <section class="tile chart">
    <canvas data-c="chart"></canvas>
    <div class="title">Coastal<br>Record 03</div>
    <div class="t meta">Hyuga-nada seafloor<br>Contours every 15 m</div>
    <div class="t scale"><i></i>1 km</div>
  </section>
</div>`;

function run(root, host) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => root.querySelector(s);

  /* ---------- tools ---------- */
  function makeNoise(seed) {
    const r = seeded(seed), P = new Uint8Array(512), p = [...Array(256).keys()];
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) P[i] = p[i & 255];
    const fade = t => t * t * (3 - 2 * t), v = (x, y) => P[P[x & 255] + (y & 255)] / 255;
    const n = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), u = fade(x - xi), w = fade(y - yi);
      const a = v(xi, yi), b = v(xi + 1, yi), c = v(xi, yi + 1), d = v(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
    };
    return (x, y, oct = 4) => { let s = 0, amp = 0.5, f = 1, t = 0; for (let i = 0; i < oct; i++) { s += amp * n(x * f, y * f); t += amp; amp *= 0.5; f *= 2.03; } return s / t; };
  }
  function fit(name) {
    const canvas = $(`canvas[data-c="${name}"]`);
    const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(r.width * dpr)); canvas.height = Math.max(1, Math.round(r.height * dpr));
    const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { canvas, ctx, w: r.width, h: r.height };
  }
  function grain(ctx, canvas, amount, seed) {
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height), d = img.data, r = seeded(seed);
    for (let i = 0; i < d.length; i += 4) { const g = (r() - 0.5) * amount; d[i] += g; d[i + 1] += g; d[i + 2] += g; }
    ctx.putImageData(img, 0, 0);
  }
  /* marching squares, broken into short runs so it reads like a traced scan */
  function contours(ctx, w, h, field, levels, cell, keep) {
    const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1, F = new Float32Array(cols * rows);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) F[j * cols + i] = field(i * cell, j * cell);
    ctx.beginPath();
    for (const L of levels) for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
      const a = F[j * cols + i], b = F[j * cols + i + 1], c = F[(j + 1) * cols + i + 1], d = F[(j + 1) * cols + i];
      const k = (a > L) | ((b > L) << 1) | ((c > L) << 2) | ((d > L) << 3);
      if (k === 0 || k === 15) continue;
      const x = i * cell, y = j * cell;
      const T = [x + cell * (L - a) / (b - a), y], R = [x + cell, y + cell * (L - b) / (c - b)],
            B = [x + cell * (L - d) / (c - d), y + cell], Lf = [x, y + cell * (L - a) / (d - a)];
      const seg = {1:[[Lf,T]],2:[[T,R]],3:[[Lf,R]],4:[[R,B]],5:[[Lf,T],[R,B]],6:[[T,B]],7:[[Lf,B]],
                   8:[[B,Lf]],9:[[B,T]],10:[[T,R],[B,Lf]],11:[[B,R]],12:[[R,Lf]],13:[[R,T]],14:[[T,Lf]]}[k];
      for (const [p, q] of seg) if (keep(p[0], p[1], L)) { ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); }
    }
    ctx.stroke();
  }

  /* ---------- the mark: five readings, each a column of dots fading with depth ---------- */
  {
    let s = '';
    [3, 5, 6, 4, 2].forEach((depth, c) => {
      for (let r = 0; r < depth; r++) s += `<circle cx="${14 + c * 18}" cy="${14 + r * 15}" r="${(5.2 - r * 0.7).toFixed(2)}"/>`;
    });
    $('.mark').innerHTML = s;
  }

  /* ---------- card back hairlines ---------- */
  {
    const back = $('.back');
    for (const y of [26, 72]) back.insertAdjacentHTML('afterbegin', `<i class="h" style="top:${y}%"></i>`);
    for (const x of [3, 33, 56, 97]) back.insertAdjacentHTML('afterbegin', `<i class="v" style="left:${x}%"></i>`);
  }

  /* ---------- card front: seabed section with sounding lines ---------- */
  function drawSection() {
    const { ctx, w, h } = fit('section');
    const n = makeNoise(7), tex = makeNoise(19), gaps = makeNoise(23), rnd = seeded(11);
    const k = w / 460;                                      /* detail scales with the card */
    const surf = h * 0.38;
    const bed = x => { const u = x / w; return h * (0.6 + 0.2 * u * u) + h * 0.07 * (n(u * 3.2, 2.1, 4) - 0.5) * 3; };
    ctx.strokeStyle = 'rgba(30,30,29,.75)'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(0, surf); ctx.lineTo(w, surf); ctx.stroke();
    ctx.strokeStyle = 'rgba(30,30,29,.88)'; ctx.lineWidth = 0.8; ctx.lineCap = 'round';
    contours(ctx, w, h, (x, y) => y - bed(x), [0], 2, (x, y) => gaps(x / k * 0.05, y / k * 0.05, 2) < 0.8 && rnd() > 0.04);
    contours(ctx, w, h, (x, y) => tex(x / k * 0.1, y / k * 0.22, 3), [0.45, 0.56], 1.6, (x, y) => {
      const d = (y - bed(x)) / h;
      return d > 0.03 && gaps(x / k * 0.12, y / k * 0.12, 2) < 0.02 + d * 1.5 * (0.4 + x / w) && rnd() > 0.25;
    });
    ctx.setLineDash([1, 3]); ctx.lineWidth = 0.7; ctx.strokeStyle = 'rgba(30,30,29,.6)';
    ctx.fillStyle = 'rgba(30,30,29,.75)'; ctx.font = `500 ${Math.max(6, 7.5 * k).toFixed(1)}px Inter, sans-serif`; ctx.textAlign = 'center';
    const drops = 8;
    for (let i = 1; i <= drops; i++) {
      const x = (i - 0.5) * w / drops, b = bed(x);
      ctx.beginPath(); ctx.moveTo(x, surf + 3); ctx.lineTo(x, b - 3); ctx.stroke();
      ctx.fillText(Math.round((b - surf) / h * 140), x, surf - 6 * k);
    }
    ctx.setLineDash([]);
  }

  /* ---------- depth readout ---------- */
  const WORDS = ['swell', 'salt', 'tide', 'current', 'spray', 'drift', 'echo', 'pressure', 'shoal', 'undertow',
                 'kuroshio', 'silt', 'cold', 'dark', 'still', 'whale song', 'thermocline', 'bedrock', 'quiet', 'return'];
  const PHRASES = ['The sea keeps a record.', 'Listen down.', 'Every wave is a reading.'];
  function drawWater() {
    const { canvas, ctx, w, h } = fit('water');
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#5d6c73'); g.addColorStop(0.35, '#2b3337'); g.addColorStop(1, '#15191b');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    /* light shafts, painted small and scaled up so their edges go soft in every browser
       (iOS browsers ignore canvas blur filters) */
    const S = 14, sw = Math.max(8, Math.round(w / S)), sh = Math.max(8, Math.round(h / S));
    const off = document.createElement('canvas'); off.width = sw; off.height = sh;
    const o = off.getContext('2d');
    const r = seeded(4);
    for (let i = 0; i < 6; i++) {
      const x0 = sw * (0.25 + r() * 0.65), spread = sw * (0.04 + r() * 0.08), lean = sw * (0.18 + r() * 0.1);
      const sg = o.createLinearGradient(0, 0, 0, sh * 0.85);
      sg.addColorStop(0, `rgba(226,232,228,${0.18 + r() * 0.16})`); sg.addColorStop(1, 'rgba(226,232,228,0)');
      o.fillStyle = sg;
      o.beginPath(); o.moveTo(x0 - spread * 0.3, 0); o.lineTo(x0 + spread * 0.3, 0);
      o.lineTo(x0 - lean + spread, sh * 0.85); o.lineTo(x0 - lean - spread, sh * 0.85); o.fill();
    }
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    /* two passes at slightly different scales smooth out the upscaling */
    ctx.globalAlpha = 0.5; ctx.drawImage(off, 0, 0, w, h);
    ctx.drawImage(off, -w * 0.01, -h * 0.01, w * 1.02, h * 1.02);
    ctx.globalAlpha = 1;
    grain(ctx, canvas, 22, 5);
  }
  let placed = [];
  function placeDepth() {
    const box = $('.depth'), r = seeded(42), used = {};
    box.querySelectorAll('.tick, .w').forEach(e => e.remove());
    for (let m = 0; m <= 200; m += 25) {
      box.insertAdjacentHTML('beforeend', `<div class="tick" style="top:${10 + (m / 200) * 82}%">${m} m</div>`);
    }
    placed = [];
    const bx = box.getBoundingClientRect();
    const add = (text, x, y, size, o) => {
      const s = document.createElement('span');
      s.className = 'w'; s.textContent = text;
      s.style.left = x + '%'; s.style.top = y + '%'; s.style.fontSize = `max(7px, ${size.toFixed(2)}cqi)`;  /* cqi of the readout tile itself */
      s.style.setProperty('--o', o.toFixed(2));
      box.appendChild(s);
      const a = s.getBoundingClientRect();
      const clash = a.right > bx.right - 8 || placed.some(p => {
        const b = p.getBoundingClientRect();
        return Math.min(a.right, b.right) + 5 > Math.max(a.left, b.left) && Math.min(a.bottom, b.bottom) + 3 > Math.max(a.top, b.top);
      });
      if (clash) s.remove(); else placed.push(s);
    };
    for (let i = 0; i < 300 && placed.length < 38; i++) {
      const d = Math.pow(r(), 1.5);
      const y = 11 + d * 80, x = 24 + r() * 64;
      const text = d < 0.3 && r() < 0.12 ? PHRASES[Math.floor(r() * PHRASES.length)]
        : WORDS[Math.floor(Math.min(0.999, Math.max(0, d + (r() - 0.5) * 0.5)) * WORDS.length)];
      if ((used[text] = (used[text] || 0) + 1) > (PHRASES.includes(text) ? 1 : 2)) continue;
      add(text, x, y, 4.1 - d * 1.15, 0.95 - d * 0.62);
    }
  }
  /* the sounding line drops and words surface as it reaches their depth */
  let started = false;
  function sound() {
    if (started) return;
    started = true;
    const box = $('.depth');
    if (reduce) { box.classList.add('go'); placed.forEach(s => s.classList.add('on')); return; }
    requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('go')));
    placed.forEach(s => {
      const y = parseFloat(s.style.top) / 94;
      setTimeout(() => s.classList.add('on'), 200 + 7000 * Math.pow(y, 1.4) + Math.random() * 300);
    });
  }

  /* ---------- swell, engraved as horizontal lines ---------- */
  function drawSwell() {
    const { ctx, w, h } = fit('swell');
    const n = makeNoise(3);
    const horizon = h * 0.3;
    const lum = (x, y) => {
      if (y < horizon) return 0.88 - 0.12 * (y / horizon);
      const t = (y - horizon) / (h - horizon);
      const z = 1 / (0.1 + t);
      const v = n((x / w - 0.5) * z * 0.9, z * 1.6, 4);
      const crest = Math.pow(1 - Math.abs(v * 2 - 1), 7);
      return 0.3 + 0.55 * crest * (0.5 + 0.5 * (1 - t)) + 0.25 * (1 - t) * (1 - t);
    };
    ctx.fillStyle = '#e3e1da'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2d2c29';
    const gap = Math.max(2.4, h / 70);
    for (let y = gap / 2; y < h; y += gap) {
      for (let x = 0; x < w; x += 1) {
        const t = (1 - lum(x, y)) * (gap * 0.82);
        if (t > 0.15) ctx.fillRect(x, y - t / 2, 1.05, t);
      }
    }
  }

  /* ---------- chart: seafloor from above, with depth labels on the contours ---------- */
  function drawChart() {
    const { ctx, w, h } = fit('chart');
    const n = makeNoise(31), gaps = makeNoise(77), rnd = seeded(13);
    const k = w / 360;
    const field = (x, y) => n(x / w * 4.2, y / w * 4.2, 5) + (y / h) * 0.12;
    const levels = []; for (let L = 0.36; L < 0.74; L += 0.04) levels.push(L);
    const quiet = (x, y) => (x < w * 0.5 && y < h * 0.5) || (x > w * 0.62 && y > h * 0.8);
    ctx.strokeStyle = 'rgba(26,28,30,.82)'; ctx.lineWidth = 0.75; ctx.lineCap = 'round';
    contours(ctx, w, h, field, levels, 2.2, (x, y) => !quiet(x, y) && gaps(x / k * 0.06, y / k * 0.06, 2) < 0.6 && rnd() > 0.08);
    ctx.font = `500 ${Math.max(6, 7 * k).toFixed(1)}px Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let put = 0;
    for (let tries = 0; tries < 4000 && put < 7; tries++) {
      const x = w * (0.08 + rnd() * 0.84), y = h * (0.1 + rnd() * 0.82);
      if (quiet(x, y)) continue;
      const v = field(x, y), L = levels.find(L => Math.abs(v - L) < 0.003);
      if (L === undefined) continue;
      const label = String(Math.round((L - 0.32) / 0.04) * 15);
      const tw = ctx.measureText(label).width + 4;
      ctx.fillStyle = '#b7bcc0'; ctx.fillRect(x - tw / 2, y - 5 * k, tw, 10 * k);
      ctx.fillStyle = 'rgba(26,28,30,.9)'; ctx.fillText(label, x, y + 0.5);
      put++;
    }
  }

  /* ---------- draw when sized; start the sounding when it comes into view ---------- */
  let lastW = 0, timer = 0;
  const draw = () => {
    const w = host.getBoundingClientRect().width;
    if (!w || Math.abs(w - lastW) < 1) return;
    lastW = w;
    drawSection(); drawWater(); drawSwell(); drawChart(); placeDepth();
    if (started) placed.forEach(s => s.classList.add('on'));
  };
  const ro = new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(draw, lastW ? 150 : 0); });
  const io = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting && e.intersectionRatio > 0.2)) { draw(); sound(); io.disconnect(); }
  }, { threshold: [0, 0.2, 0.5] });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { ro.observe(host); io.observe(host); });
}

definePiece('soundings-board', { here: import.meta.url, markup: MARKUP, hide: '.board', run });

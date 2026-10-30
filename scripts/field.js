/* tiny-consoles · field
 * The traced contour lines behind the title on the index, swept in from left to right like a scan.
 */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function field() {
  const canvas = document.getElementById('field');
  if (!canvas) return;
  const seeded = s => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const makeNoise = seed => {
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
  };

  let segs = [], raf = 0;
  const build = () => {
    /* the field reaches just into the top of the title, wherever the title lands */
    const h1 = document.querySelector('.home h1'), page = canvas.parentElement;
    const top = h1.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop;
    canvas.style.height = `${Math.round(top + h1.offsetHeight * 0.3)}px`;
    const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    const w = r.width, h = r.height, cell = 3;
    const n = makeNoise(17), gaps = makeNoise(41), rnd = seeded(3);
    const s = Math.max(w, h * 1.6);
    const f = (x, y) => n(x / s * 3.4, y / s * 3.4, 5) + 0.18 * (x / w) - 0.14 * (y / h);
    /* lines thin out toward the bottom so the title sits on quiet paper */
    const calm = (x, y) => Math.min(1, Math.max(0, (1 - y / h) / 0.45));
    const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1, F = new Float32Array(cols * rows);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) F[j * cols + i] = f(i * cell, j * cell);
    segs = [];
    for (let L = 0.3; L < 0.86; L += 0.036) {
      for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
        const a = F[j * cols + i], b = F[j * cols + i + 1], c = F[(j + 1) * cols + i + 1], d = F[(j + 1) * cols + i];
        const k = (a > L) | ((b > L) << 1) | ((c > L) << 2) | ((d > L) << 3);
        if (k === 0 || k === 15) continue;
        const x = i * cell, y = j * cell;
        const T = [x + cell * (L - a) / (b - a), y], R = [x + cell, y + cell * (L - b) / (c - b)],
              B = [x + cell * (L - d) / (c - d), y + cell], Lf = [x, y + cell * (L - a) / (d - a)];
        const pairs = {1:[[Lf,T]],2:[[T,R]],3:[[Lf,R]],4:[[R,B]],5:[[Lf,T],[R,B]],6:[[T,B]],7:[[Lf,B]],
                       8:[[B,Lf]],9:[[B,T]],10:[[T,R],[B,Lf]],11:[[B,R]],12:[[R,Lf]],13:[[R,T]],14:[[T,Lf]]}[k];
        for (const [p, q] of pairs) {
          if (gaps(p[0] * 0.035, p[1] * 0.035, 2) > 0.66 || rnd() > calm(p[0], p[1]) * 0.94) continue;
          segs.push([p[0], p[1], q[0], q[1]]);
        }
      }
    }
    return { w, h, dpr };
  };

  const paint = (geo, upto) => {
    const ctx = canvas.getContext('2d');
    ctx.setTransform(geo.dpr, 0, 0, geo.dpr, 0, 0);
    ctx.clearRect(0, 0, geo.w, geo.h);
    ctx.strokeStyle = 'rgba(27,26,25,.6)'; ctx.lineWidth = 0.75; ctx.lineCap = 'round';
    ctx.beginPath();
    for (const [x1, y1, x2, y2] of segs) {
      if (x1 > upto) continue;
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    }
    ctx.stroke();
  };

  /* geo is the current drawing; a relayout swaps it and the sweep carries on with the new one */
  let geo = null, swept = false, at = '';
  const sweep = () => {
    cancelAnimationFrame(raf);
    geo = build();
    if (reduce) { swept = true; return paint(geo, geo.w); }
    const t0 = performance.now(), dur = 3600;
    const frame = now => {
      const t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
      paint(geo, e * geo.w + (t === 1 ? 1 : 0));
      if (t < 1) raf = requestAnimationFrame(frame); else swept = true;
    };
    raf = requestAnimationFrame(frame);
  };
  sweep();

  /* the title moves once the fonts and the pinned pieces arrive (on a first visit they come after this runs),
     so measure again whenever it moves, and draw the lines down to where it is now */
  const where = () => {
    const h1 = document.querySelector('.home h1'), page = canvas.parentElement;
    return `${Math.round(h1.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop)}/${h1.offsetHeight}/${innerWidth}`;
  };
  at = where();
  const relayout = () => {
    const now = where();
    if (now === at) return;
    at = now;
    geo = build();
    if (swept) paint(geo, geo.w);   // mid-sweep, the next frame paints the new lines
  };
  let timer;
  const soon = () => { clearTimeout(timer); timer = setTimeout(relayout, 120); };
  const watch = new ResizeObserver(soon), inner = canvas.parentElement.querySelector('.home-in');
  if (inner) [inner, ...inner.children].forEach(el => watch.observe(el));
  if (document.fonts) document.fonts.ready.then(soon);
  addEventListener('resize', soon);
}

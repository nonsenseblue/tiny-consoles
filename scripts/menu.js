/* tiny-consoles · menu
 * On phones the arrows give way to a menu button. It opens a list of every page;
 * picking one goes there (the pager handles [data-go]) and the menu closes.
 */

export function menu(pages, labels) {
  const button = document.querySelector('.menu-btn');
  const panel = document.getElementById('menu');
  if (!button || !panel) return;

  panel.querySelector('ol').innerHTML = pages.map((page, i) => {
    const [num, name] = labels[i].includes(' · ') ? labels[i].split(' · ') : ['', labels[i]];
    return `<li><a href="#${page.dataset.key}" data-go="${page.dataset.key}"><span>${num}</span>${name}</a></li>`;
  }).join('');

  const canvas = panel.querySelector('canvas');
  let drawn = '';

  const set = open => {
    if (open && canvas) {
      const size = `${innerWidth}x${innerHeight}`;
      if (drawn !== size) { drawn = size; requestAnimationFrame(() => contours(canvas)); }
    }
    panel.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    panel.inert = !open;
    if (open) {
      const now = document.querySelector('.page.current')?.dataset.key;
      panel.querySelectorAll('a').forEach(a => a.toggleAttribute('aria-current', a.dataset.go === now));
    }
  };
  set(false);

  button.addEventListener('click', () => set(!panel.classList.contains('open')));
  panel.addEventListener('click', e => { if (e.target.closest('[data-go]')) set(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  matchMedia('(min-width: 721px)').addEventListener('change', e => { if (e.matches) set(false); });
}

/* traced contour lines along the foot of the menu, quiet toward the list above them */
function contours(canvas) {
  const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
  if (!r.width) return;
  canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
  const w = r.width, h = r.height, cell = 3;
  const seeded = s => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const noise = seed => {
    const rnd = seeded(seed), P = new Uint8Array(512), p = [...Array(256).keys()];
    for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) P[i] = p[i & 255];
    const fade = t => t * t * (3 - 2 * t), v = (x, y) => P[P[x & 255] + (y & 255)] / 255;
    const n = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), u = fade(x - xi), q = fade(y - yi);
      const a = v(xi, yi), b = v(xi + 1, yi), c = v(xi, yi + 1), d = v(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * q + (a - b - c + d) * u * q;
    };
    return (x, y, oct = 4) => { let s = 0, amp = 0.5, f = 1, t = 0; for (let i = 0; i < oct; i++) { s += amp * n(x * f, y * f); t += amp; amp *= 0.5; f *= 2.03; } return s / t; };
  };
  const n = noise(29), gaps = noise(53), rnd = seeded(7), s = Math.max(w, h * 1.6);
  const f = (x, y) => n(x / s * 3.2, y / s * 3.2, 5) - 0.12 * (x / w) + 0.16 * (y / h);
  const calm = y => Math.min(1, Math.max(0, (y / h) / 0.5));
  const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1, F = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) F[j * cols + i] = f(i * cell, j * cell);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(27,26,25,.5)'; ctx.lineWidth = 0.75; ctx.lineCap = 'round'; ctx.beginPath();
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
        if (gaps(p[0] * 0.035, p[1] * 0.035, 2) > 0.66 || rnd() > calm(p[1]) * 0.94) continue;
        ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]);
      }
    }
  }
  ctx.stroke();
}

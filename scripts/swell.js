/* tiny-consoles · swell
 * The dot field above the title of All works: a plain grid of dots, some of them swollen by an unseen swell.
 * It sweeps in from left to right each time the page opens, and fades out toward the title.
 */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function swell(canvas) {
  const field = (x, y) => Math.sin(x * 1.7 + Math.sin(y * 1.3)) * 0.5 + Math.sin(y * 2.1 + x * 0.6) * 0.5;
  let dots = [], raf = 0;

  const build = () => {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    if (!r.width) return null;
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    const W = r.width, H = r.height, step = W < 720 ? 10 : 12;
    dots = [];
    for (let y = 8; y < H; y += step) for (let x = 6; x < W; x += step) {
      const d = field(x / 140, y / 70), lift = Math.max(0, d);
      const fade = Math.min(1, Math.max(0, 1 - (y / H - 0.55) / 0.45));   /* quiet toward the title */
      dots.push({ x: x + d * 4, y: y + d * 3, r: 0.5 + lift * 1.6, a: fade * (0.25 + lift * 0.75) });
    }
    const g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { g, W, H };
  };

  const paint = ({ g, W, H }, upto) => {
    g.clearRect(0, 0, W, H);
    g.fillStyle = '#1b1a19';
    for (const d of dots) {
      if (d.x > upto) continue;
      g.globalAlpha = d.a * 0.6; g.beginPath(); g.arc(d.x, d.y, d.r, 0, Math.PI * 2); g.fill();
    }
  };

  /* draw it again: at once with reduced motion, otherwise swept in over a little under a second */
  return function play() {
    cancelAnimationFrame(raf);
    const geo = build();
    if (!geo) return;
    if (reduce) { paint(geo, Infinity); return; }
    const t0 = performance.now(), ms = 900;
    const tick = now => {
      const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      paint(geo, e * geo.W);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
}

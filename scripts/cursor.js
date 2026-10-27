/* tiny-consoles · cursor
 * A small dot that follows the pointer and swells into an inverting lens over anything clickable.
 * Over a thumbnail it becomes a real magnifier: the picture under it, shown larger.
 * Only on devices with a fine pointer, and never when reduced motion is asked for.
 */

export function cursor() {
  const fine = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (!fine.matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursor hidden';
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(dot);
  document.documentElement.classList.add('has-cursor');

  const HOT = 'a, button';
  const SIZE = 34;          /* the lens at scale 1, as set in gallery.css */
  const LOUPE = 1;          /* the same size as the lens over links */
  const ZOOM = 2;           /* how much the picture is enlarged inside it */
  const target = el => el.closest('.thumb') ? LOUPE : el.closest(HOT) ? 1 : 0.24;

  /* the dot follows closely; its size eases on a spring so it swells and settles */
  let tx = -100, ty = -100, x = tx, y = ty, s = 0.24, ts = 0.24, v = 0, raf = 0, last = 0, img = null;

  /* place the enlarged picture so the point under the pointer sits in the middle of the lens */
  const magnify = () => {
    const r = img.getBoundingClientRect();
    const nw = img.naturalWidth || r.width, nh = img.naturalHeight || r.height;
    const fit = Math.max(r.width / nw, r.height / nh);               /* object-fit: cover */
    const w = nw * fit, h = nh * fit, left = r.left + (r.width - w) / 2, top = r.top + (r.height - h) / 2;
    const k = ZOOM / s;                                               /* the lens itself is scaled by s */
    dot.style.backgroundSize = `${(w * k).toFixed(1)}px ${(h * k).toFixed(1)}px`;
    dot.style.backgroundPosition = `${(SIZE / 2 - (x - left) * k).toFixed(1)}px ${(SIZE / 2 - (y - top) * k).toFixed(1)}px`;
  };

  const tick = now => {
    const dt = Math.min((now - last) / 1000 || 0.016, 1 / 30); last = now;
    x += (tx - x) * Math.min(1, dt * 28);
    y += (ty - y) * Math.min(1, dt * 28);
    v += (-180 * (s - ts) - 2 * 0.7 * Math.sqrt(180) * v) * dt;   /* stiffness 180, damping ratio 0.7 */
    s += v * dt;
    dot.style.setProperty('--x', `${x.toFixed(1)}px`);
    dot.style.setProperty('--y', `${y.toFixed(1)}px`);
    dot.style.setProperty('--s', s.toFixed(3));
    if (img) magnify();
    const still = Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1 && Math.abs(s - ts) < 0.001 && Math.abs(v) < 0.001;
    /* over a picture keep going, since the thumbnail itself is still easing in */
    raf = still && !img ? 0 : requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };

  addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY;
    if (dot.classList.contains('hidden')) { x = tx; y = ty; dot.classList.remove('hidden'); }
    ts = target(e.target);
    const next = e.target.closest('.thumb')?.querySelector('img') || null;
    if (next !== img) {
      img = next;
      dot.classList.toggle('loupe', !!img);
      dot.style.backgroundImage = img ? `url("${img.currentSrc || img.src}")` : '';
    }
    kick();
  }, { passive: true });
  document.addEventListener('pointerleave', () => dot.classList.add('hidden'));
  addEventListener('pointerdown', () => { ts *= 0.8; kick(); });
  addEventListener('pointerup', e => { ts = target(e.target); kick(); });
}

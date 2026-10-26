/* tiny-consoles · cursor
 * A small dot that follows the pointer and swells into an inverting lens over anything clickable.
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

  /* the dot follows closely; its size eases on a spring so it swells and settles */
  let tx = -100, ty = -100, x = tx, y = ty, s = 0.24, ts = 0.24, v = 0, raf = 0, last = 0;
  const HOT = 'a, button';
  const tick = now => {
    const dt = Math.min((now - last) / 1000 || 0.016, 1 / 30); last = now;
    x += (tx - x) * Math.min(1, dt * 28);
    y += (ty - y) * Math.min(1, dt * 28);
    v += (-180 * (s - ts) - 2 * 0.7 * Math.sqrt(180) * v) * dt;   /* stiffness 180, damping ratio 0.7 */
    s += v * dt;
    dot.style.setProperty('--x', `${x.toFixed(1)}px`);
    dot.style.setProperty('--y', `${y.toFixed(1)}px`);
    dot.style.setProperty('--s', s.toFixed(3));
    const still = Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1 && Math.abs(s - ts) < 0.001 && Math.abs(v) < 0.001;
    raf = still ? 0 : requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY;
    if (dot.classList.contains('hidden')) { x = tx; y = ty; dot.classList.remove('hidden'); }
    ts = e.target.closest(HOT) ? 1 : 0.24;
    kick();
  }, { passive: true });
  document.addEventListener('pointerleave', () => dot.classList.add('hidden'));
  addEventListener('pointerdown', () => { ts *= 0.8; kick(); });
  addEventListener('pointerup', e => { ts = e.target.closest(HOT) ? 1 : 0.24; kick(); });
}

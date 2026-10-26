/* tiny-consoles · pager
 * Lays the pages side by side in a ring and moves between them:
 * buttons, keyboard arrows, a sideways trackpad swipe, or a finger dragging the pages.
 * The address follows the current page, so any page can be linked to.
 */

export function pager(pages, labels) {
  const where = document.getElementById('where');
  /* the label box is as wide as the longest page name, so the arrows never move */
  const fit = () => {
    where.style.minWidth = '0px';
    const keep = where.textContent;
    let max = 0;
    for (const l of labels) { where.textContent = l; max = Math.max(max, where.getBoundingClientRect().width); }
    where.textContent = keep;
    where.style.minWidth = `${Math.ceil(max)}px`;
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
  const n = pages.length;
  let cur = 0, offsets = pages.map(() => 0);

  /* place every page by its ring distance from the current one */
  const layout = (animate = true) => {
    pages.forEach((page, i) => {
      let d = ((i - cur) % n + n) % n;
      if (d > n / 2) d -= n;
      /* a page that wraps from one side to the other moves while out of sight */
      page.classList.toggle('still', !animate || Math.abs(d - offsets[i]) > 1);
      page.style.setProperty('--at', d);
      page.classList.toggle('current', d === 0);
      if (Math.abs(d) <= 1) page.classList.remove('away');
      offsets[i] = d;
    });
    clearTimeout(layout.t);
    where.textContent = labels[cur];
    layout.t = setTimeout(() => pages.forEach((p, i) => p.classList.toggle('away', offsets[i] !== 0)), animate ? 850 : 0);
  };

  const go = (i, animate = true) => {
    cur = ((i % n) + n) % n;
    layout(animate);
    const key = pages[cur].dataset.key;
    history.replaceState(null, '', key === 'index' ? location.pathname : `#${key}`);
  };
  const step = s => go(cur + s);
  const goKey = key => { const i = pages.findIndex(p => p.dataset.key === key); if (i >= 0) go(i); };

  /* buttons and links */
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-step]');
    if (s) { step(Number(s.dataset.step)); return; }
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); goKey(g.dataset.go); }
  });
  addEventListener('keydown', e => {
    if (e.target.closest('input, textarea, pre')) return;
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  /* trackpad: a sideways swipe turns one page */
  let acc = 0, locked = false;
  addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 1.2) return;
    e.preventDefault();
    if (locked) return;
    acc += e.deltaX;
    if (Math.abs(acc) > 50) {
      step(acc > 0 ? 1 : -1);
      acc = 0; locked = true;
      setTimeout(() => { locked = false; }, 850);
    }
  }, { passive: false });

  /* touch: the pages follow the finger */
  const area = document.getElementById('pager');
  let sx = 0, sy = 0, dx = 0, mode = null, t0 = 0;
  area.addEventListener('touchstart', e => {
    const t = e.touches[0]; sx = t.clientX; sy = t.clientY; dx = 0; mode = null; t0 = performance.now();
  }, { passive: true });
  area.addEventListener('touchmove', e => {
    const t = e.touches[0], mx = t.clientX - sx, my = t.clientY - sy;
    if (!mode && Math.hypot(mx, my) > 10) mode = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
    if (mode !== 'x') return;
    e.preventDefault();
    dx = mx;
    pages.forEach(p => { p.classList.add('still'); p.classList.remove('away'); p.style.setProperty('--drag', `${dx}px`); });
  }, { passive: false });
  area.addEventListener('touchend', () => {
    if (mode !== 'x') return;
    const fast = Math.abs(dx) / (performance.now() - t0) > 0.4;
    pages.forEach(p => p.style.setProperty('--drag', '0px'));
    if (Math.abs(dx) > innerWidth * 0.22 || (fast && Math.abs(dx) > 30)) step(dx < 0 ? 1 : -1);
    else layout();
  });

  addEventListener('hashchange', () => goKey(location.hash.slice(1) || 'index'));
  const start = location.hash.slice(1);
  go(Math.max(0, pages.findIndex(p => p.dataset.key === (start || 'index'))), false);
}

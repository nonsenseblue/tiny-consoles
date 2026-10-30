/**
 * Full size view, shared by every piece that opens its sheets one at a time.
 * Click a tile to open it over a dimmed page; Prev, Next, the arrow keys or a swipe go through the others,
 * Replay starts the open sheet's animation again, Esc, Close or a click outside puts it back.
 * The tile itself is moved, so it keeps running.
 * mode 'scale' enlarges the tile as drawn; mode 'resize' gives it more room and lets it lay out again.
 * Code: MIT · nonsenseblue
 */

const ZOOM_CSS = `
.zoom { margin: auto; padding: 0; border: 0; background: none; overflow: visible; max-width: none; max-height: none; cursor: default; color: #f3f2ef; font-family: Inter, system-ui, sans-serif; }
.zoom::backdrop { background: rgba(18, 17, 16, .8); backdrop-filter: blur(3px); }
.zoom[open]::backdrop { animation: zfade .3s ease; }
@keyframes zfade { from { opacity: 0; } }
.zoom .zopen { transition: none !important; }
.zoom .zbox { position: relative; }
.zoom .zopen { position: absolute !important; left: 0 !important; top: 0 !important; margin: 0 !important; transform-origin: 0 0 !important; box-shadow: 0 30px 80px -30px rgba(0, 0, 0, .7); }
.zoom .zopen.scaled { transform: scale(var(--zoom, 1)) !important; }
.zoom .zopen.resized { transform: none !important; width: 100% !important; height: 100% !important; }
.zoom .zcap { margin: 14px 0 0; text-align: center; font: 500 11px/1.4 Inter, system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; opacity: .7; }
/* the controls: a round Close, and one frosted bar with Prev, Replay and Next */
.zoom button { font: 500 13px/1 Inter, system-ui, sans-serif; color: inherit; border: 0; background: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 7px; transition: background-color .2s; }
.zoom button svg { width: 16px; height: 16px; flex: none; }
.zoom .zclose, .zoom .zbar { background: rgba(243, 242, 239, .12); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); }
.zoom .zclose { position: fixed; top: 20px; right: 22px; width: 40px; height: 40px; border-radius: 50%; }
.zoom .zbar { position: fixed; left: 50%; bottom: 22px; transform: translateX(-50%); display: flex; gap: 2px; padding: 4px; border-radius: 999px; z-index: 2; }
.zoom .zbar button { height: 40px; min-width: 40px; border-radius: 999px; padding: 0 12px; }
.zoom .zbar .zrp { background: rgba(243, 242, 239, .14); padding: 0 16px; }
.zoom button:hover, .zoom button:focus-visible { background-color: rgba(243, 242, 239, .24); outline: none; }
.zoom .zclose:hover, .zoom .zclose:focus-visible { background-color: rgba(243, 242, 239, .28); }
.zhold { visibility: hidden; }
/* with notes: the sheet on the left, what it is about on the right */
.zoom.notes[open] { display: grid; grid-template-columns: auto 340px; column-gap: 56px; align-items: center; padding-bottom: 40px; }
.zoom.notes .zcap { display: none; }
.zside { font: 400 13px/1.65 Inter, system-ui, sans-serif; max-height: 72vh; overflow: auto; overscroll-behavior: contain; scrollbar-width: none; }
.zside .zn { font-size: 11px; letter-spacing: .14em; opacity: .6; margin: 0 0 18px; }
.zside .zt { font: 500 30px/1.15 var(--zt, inherit); letter-spacing: .06em; margin: 0; }
.zside .zm { font-size: 12px; opacity: .65; margin: 8px 0 24px; }
.zside h4 { font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; opacity: .6; margin: 22px 0 6px; }
.zside p { margin: 0; }
.zside .zl, .zside h4 + p { opacity: .88; }
@media (max-height: 760px) { .zside { font-size: 12.5px; line-height: 1.6; } .zside .zt { font-size: 26px; } .zside h4 { margin-top: 16px; } }
@media (max-width: 720px) {
  .zoom .zclose { top: 16px; right: 16px; }
  .zoom .zbar { bottom: 20px; }
  /* on a phone the sheet sits on top and the notes scroll under it */
  .zoom.notes[open] { display: block; position: fixed; inset: 0; width: 100vw; height: 100dvh; margin: 0; padding: 72px 20px 110px; overflow-y: auto; background: rgba(18, 17, 16, .82); }
  .zoom.notes::after { content: ""; position: fixed; left: 0; right: 0; bottom: 0; height: 96px; background: linear-gradient(rgba(18, 17, 16, 0), rgba(18, 17, 16, .96) 55%); pointer-events: none; }
  .zoom.notes .zbox { margin: 0 auto; }
  .zside { max-height: none; overflow: visible; margin-top: 28px; font-size: 14px; }
  .zside .zt { font-size: 28px; }
}
`;
const ZICON = {
  prev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg>',
  next: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg>',
  replay: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.6"/><path d="M12 1.8v3h-3"/></svg>',
  close: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8"/></svg>',
};
const zesc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
/* replay(el) starts the sheet's animation again from the beginning.
   notes(el) may return { title, meta, lead, parts: [[heading, text], …] }; the view then shows them beside the sheet. */
export function zoomable(root, items, { mode = 'scale', label = el => el.getAttribute('aria-label') || '', skip = () => false, after = () => {}, replay = null, notes = null, notesFont = 'inherit', ignore = 'a, button, input' } = {}) {
  if (typeof HTMLDialogElement === 'undefined' || !('showModal' in HTMLDialogElement.prototype)) return null;
  root.append(Object.assign(document.createElement('style'), { textContent: ZOOM_CSS }));
  const dialog = document.createElement('dialog');
  dialog.className = 'zoom' + (notes ? ' notes' : '');
  dialog.style.setProperty('--zt', notesFont);
  dialog.innerHTML = `<div class="zbox"></div><p class="zcap"></p>${notes ? '<aside class="zside" aria-live="polite"></aside>' : ''}`
    + `<button class="zclose" type="button" aria-label="Close">${ZICON.close}</button>`
    + `<div class="zbar"><button class="zprev" type="button" aria-label="Previous">${ZICON.prev}</button>`
    + (replay ? `<button class="zrp" type="button">${ZICON.replay}Replay</button>` : '')
    + `<button class="znext" type="button" aria-label="Next">${ZICON.next}</button></div>`;
  root.append(dialog);
  const box = dialog.querySelector('.zbox'), cap = dialog.querySelector('.zcap'), side = dialog.querySelector('.zside');
  const phone = matchMedia('(max-width: 720px)');
  let open = null, hold = null, size = null;

  const fit = () => {
    const k = !notes ? Math.min(innerWidth * .86 / size.w, innerHeight * .74 / size.h)
      : phone.matches ? (innerWidth - 40) / size.w
      : Math.min(innerWidth * .4 / size.w, innerHeight * .6 / size.h);
    box.style.width = `${size.w * k}px`; box.style.height = `${size.h * k}px`;
    if (mode === 'scale') open.style.setProperty('--zoom', k);
    after(open);
  };
  const write = el => {
    const i = items.indexOf(el), count = `${i + 1} / ${items.length}`;
    cap.textContent = `${count}${label(el) ? ' · ' + label(el) : ''}`;
    if (!side) return;
    const n = notes(el) || {};
    side.innerHTML = `<p class="zn">${count}</p>${n.title ? `<h3 class="zt">${zesc(n.title)}</h3>` : ''}${n.meta ? `<p class="zm">${zesc(n.meta)}</p>` : ''}`
      + (n.lead ? `<p class="zl">${zesc(n.lead)}</p>` : '') + (n.parts || []).map(([h, t]) => `<h4>${zesc(h)}</h4><p>${zesc(t)}</p>`).join('');
    side.scrollTop = 0; dialog.scrollTop = 0;
  };
  /* the piece's own transitions must not play while a sheet is moved in or out of the view */
  const still = el => { el.style.transition = 'none'; void el.offsetWidth; requestAnimationFrame(() => requestAnimationFrame(() => el.style.removeProperty('transition'))); };
  const put = () => {
    still(open);
    hold.replaceWith(open);
    open.classList.remove('zopen', 'scaled', 'resized');
    open.style.removeProperty('--zoom'); open.style.removeProperty('width'); open.style.removeProperty('height');
    const el = open; open = null; after(el);
  };
  const swap = el => {
    if (open) put();
    size = { w: el.offsetWidth, h: el.offsetHeight };
    hold = document.createElement('div');
    hold.className = 'zhold';
    hold.style.cssText = `aspect-ratio:${size.w} / ${size.h}`;
    el.replaceWith(hold);
    open = el;
    still(el);
    el.classList.add('zopen', mode === 'scale' ? 'scaled' : 'resized');
    if (mode === 'scale') { el.style.width = `${size.w}px`; el.style.height = `${size.h}px`; }
    box.append(el);
    write(el);
    if (!dialog.open) dialog.showModal();
    fit();
  };
  /* opening eases the sheet in; moving to the next one slides the old out and the new in, in the direction of travel */
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const EASE = 'cubic-bezier(.2,.8,.2,1)';
  let busy = false;
  const play = (frames, ms, ease) => Promise.all([box, cap, side].filter(Boolean).map(n => n.animate(frames, { duration: ms, easing: ease, fill: 'both' }).finished)).catch(() => {});
  const show = async (el, dir = 0) => {
    if (busy) return;
    if (calm.matches) { swap(el); return; }
    busy = true;
    if (!dialog.open) {
      swap(el);
      await play([{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], 320, EASE);
    } else {
      await play([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-dir * 32}px)` }], 180, 'ease-in');
      swap(el);
      await play([{ opacity: 0, transform: `translateX(${dir * 32}px)` }, { opacity: 1, transform: 'none' }], 300, EASE);
    }
    busy = false;
  };

  dialog.addEventListener('close', () => { if (open) put(); });
  const step = d => { if (open) { const n = items.length; show(items[(items.indexOf(open) + d + n) % n], d); } };
  dialog.addEventListener('click', e => {
    if (e.target.closest('.zprev')) return step(-1);
    if (e.target.closest('.znext')) return step(1);
    if (e.target.closest('.zrp')) { if (open) replay(open); return; }
    if (e.target.closest('.zclose')) return dialog.close();
    /* a tap beside the sheet closes it, except on a phone with notes, where that space is the page being read */
    if (e.target === dialog && !(notes && phone.matches)) dialog.close();
  });
  /* keep the gallery's own keys and swipes from turning the page behind */
  dialog.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  /* a sideways swipe on a phone goes to the next or previous one */
  let sx = null, sy = 0;
  dialog.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  dialog.addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  });
  dialog.addEventListener('touchmove', e => e.stopPropagation(), { passive: true });
  dialog.addEventListener('wheel', e => e.stopPropagation());
  addEventListener('resize', () => { if (open) fit(); });
  items.forEach(el => el.addEventListener('click', e => {
    if (open || skip() || e.target.closest(ignore)) return;
    show(el);
  }));
  return { isOpen: el => el === open, isAnyOpen: () => !!open, scale: () => (open && mode === 'scale' ? parseFloat(open.style.getPropertyValue('--zoom')) : 1) };
}

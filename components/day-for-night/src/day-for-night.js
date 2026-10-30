/**
 * <day-for-night> · tiny-consoles
 * Four sheets of French New Wave paperwork: a subtitle file, a contact sheet, a page of script
 * and a shooting note. The French on the surface is true; whatever looks through it (a lens,
 * a playhead, a viewfinder) finds an English subtitle or a production note that does not quite agree.
 *
 * Usage:
 *   <script type="module" src="components/day-for-night/src/day-for-night.js"></script>
 *   <day-for-night></day-for-night>
 *
 * Styles: day-for-night.css, next to this file (loaded automatically).
 * Design notes: ../DESIGN.md.
 * No dependencies. Respects prefers-reduced-motion.
 * Code: MIT · Visual design: CC BY 4.0 · nonsenseblue
 */

const STYLE = new URL('./day-for-night.css', import.meta.url).href + new URL(import.meta.url).search;
const FONT = 'https://fonts.googleapis.com/css2?family=Courier+Prime&family=EB+Garamond:ital@0;1&family=Jost:wght@500&display=swap';

/* 1 · the end of a film about a boy who runs to the sea; the subtitles take a quieter view */
const CUES = [
  ['01:32:04', 'Il s’enfuit', 150, 'He strolls'],
  ['01:32:09', 'jusqu’à la mer.', 180, 'to the river.'],
  ['01:32:13', 'Il n’a jamais', 130, 'He has never'],
  ['01:32:16', 'vu la mer.', 250, 'been this far.'],
  ['01:32:21', 'Il se retourne.', 140, 'He looks at us.'],
  ['01:32:25', 'Fin.', 330, 'Freeze.'],
];

/* 2 · one running shot over nine frames; the playhead reads each frame in its own English */
const SHOTS = [['Il court', 'He runs'], ['Il court', 'He runs'], ['Il court,', 'still,'], ['encore', 'again'], null,
  ['Champs-', 'down the'], ['Élysées', 'wrong street'], ['sans savoir', 'knowing'], ['pourquoi.', 'exactly why.']];
const JOG = [0, 6, -4, 8, 0, -6, 4, 0, -3];

/* 3 · a page of script; the viewfinder settles on a line and shows the subtitle under it */
const SCRIPT = [['c', 'PATRICIA', 100], ['d', 'Je vends les nouvelles du jour.', 132, 'I sell tomorrow’s old news.', 300],
  ['p', '(elle sourit, sans raison)', 172, '(she knows why)', 250], ['c', 'MICHEL', 224], ['d', 'Et le ciel ?', 256, 'And the sky?', 190],
  ['c', 'PATRICIA', 308], ['d', 'Le ciel est à vendre aussi.', 340, 'The sky is sold out already.', 360],
  ['p', 'Il court. Coupe. Encore.', 384, 'He runs. Cut. Again.', 280]];
const LINES = SCRIPT.map((r, i) => r[3] ? i : -1).filter(i => i >= 0);

/* 4 · night shot in the afternoon: a title tiled over the page and the shooting note on top */
const TILE = `<span style="margin-left:40px">La nuit</span><br><span style="margin-left:96px">est tournée</span><br>en plein jour<br><span style="margin-left:28px">sous un filtre</span><br><span style="margin-left:70px">bleu.</span>`;
const NOTE = `SCÈNE 12 · EXT. NUIT · 14 H
caméra:    sur pied
filtre:    bleu
diaph:     -2  // nuit américaine
lumière:   plein soleil

// OU

PRISE 4
  elle marche
  elle s'arrête
  elle pleure pour de vrai
  <b>// garder.</b><u></u>`;

/* what each sheet is about, shown beside it full size */
const NOTES = [
  { title: 'Subtitle file', meta: 'After Les Quatre Cents Coups · François Truffaut · 1959',
    lead: 'The last minute of a film about a boy who runs away to the sea, kept as a subtitle file. The French is what was said.',
    parts: [['The sheet', 'Timecodes, cue numbers and a pale band that steps from cue to cue, as if the file were playing. Ink on white and one orange.'],
      ['What looks through', 'A black lens drifts over the lines and shows the English in orange, close but wrong: the sea becomes a river, the end becomes a freeze.'],
      ['Try', 'Move the pointer over the page and the lens follows it. Replay starts the file again from the first cue.']] },
  { title: 'Contact sheet', meta: 'After À bout de souffle · Jean-Luc Godard · 1960',
    lead: 'One hand-held running shot down the Champs-Élysées, cut into nine frames. The reel is called À bout de course, one word off the film.',
    parts: [['The sheet', 'Numbered frames that jump a little from cut to cut, the notes for take 7, and a yellow grease pencil.'],
      ['What looks through', 'A playhead reads the frames one by one, and each frame shows its own English. Once it has passed the take, the highlighter goes over // garder.'],
      ['Try', 'Point at a frame to read it yourself. Replay sends the playhead back to the first frame.']] },
  { title: 'Script page', meta: 'After À bout de souffle · Jean-Luc Godard · 1960',
    lead: 'A page of script for a newspaper seller and the man who keeps running. Every line is our own.',
    parts: [['The sheet', 'Centred dialogue, directions in italics, names in capitals, the scene number typed at the foot.'],
      ['What looks through', 'A blue viewfinder settles on one line at a time and shows the subtitle under it. Today’s news turns into tomorrow’s, and the sky is already sold out.'],
      ['Try', 'Move the pointer down the page and the viewfinder goes to the nearest line.']] },
  { title: 'Shooting note', meta: 'After La Nuit américaine · François Truffaut · 1973',
    lead: 'Night shot in full daylight under a blue filter, the trick the film is named after.',
    parts: [['The sheet', 'The title tiled across the page in Garamond, and a dark shooting note on top with one green square.'],
      ['What looks through', 'The note slides slowly over the title. Inside it, the take where she cries for real is the one they keep, and a green cursor blinks after it.'],
      ['Try', 'Carry the note with the pointer.']] },
];

const srtLines = en => CUES.map(([, fr, x, e], i) => `<div class="a ser line" style="left:${x}px;top:${70 + i * 66}px">${en ? e : fr}</div>`).join('');
const scriptPage = en => SCRIPT.map(([k, t, y, e]) => `<div class="a ${k === 'c' ? 'c' : 'ser ' + k}" style="top:${y}px">${en && e ? `<span>${e}</span>` : t}</div>`).join('');

const MARKUP = `<div class="board"><div class="stage">
<section class="sheet srt" aria-label="Subtitle file">
  <div class="a band"></div>
  ${CUES.map(([tc], i) => `<div class="a mono tc" style="top:${82 + i * 66}px">${String(i + 41).padStart(3, '0')}<br>${tc}</div>`).join('')}
  <div class="a rule"></div>
  ${srtLines(false)}
  <div class="a mono file">les_quatre_cents_coups.srt</div>
  <div class="a rec"></div>
  <div class="lens" aria-hidden="true">${srtLines(true)}</div>
</section>
<section class="sheet contact" aria-label="Contact sheet">
  <div class="a mono reel">À BOUT DE COURSE · BOBINE 2</div>
  ${SHOTS.map((s, i) => {
    const x = 26 + (i % 3) * 160, y = 46 + ((i / 3) | 0) * 150;
    if (!s) return `<div class="a mono notes" style="left:${x}px;top:${y}px">PRISE 7
caméra  à la main
pied    non
coupes  3
son     la rue
<mark>// garder</mark></div>`;
    return `<div class="a frame" data-i="${i}" style="left:${x}px;top:${y}px"><span class="fr" style="transform:translateX(${JOG[i]}px)">${s[0]}</span><span class="en" aria-hidden="true">${s[1]}</span></div>
  <div class="a mono no" data-i="${i}" style="left:${x}px;top:${y + 124}px">${String(20 + i).padStart(2, '0')}A</div>`;
  }).join('')}
</section>
<section class="sheet script" aria-label="Script page">
  ${scriptPage(false)}
  <div class="en" aria-hidden="true">${scriptPage(true)}</div>
  <div class="vf"><i></i><i></i><i></i><i></i></div>
  <div class="a mono foot l">SC. 5 · EXT. JOUR</div>
  <div class="a mono foot r">sous-titres</div>
</section>
<section class="sheet tiled" aria-label="Shooting note">
  ${[-160, 90, 340].map(x => [-60, 200, 460].map(y => `<div class="a tile" style="left:${x}px;top:${y}px">${TILE}</div>`).join('')).join('')}
  <div class="a panel"><div class="sq"></div><div class="code">${NOTE}</div></div>
</section>
</div></div>`;

/* where the four sheets lie: [x, y, scale, turn, stack] in design units */
const LAYOUTS = {
  /* two by two; each sheet opens full size on a click */
  grid: { w: 1068, h: 1068, at: [[0, 0, 1, 0, 1], [548, 0, 1, 0, 1], [0, 548, 1, 0, 1], [548, 548, 1, 0, 1]] },
};

/* ---------- full size: a tile can be lifted out and looked at on its own ----------
   Click a tile to open it over a dimmed page; Prev, Next, the arrow keys or a swipe go through the others,
   Esc, Close or a click outside puts it back. The tile itself is moved, so it keeps running.
   mode 'scale' enlarges the tile as drawn; mode 'resize' gives it more room and lets it lay out again. */
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
function zoomable(root, items, { mode = 'scale', label = el => el.getAttribute('aria-label') || '', skip = () => false, after = () => {}, replay = null, notes = null, notesFont = 'inherit', ignore = 'a, button, input' } = {}) {
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

const ease = (a, b, k) => a + (b - a) * k;

function run(root, host) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const board = root.querySelector('.board'), stage = root.querySelector('.stage');
  const [srt, contact, script, tiled] = root.querySelectorAll('.sheet');

  let layout = '', k = 1;
  const sheets = [srt, contact, script, tiled];
  const place = () => {
    const width = host.getBoundingClientRect().width;
    if (!width) return;
    const name = 'grid', L = LAYOUTS[name];
    if (name !== layout) {
      layout = name;
      board.style.setProperty('--w', L.w); board.style.setProperty('--h', L.h);
            sheets.forEach((el, i) => { const [x, y, s, r, z] = L.at[i]; el.style.setProperty('--x', x); el.style.setProperty('--y', y); el.style.setProperty('--s', s); el.style.setProperty('--r', r + 'deg'); el.style.setProperty('--z', z); });
    }
    k = width / L.w;
    stage.style.setProperty('--k', k);
  };
  new ResizeObserver(place).observe(host);
  place();

  let replay = () => {};
  const zoom = zoomable(root, sheets, { replay: () => replay(), notes: el => NOTES[sheets.indexOf(el)], notesFont: '"EB Garamond", serif' });

  /* the pointer, in the design units of whichever sheet it is over */
  const hover = new Map();
  sheets.forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), f = zoom && zoom.isOpen(el) ? zoom.scale() : k * el.style.getPropertyValue('--s'); hover.set(el, [(e.clientX - r.left) / f, (e.clientY - r.top) / f]); });
    el.addEventListener('pointerleave', () => hover.delete(el));
  });

  /* each sheet's state */
  const lens = srt.querySelector('.lens'), band = srt.querySelector('.band'), tcs = [...srt.querySelectorAll('.tc')];
  const frames = [...contact.querySelectorAll('.frame')], nos = [...contact.querySelectorAll('.no')], mark = contact.querySelector('mark');
  const panel = tiled.querySelector('.panel');
  let cue = -1, shot = -2, line = -1;
  const L1 = { x: 330, y: 200 }, P4 = { x: 118, y: 164 };

  const setCue = i => { if (i === cue) return; cue = i; band.style.top = `${52 + i * 66}px`; tcs.forEach((t, j) => t.classList.toggle('on', j === i)); };
  const setShot = i => {
    if (i === shot) return; shot = i;
    frames.forEach(f => f.classList.toggle('on', +f.dataset.i === i));
    nos.forEach(n => n.classList.toggle('on', +n.dataset.i === i));
  };
  /* the highlighter goes over the take once the playhead has read it, and comes off when the reel starts again */
  const setMark = on => mark.style.setProperty('--hl', on ? 1 : 0);
  /* the viewfinder eases toward its line; box and subtitle move as one */
  const VF = { l: 110, t: 120, w: 300, h: 44 }, vfGoal = { ...VF };
  const setLine = i => {
    if (i === line) return; line = i;
    const [, , y, , w] = SCRIPT[i], h = SCRIPT[i][0] === 'd' ? 44 : 34;
    Object.assign(vfGoal, { l: 260 - w / 2, t: y - (h - 24) / 2 - 2, w, h });
  };
  const drawVf = (k = 1) => { for (const key in VF) { VF[key] = ease(VF[key], vfGoal[key], k); script.style.setProperty('--' + key, VF[key]); } };
  const drawLens = () => { lens.style.setProperty('--lx', L1.x); lens.style.setProperty('--ly', L1.y); };
  const drawPanel = () => { panel.style.setProperty('--px', P4.x); panel.style.setProperty('--py', P4.y); };

  if (reduce.matches) {
    setCue(2); drawLens(); setShot(-1); setMark(true); setLine(LINES[0]); drawVf(); drawPanel();
    board.classList.add('still');
    return;
  }

  /* only move while the board is on screen */
  let visible = false;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; board.classList.toggle('still', !visible); }).observe(board);

  let t0 = performance.now();
  /* Replay runs the reel again from its first cue */
  replay = () => {
    t0 = performance.now(); cue = -1; shot = -2; line = -1;
    Object.assign(L1, { x: 330, y: 200 }); Object.assign(P4, { x: 118, y: 164 });
    setLine(LINES[0]); drawVf(); drawLens(); drawPanel(); setMark(false);
  };
  const frame = now => {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = (now - t0) / 1000;

    /* 1 · the lens drifts over the lines, or follows the pointer; the cue steps on like playback */
    const p1 = hover.get(srt);
    const g1 = p1 ? { x: p1[0], y: p1[1] } : { x: 300 + 110 * Math.sin(t * 0.27), y: 270 + 160 * Math.sin(t * 0.19 + 1.2) };
    L1.x = ease(L1.x, g1.x, p1 ? 0.18 : 0.04); L1.y = ease(L1.y, g1.y, p1 ? 0.18 : 0.04);
    drawLens();
    setCue(Math.floor(t / 2.6) % CUES.length);

    /* 2 · a playhead runs along the frames, or rests on the frame under the pointer */
    const p2 = hover.get(contact);
    let s = Math.floor(t / 0.9) % 12;
    if (p2) { const c = Math.floor((p2[0] - 26) / 160), r = Math.floor((p2[1] - 46) / 150); s = c >= 0 && c < 3 && r >= 0 && r < 3 ? r * 3 + c : -1; }
    setShot(s < 9 ? s : -1);
    setMark(p2 || Math.floor(t / 0.9) % 12 >= 4);

    /* 3 · the viewfinder moves from line to line, or to the line nearest the pointer */
    const p3 = hover.get(script);
    if (p3) {
      let best = LINES[0];
      LINES.forEach(i => { if (Math.abs(SCRIPT[i][2] + 12 - p3[1]) < Math.abs(SCRIPT[best][2] + 12 - p3[1])) best = i; });
      setLine(best);
    } else setLine(LINES[Math.floor(t / 2.8) % LINES.length]);
    drawVf(0.09);

    /* 4 · the note slides over the title, or is carried by the pointer */
    const p4 = hover.get(tiled);
    const g4 = p4 ? { x: p4[0] - 153, y: p4[1] - 137 } : { x: 118 + 70 * Math.sin(t * 0.21), y: 150 + 60 * Math.sin(t * 0.16 + 2) };
    g4.x = Math.max(20, Math.min(194, g4.x)); g4.y = Math.max(40, Math.min(226, g4.y));
    P4.x = ease(P4.x, g4.x, p4 ? 0.14 : 0.03); P4.y = ease(P4.y, g4.y, p4 ? 0.14 : 0.03);
    drawPanel();
  };
  setLine(LINES[0]); drawVf(); drawLens(); drawPanel();
  requestAnimationFrame(frame);
}

class DayForNight extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    /* the faces live in the document so the shadow root can use them */
    if (!document.querySelector(`link[href="${FONT}"]`)) document.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${FONT}">`);
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<link rel="stylesheet" href="${STYLE}">${MARKUP}`;
    const board = root.querySelector('.board');
    board.style.visibility = 'hidden';
    const link = root.querySelector('link');
    const start = () => {
      const fonts = document.fonts ? Promise.all(['24px "EB Garamond"', 'italic 17px "EB Garamond"', '12px "Courier Prime"', '500 12px Jost'].map(f => document.fonts.load(f))).catch(() => {}) : Promise.resolve();
      fonts.then(() => { board.style.visibility = ''; run(root, this); });
    };
    link.addEventListener('load', start, { once: true });
    link.addEventListener('error', start, { once: true });
  }
}

if (!customElements.get('day-for-night')) customElements.define('day-for-night', DayForNight);

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
.zoom { margin: auto; padding: 0; border: 0; background: none; overflow: visible; max-width: none; max-height: none; cursor: default; color: #f3f2ef; }
.zoom::backdrop { background: rgba(18, 17, 16, .8); backdrop-filter: blur(3px); }
.zoom .zbox { position: relative; }
.zoom .zopen { position: absolute !important; left: 0 !important; top: 0 !important; margin: 0 !important; transform-origin: 0 0 !important; box-shadow: 0 30px 80px -30px rgba(0, 0, 0, .7); }
.zoom .zopen.scaled { transform: scale(var(--zoom, 1)) !important; }
.zoom .zopen.resized { transform: none !important; width: 100% !important; height: 100% !important; }
.zoom .zcap { margin-top: 14px; font: 500 11px/1.4 system-ui, sans-serif; letter-spacing: .14em; text-transform: uppercase; opacity: .7; }
.zoom button { font: 400 13px system-ui, sans-serif; color: inherit; background: none; border: 1px solid rgba(243, 242, 239, .4); border-radius: 999px; padding: 6px 16px; cursor: pointer; transition: padding .25s cubic-bezier(.2,.8,.2,1), border-color .2s; }
.zoom button:hover, .zoom button:focus-visible { padding: 6px 22px; border-color: rgba(243, 242, 239, .85); outline: none; }
.zoom .zclose { position: fixed; top: 22px; right: 26px; }
.zoom .zprev, .zoom .znext { position: fixed; top: 50%; transform: translateY(-50%); }
.zoom .zprev { left: 26px; } .zoom .znext { right: 26px; }
@media (max-width: 720px) { .zoom .zprev, .zoom .znext { top: auto; bottom: 22px; transform: none; } }
.zhold { visibility: hidden; }
`;
function zoomable(root, items, { mode = 'scale', label = el => el.getAttribute('aria-label') || '', skip = () => false, after = () => {}, ignore = 'a, button, input' } = {}) {
  if (typeof HTMLDialogElement === 'undefined' || !('showModal' in HTMLDialogElement.prototype)) return null;
  root.append(Object.assign(document.createElement('style'), { textContent: ZOOM_CSS }));
  const dialog = document.createElement('dialog');
  dialog.className = 'zoom';
  dialog.innerHTML = '<div class="zbox"></div><p class="zcap"></p><button class="zclose" type="button">Close</button><button class="zprev" type="button">Prev</button><button class="znext" type="button">Next</button>';
  root.append(dialog);
  const box = dialog.querySelector('.zbox'), cap = dialog.querySelector('.zcap');
  let open = null, hold = null, size = null;

  const fit = () => {
    const k = Math.min(innerWidth * .86 / size.w, innerHeight * .78 / size.h);
    box.style.width = `${size.w * k}px`; box.style.height = `${size.h * k}px`;
    if (mode === 'scale') open.style.setProperty('--zoom', k);
    after(open);
  };
  const put = () => {
    hold.replaceWith(open);
    open.classList.remove('zopen', 'scaled', 'resized');
    open.style.removeProperty('--zoom'); open.style.removeProperty('width'); open.style.removeProperty('height');
    const el = open; open = null; after(el);
  };
  const show = el => {
    if (open) put();
    size = { w: el.offsetWidth, h: el.offsetHeight };
    hold = document.createElement('div');
    hold.className = 'zhold';
    hold.style.cssText = `aspect-ratio:${size.w} / ${size.h}`;
    el.replaceWith(hold);
    open = el;
    el.classList.add('zopen', mode === 'scale' ? 'scaled' : 'resized');
    if (mode === 'scale') { el.style.width = `${size.w}px`; el.style.height = `${size.h}px`; }
    box.append(el);
    cap.textContent = `${items.indexOf(el) + 1} / ${items.length}${label(el) ? ' · ' + label(el) : ''}`;
    if (!dialog.open) dialog.showModal();
    fit();
  };

  dialog.addEventListener('close', () => { if (open) put(); });
  const step = d => { if (open) { const n = items.length; show(items[(items.indexOf(open) + d + n) % n]); } };
  dialog.addEventListener('click', e => {
    if (e.target.closest('.zprev')) return step(-1);
    if (e.target.closest('.znext')) return step(1);
    if (e.target === dialog || e.target.closest('.zclose')) dialog.close();
  });
  /* keep the gallery's own keys and swipes from turning the page behind */
  dialog.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  /* a sideways swipe on a phone goes to the next or previous one */
  let sx = null;
  dialog.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });
  dialog.addEventListener('touchmove', e => e.stopPropagation(), { passive: true });
  dialog.addEventListener('wheel', e => e.stopPropagation());
  addEventListener('resize', () => { if (open) fit(); });
  items.forEach(el => el.addEventListener('click', e => {
    if (open || skip() || e.target.closest(ignore)) return;
    show(el);
  }));
  return { isOpen: el => el === open, scale: () => (open && mode === 'scale' ? parseFloat(open.style.getPropertyValue('--zoom')) : 1) };
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

  const zoom = zoomable(root, sheets);

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

  const t0 = performance.now();
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

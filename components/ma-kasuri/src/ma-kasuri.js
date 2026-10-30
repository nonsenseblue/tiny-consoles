/**
 * <ma-kasuri> · tiny-consoles
 * Four squares of woven kasuri cloth, one for each of four quiet Japanese films, each with a woven
 * label stitched on. The label carries the one line a character says out loud. Leave the pointer on
 * a cloth and it goes through the wash: it creases, its colours soften, and letter by letter the
 * label rewrites itself into what was meant and never said.
 *
 * Usage:
 *   <script type="module" src="components/ma-kasuri/src/ma-kasuri.js"></script>
 *   <ma-kasuri></ma-kasuri>
 *
 * Styles: ma-kasuri.css, next to this file (loaded automatically).
 * Design notes: ../DESIGN.md.
 * No outside dependencies; shares a little code with the other pieces in components/shared/. Respects prefers-reduced-motion.
 * Code: MIT · Visual design: CC BY 4.0 · nonsenseblue
 */

import { zoomable } from '../../shared/zoom.js';
import { definePiece, fitBoard, onScreen, seeded } from '../../shared/piece.js';

const FONT = 'https://fonts.googleapis.com/css2?family=Klee+One&family=Shippori+Mincho:wght@500&display=swap';
const NS = 'http://www.w3.org/2000/svg';

/* the four cloths. Every line is our own, none is quoted from the films.
   fresh and faded are the dyes before and after the wash; cream is always the blank, the silence.
   Naruse never wrote at the seaside inn, so his label is woven 番外 and stitched in grey. */
const CLOTHS = [
  {
    title: 'めし', year: '一九五一', en: 'REPAST · MIKIO NARUSE', outsider: true,
    said: '「腹、減ったな」', meant: '「帰ってきてくれ」', pattern: 'blocks', blur: 1,
    fresh: { cream: '#f4efe3', ink: '#1f1e23', mid: '#9c9a94', accent: '#e8553e' },
    faded: { cream: '#f5f1e8', ink: '#2c2b30', mid: '#aaa8a2', accent: '#ec7560' },
  },
  {
    title: '秋刀魚の味', year: '一九六二', en: 'AN AUTUMN AFTERNOON · YASUJIRO OZU',
    said: '「よかった、よかった」', meant: '「行かないでくれ」', pattern: 'igeta', blur: 1,
    fresh: { cream: '#f2f0ea', ink: '#1a1f2b', mid: '#9ea4ab', accent: '#3e5f86' },
    faded: { cream: '#eef0f0', ink: '#202733', mid: '#b4bac0', accent: '#5b84b0' },
  },
  {
    title: '歩いても 歩いても', year: '二〇〇八', en: 'STILL WALKING · HIROKAZU KORE-EDA',
    said: '「また来るよ」', meant: '「次は、間に合わせる」', pattern: 'steps', blur: .55,
    fresh: { cream: '#f1e7cc', ink: '#203a2b', mid: '#61733f', stone: '#c3b08a', accent: '#d9a33a', rust: '#8f4a2f' },
    faded: { cream: '#f4ecd8', ink: '#2f4a39', mid: '#7b8a5a', stone: '#d2c3a3', accent: '#e0b863', rust: '#c87656' },
  },
  {
    title: '海よりもまだ深く', year: '二〇一六', en: 'AFTER THE STORM · HIROKAZU KORE-EDA',
    said: '「雨、やまないな」', meant: '「朝が来なければいい」', pattern: 'storm', blur: .5,
    fresh: { cream: '#eef4f1', ink: '#1d4573', mid: '#367aa3', aqua: '#a4cfd9', green: '#4b9a69', accent: '#f4d24e' },
    faded: { cream: '#f2f6f4', ink: '#3f6c96', mid: '#649cbc', aqua: '#c3e1e7', green: '#78b58f', accent: '#f5de88' },
  },
];

/* what each cloth is about, shown beside it full size */
const TRY = ['Try', 'Rest the pointer on the cloth, or press Replay. It goes through the wash, and letter by letter the label is rewoven into what was meant.'];
const NOTES = [
  { title: 'めし', meta: 'Repast · Mikio Naruse · 1951',
    lead: 'A couple in Osaka whose love has worn thin over rice and small change. She goes back to Tokyo; he comes to take her home, and says almost nothing about why.',
    parts: [['The cloth', 'Ink, grey and one red, the way the black-and-white film is remembered. The cream patches the dye never reached are the silences between them.'],
      ['The label', 'Naruse never wrote at the seaside inn, so his label says 番外, the outsider, and is stitched in grey. It carries the one ordinary thing he says out loud.'], TRY] },
  { title: '秋刀魚の味', meta: 'An Autumn Afternoon · Yasujiro Ozu · 1962',
    lead: 'A widower marries off the daughter who has kept his house. The wedding goes well, and afterwards he sits in a bar on his own, a little drunk.',
    parts: [['The cloth', 'Igeta, the little well-frame, in the colours of a saury’s back: steel blue on blue-black and silver greys. The frames are left to melt in the weave, the way days blur into a routine.'],
      ['The label', 'Ozu wrote his post-war scripts at the seaside inn, so the label is woven 海辺の宿 and stitched in red. It carries the polite thing a father says on the day.'], TRY] },
  { title: '歩いても 歩いても', meta: 'Still Walking · Hirokazu Kore-eda · 2008',
    lead: 'A family gathers at the parents’ house up the hill on the anniversary of the elder son’s death. Everyone is kind for a day, and what matters is left for another visit.',
    parts: [['The cloth', 'One flight of steps in dry summer greens, ochre treads and one step burnt by the sun. No black at all. Two steps are left cream: nobody climbs them.'],
      ['The label', 'Kore-eda has written at the seaside inn since this film, so the label says 海辺の宿. It carries the easy promise made on the way out.'], TRY] },
  { title: '海よりもまだ深く', meta: 'After the Storm · Hirokazu Kore-eda · 2016',
    lead: 'A divorced writer who gambles spends a typhoon night with his son and his ex-wife at his mother’s flat. Father and son go out into the storm and shelter in a playground.',
    parts: [['The cloth', 'Wind-bent rain over a park at night. The only yellow is the lottery tickets, swept in an arc out of the small cream gap where they sheltered, a few more lost on the grass.'],
      ['The label', 'Woven 海辺の宿 like the others. It carries a remark about the weather, which is as close as anyone comes.'], TRY] },
];

/* ---------- the designs, before weaving: which dye goes where, in sheet units (520 × 520) ---------- */

/* 1 · Naruse: big dyed blocks, two cream silences */
const BLOCKS = [['mid', 0, 0, 520, 520], ['ink', 0, 150, 300, 520], ['ink', 330, 0, 520, 190], ['ink', 380, 250, 520, 520],
  ['accent', 150, 170, 250, 330], ['accent', 0, 300, 40, 420], ['cream', 120, 0, 270, 150], ['cream', 250, 200, 420, 300]];
const blocks = (x, y) => { let k = 'cream'; for (const [c, x0, y0, x1, y1] of BLOCKS) if (x >= x0 && x < x1 && y >= y0 && y < y1) k = c; return k; };

/* 2 · Ozu: igeta, little well-frames, left to melt fully in the weave */
const igeta = (x, y) => {
  for (const [x0, y0, x1, y1] of [[40, 40, 200, 150], [330, 250, 480, 330]]) if (x >= x0 && x < x1 && y >= y0 && y < y1) return 'cream';
  const S = 74, cx = Math.floor(x / S), cy = Math.floor((y + (cx % 2) * 37) / S);
  const u = x - cx * S, v = y + (cx % 2) * 37 - cy * S;
  const bar = a => (a > 22 && a < 30) || (a > 44 && a < 52), inside = a => a > 12 && a < 62;
  if ((bar(u) && inside(v)) || (bar(v) && inside(u))) return (cx * 3 + cy) % 7 === 2 ? 'accent' : 'cream';
  return (cx + cy) % 3 === 0 ? 'mid' : 'ink';
};

/* 3 · Kore-eda, Still Walking: one flight of steps up the hill; two steps nobody climbs, one baked in the sun */
const steps = (x, y) => {
  const k = Math.floor(x / 65), top = 470 - k * 50;
  if ((k === 2 || k === 5) && y > top && y < top + 70) return 'cream';
  if (y < top) return 'mid';
  if (y < top + 9) return 'accent';
  if (y < top + 70) return k === 6 ? 'rust' : 'stone';
  return 'ink';
};

/* 4 · Kore-eda, After the Storm: wind-bent rain over a park; the lottery tickets swept in an arc
   out of the small gap where the family sheltered, a few more lost on the grass */
const RAIN_EDGES = [0, 18, 58, 70, 128, 150, 168, 236, 248, 300, 334, 352, 420, 440, 470, 520, 560, 620, 700];
const RAIN_DYES = ['ink', 'aqua', 'ink', 'mid', 'ink', 'aqua', 'mid', 'ink', 'aqua', 'ink', 'mid', 'ink', 'aqua', 'ink', 'mid', 'ink', 'aqua', 'ink'];
const storm = (x, y) => {
  const ground = 430 + Math.sin(x * .013) * 24 + Math.sin(x * .041 + 2) * 9;
  const gx = (x - 120) / 70, gy = (y - 372 - Math.sin(x * .05) * 8) / (34 + Math.sin(x * .09) * 6);
  if (gx * gx + gy * gy < 1 && y < ground) return 'cream';
  const t = (x - 120) / 420, arcY = 372 - Math.sin(Math.max(0, t) * 2.4) * 300 + t * 40;
  const off = Math.abs(y - arcY), spread = 30 + t * 110;
  if (t > 0 && t < 1.05 && off < spread) {
    const i = Math.floor(x / 34), j = Math.floor((y + i * 11) / 32), h = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453 % 1;
    const keep = (1 - off / spread) * (1 - t * .7) * .9, u = x - i * 34, v = y + i * 11 - j * 32, sz = 12 + Math.abs(h) * 12;
    if (Math.abs(h) < keep * 1.1 && u > 5 && u < 5 + sz * .75 && v > 4 && v < 4 + sz) return 'accent';
  }
  if (y > ground) {
    const i = Math.floor(x / 61), h = Math.abs(Math.sin(i * 7.31) * 9301 % 1);
    if (h < .35 && Math.abs(x - i * 61 - 30) < 7 && Math.abs(y - ground - 30 - h * 40) < 9) return 'accent';
    return Math.sin(x * .05 + y * .08) > .55 ? 'mid' : 'green';
  }
  const yy = y + x * .28 + Math.sin(x * .011 + 1.3) * 34 + Math.sin(x * .029 + y * .006) * 16 + Math.sin(y * .017) * 10;
  for (let k = 0; k < RAIN_EDGES.length - 1; k++) if (yy >= RAIN_EDGES[k] && yy < RAIN_EDGES[k + 1]) return RAIN_DYES[k];
  return 'ink';
};

const DESIGNS = { blocks, igeta, steps, storm };

/* ---------- weaving ----------
   Kasuri threads are dyed before weaving and drift a little on the loom, so every edge breaks into
   flames and the colours speckle into each other. Each warp thread gets its own shift and shade.
   The cloth is woven once into an index of dyes and a per-pixel lift; the fresh and the faded
   cloth are then both coloured from it, so the wash only has to fade one into the other. */
const DPR = 1.5, PX = Math.round(520 * DPR), THREAD = 3;
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

function weave(cloth, done) {
  const rnd = seeded(41);
  const shift = [], tone = [];
  for (let x = 0; x < 560;) {
    const wdt = 14 + rnd() * 34, hgt = 14 + rnd() * 46, lean = (rnd() - .5) * .6;
    for (let u = 0; u < wdt; u += THREAD) {
      const k = u / wdt, peak = Math.pow(Math.max(0, 1 - Math.abs(k - .5 - lean * .5) * 2), 1.4);
      shift.push(peak * hgt + (rnd() - .5) * 9 + Math.sin(x * .02) * 8);
      tone.push((rnd() - .5) * .07 + Math.sin(x * .09) * .025);
      x += THREAD;
    }
  }
  const design = DESIGNS[cloth.pattern], A = cloth.blur;
  const keys = Object.keys(cloth.fresh), at = Object.fromEntries(keys.map((k, i) => [k, i]));
  const idx = new Uint8Array(PX * PX), lift = new Float32Array(PX * PX);
  const ease = r => Math.sign(r) * Math.pow(Math.abs(r), 2.2);   // mostly small jitter, now and then a long bleed
  let py = 0;
  /* a few rows at a time, so the page never stalls while the loom works */
  const rows = () => {
    const stop = Math.min(PX, py + 60);
    for (; py < stop; py++) for (let px = 0; px < PX; px++) {
      const x = px / DPR, y = py / DPR, t = Math.floor(x / THREAD);
      const fy = ease(rnd() * 2 - 1) * 26 * A, fx = ease(rnd() * 2 - 1) * 7 * A;
      const yy = Math.min(519, Math.max(0, y + (shift[t] - 24) * A + fy));
      const i = py * PX + px;
      idx[i] = at[design(Math.min(519, Math.max(0, x + fx)), yy)];
      const wx = (x % THREAD) / THREAD, wy = (y % 2.5) / 2.5;
      lift[i] = .055 * Math.sin(wx * Math.PI) - (wy < .25 ? .055 : 0) + tone[t] + (rnd() - .5) * .07;
    }
    if (py < PX) setTimeout(rows, 0);
    else done([cloth.fresh, cloth.faded].map(dyes => dyeCloth(idx, lift, keys.map(k => hex(dyes[k])))));
  };
  rows();
}

function dyeCloth(idx, lift, rgb) {
  const c = document.createElement('canvas'); c.width = c.height = PX;
  const g = c.getContext('2d'), img = g.createImageData(PX, PX), d = img.data;
  for (let i = 0; i < idx.length; i++) {
    const [r, gg, b] = rgb[idx[i]], l = 1 + lift[i], o = i * 4;
    d[o] = r * l; d[o + 1] = gg * l; d[o + 2] = b * l; d[o + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

/* ---------- the woven label: tape with heat-cut edges, both ends folded under and stitched down ---------- */
const TAG_H = 92;
const tagWidth = cloth => ([...cloth.title].length <= 3 ? 190 : 248);
function wovenTag(w, h, thread) {
  const rnd = seeded(5);
  const c = document.createElement('canvas'); c.width = w * 2; c.height = h * 2;
  const g = c.getContext('2d'); g.scale(2, 2);
  const fold = 14;
  g.save(); g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 5; g.shadowOffsetY = 2;
  g.fillStyle = '#efe9dc'; g.fillRect(2, 3, w - 4, h - 6); g.restore();
  for (let y = 3; y < h - 3; y++) {   // weft ribs and a little satin sheen
    const sheen = .5 + .5 * Math.sin(y / h * Math.PI);
    g.fillStyle = `rgba(255,255,255,${(.12 * sheen + (y % 2 ? .06 : 0)).toFixed(3)})`; g.fillRect(2, y, w - 4, 1);
  }
  for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(80,70,55,${(rnd() * .07).toFixed(3)})`; g.fillRect(2 + rnd() * (w - 4), 3 + rnd() * (h - 6), 1.4, .6); }
  g.fillStyle = 'rgba(42,39,36,.75)'; g.fillRect(fold + 6, 8, w - 2 * fold - 12, 1); g.fillRect(fold + 6, h - 9, w - 2 * fold - 12, 1);
  for (const x0 of [2, w - fold - 2]) {   // the folded ends
    const grd = g.createLinearGradient(x0, 0, x0 + fold, 0);
    grd.addColorStop(0, x0 < 10 ? 'rgba(0,0,0,.10)' : 'rgba(0,0,0,.02)'); grd.addColorStop(1, x0 < 10 ? 'rgba(0,0,0,.02)' : 'rgba(0,0,0,.10)');
    g.fillStyle = grd; g.fillRect(x0, 3, fold, h - 6);
    g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x0 < 10 ? x0 + fold : x0, 3, .8, h - 6);
  }
  g.strokeStyle = 'rgba(239,233,220,.9)'; g.lineWidth = .6;
  for (let i = 0; i < 26; i++) { const x = 4 + rnd() * (w - 8), y = rnd() < .5 ? 3 : h - 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - .5) * 1.2, y + (y < 10 ? -1 : 1) * (.5 + rnd() * .9)); g.stroke(); }
  for (const x of [8.5, w - 8.5]) for (let y = 6.5; y < h - 7; y += 4.6) {   // fine running stitch, pressed into the cloth
    const len = 2.6, jx = (rnd() - .5) * .35;
    g.lineCap = 'round';
    g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = 1.25; g.beginPath(); g.moveTo(x + jx + .3, y + .4); g.lineTo(x + jx + .3, y + len + .4); g.stroke();
    g.strokeStyle = thread; g.lineWidth = .85; g.beginPath(); g.moveTo(x + jx, y); g.lineTo(x + jx, y + len); g.stroke();
    g.strokeStyle = 'rgba(255,214,200,.55)'; g.lineWidth = .3; g.beginPath(); g.moveTo(x + jx - .15, y + .4); g.lineTo(x + jx + .1, y + len - .5); g.stroke();
    g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.arc(x + jx, y + len + 1, .32, 0, 7); g.fill();
  }
  return c.toDataURL('image/png');
}

/* ---------- one cloth as one SVG: both dyes, the crease light, the label, and the filters that crumple them ---------- */
function sheetMarkup(cloth, i) {
  const tw = tagWidth(cloth), n = [...cloth.title].length, wide = tw > 200;
  const id = `mk${i}`;
  return `<section class="sheet" aria-label="${cloth.en.split(' · ')[0].toLowerCase()}, ${cloth.year}">
<svg viewBox="0 0 520 520" width="520" height="520" aria-hidden="true">
  <defs>
    <filter id="${id}w" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="0"/>
    </filter>
    <filter id="${id}l" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".035 .06" numOctaves="2" seed="8"/><feDisplacementMap in="SourceGraphic" scale="0"/>
    </filter>
    <filter id="${id}c" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".006 .016" numOctaves="3" seed="3"/>
      <feDiffuseLighting surfaceScale="9" lighting-color="#fff"><feDistantLight azimuth="225" elevation="30"/></feDiffuseLighting>
    </filter>
    <filter id="${id}t" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".02 .045" numOctaves="3" seed="8"/>
      <feDiffuseLighting surfaceScale="6" lighting-color="#fff"><feDistantLight azimuth="225" elevation="30"/></feDiffuseLighting>
    </filter>
    <pattern id="${id}p" width="4" height="1.5" patternUnits="userSpaceOnUse"><rect width="4" height=".6" fill="rgba(240,235,224,.55)"/></pattern>
    <mask id="${id}m" style="mask-type:alpha"><image class="tagimg" width="${tw}" height="${TAG_H}"/></mask>
  </defs>
  <g class="cloth" filter="url(#${id}w)">
    <image class="fresh" x="-13" y="-13" width="546" height="546" preserveAspectRatio="none"/>
    <image class="faded" x="-13" y="-13" width="546" height="546" preserveAspectRatio="none" opacity="0"/>
  </g>
  <rect class="crease" width="520" height="520" filter="url(#${id}c)" opacity="0"/>
  <g transform="translate(${486 - tw} 352) rotate(-1)">
    <g class="tag" filter="url(#${id}l)">
      <image class="tagimg" width="${tw}" height="${TAG_H}"/>
      <g class="woven" transform="translate(32 0)">
        <text class="t" y="${n > 3 ? 20 : 16}" dy=".88em" style="font-size:${Math.min(26, Math.floor(136 / n))}px">${cloth.title}</text>
        <text class="y" x="${tw - 64}" y="${wide ? 53 : 20}" dy=".88em" text-anchor="end">${cloth.year}</text>
        <text class="l" y="51" dy=".88em"></text>
        <text class="mk" x="${tw - 64}" y="${wide ? 21 : 53}" dy=".88em" text-anchor="end">${cloth.outsider ? '番外' : '海辺の宿'}</text>
        <text class="en" y="70" dy=".88em">${cloth.en}</text>
        <rect width="${tw - 64}" height="${TAG_H}" fill="url(#${id}p)"/>
      </g>
      <rect class="tagcrease" width="${tw}" height="${TAG_H}" filter="url(#${id}t)" mask="url(#${id}m)" opacity="0"/>
    </g>
  </g>
</svg>
</section>`;
}

const MARKUP = `<div class="board"><div class="stage">${CLOTHS.map(sheetMarkup).join('')}</div></div>`;

/* where the four cloths lie: two by two, as in day-for-night */
const SQUARE = { w: 1068, h: 1068 }, AT = [[0, 0], [548, 0], [0, 548], [548, 548]];

/* ---------- running ---------- */
function run(root, host) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const board = root.querySelector('.board'), stage = root.querySelector('.stage');
  const sheets = [...root.querySelectorAll('.sheet')];

  fitBoard(host, board, stage, () => SQUARE, () => sheets.forEach((el, i) => { el.style.setProperty('--x', AT[i][0]); el.style.setProperty('--y', AT[i][1]); }));

  /* a cloth opened full size starts its wash from the beginning; Replay starts it again */
  let zoom = null, openAt = 0, lastOpen = null;
  const restart = el => { const s = state[sheets.indexOf(el)]; if (!s) return; s.w = 0; draw(s); openAt = performance.now(); };
  const opened = el => {
    if (zoom && zoom.isOpen(el)) { if (lastOpen !== el) { lastOpen = el; restart(el); } }
    else if (lastOpen === el) lastOpen = null;
  };

  /* each cloth: its parts, its wash (0 fresh → 1 washed), and the letter count already rewoven */
  const state = sheets.map((el, i) => {
    const cloth = CLOTHS[i], q = s => el.querySelector(s);
    el.querySelectorAll('.tagimg').forEach(img => img.setAttribute('href', wovenTag(tagWidth(cloth), TAG_H, cloth.outsider ? '#4a4846' : '#a8392a')));
    return {
      el, cloth, w: 0, shown: -1, hover: false,
      faded: q('.faded'), crease: q('.crease'), tagcrease: q('.tagcrease'), line: q('.l'),
      warp: [...el.querySelectorAll('feDisplacementMap')],
    };
  });

  /* the line on the label: what was said, rewoven letter by letter into what was meant */
  const write = s => {
    const { said, meant } = s.cloth, a = [...said], b = [...meant], n = Math.max(a.length, b.length);
    const done = Math.round(s.w * n);
    if (done === s.shown) return;
    s.shown = done;
    s.line.textContent = '';
    for (let i = 0; i < n; i++) {
      const ch = i < done ? b[i] : a[i];
      if (!ch) continue;
      const span = document.createElementNS(NS, 'tspan');
      span.textContent = ch;
      if (s.w > 0 && s.w < 1 && (i === done - 1 || i === done)) span.setAttribute('opacity', '.5');   // the letter on the loom
      s.line.append(span);
    }
  };
  const draw = s => {
    s.faded.setAttribute('opacity', s.w.toFixed(3));
    s.crease.setAttribute('opacity', (.55 * s.w).toFixed(3));
    s.tagcrease.setAttribute('opacity', (.55 * s.w).toFixed(3));
    s.warp[0].setAttribute('scale', (18 * s.w).toFixed(2));
    s.warp[1].setAttribute('scale', (5 * s.w).toFixed(2));
    write(s);
  };
  state.forEach(draw);
  zoom = zoomable(root, sheets, {
    label: el => el.getAttribute('aria-label'), after: opened, replay: restart,
    notes: el => NOTES[sheets.indexOf(el)], notesFont: '"Shippori Mincho", serif',
  });

  /* weave the four cloths one after another, then show each as soon as it is off the loom */
  let next = 0;
  const loom = () => {
    if (next >= state.length) return;
    const s = state[next++];
    weave(s.cloth, ([fresh, faded]) => {
      s.el.querySelector('.fresh').setAttribute('href', fresh);
      s.faded.setAttribute('href', faded);
      s.el.classList.add('woven');
      loom();
    });
  };

  if (reduce.matches) { board.classList.add('still'); loom(); return; }

  sheets.forEach((el, i) => {
    el.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') { state[i].hover = true; lastHover = performance.now(); } });
    el.addEventListener('pointerleave', () => { state[i].hover = false; lastHover = performance.now(); });
  });

  /* weave only once the board is near the screen, and only animate while it is on screen */
  let visible = false, started = false;
  onScreen(board, on => {
    visible = on;
    if (visible && !started) { started = true; loom(); }
  }, { rootMargin: '200px' });

  /* with nobody's pointer on it, the cloths take turns: one goes slowly through the wash and comes back,
     then the board rests before the next */
  let lastHover = -1e9, last = performance.now();
  const CYCLE = 16, UP = 5, HOLD = 4.5, DOWN = 3.5;
  const frame = now => {
    requestAnimationFrame(frame);
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    if (!visible) return;
    const idle = now - lastHover > 3000 && !state.some(s => s.hover);
    const t = now / 1000, turn = Math.floor(t / CYCLE) % state.length, p = t % CYCLE;
    const autoGoal = p < UP + HOLD ? 1 : 0;
    state.forEach((s, i) => {
      /* the cloth open full size takes every turn itself */
      const open = zoom && zoom.isOpen(s.el), q = ((now - openAt) / 1000) % CYCLE;
      const goal = s.hover ? 1 : open ? (q < UP + HOLD ? 1 : 0) : idle && i === turn && !(zoom && zoom.isAnyOpen()) ? autoGoal : 0;
      const rate = goal > s.w ? 1 / (s.hover ? 4.5 : UP) : 1 / (s.hover ? 2.5 : DOWN);
      const w = goal > s.w ? Math.min(goal, s.w + rate * dt) : Math.max(goal, s.w - rate * dt);
      if (w !== s.w) { s.w = w; draw(s); }
    });
  };
  requestAnimationFrame(frame);
}

/* Japanese faces arrive in slices; ask for the letters actually used */
const USED = [...new Set(CLOTHS.map(c => c.title + c.year + c.said + c.meant + (c.outsider ? '番外' : '海辺の宿')).join(''))].join('');
definePiece('ma-kasuri', { here: import.meta.url, font: FONT, markup: MARKUP, hide: '.board', faces: [['500 26px "Shippori Mincho"', USED + 'AZ·'], ['400 11px "Klee One"', USED]], run });

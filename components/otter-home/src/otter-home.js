/**
 * <otter-home> · tiny-consoles
 * A house on a hillside by the sea, built in Blender and rendered in Cycles, presented like a headset launch.
 * On the page it is three sheets of a launch page: the headline with two screens, how it works, and what you see.
 * Open it and the interface itself comes up: one wide window bent round you, floors on the left, views on the right,
 * and close at hand a small desk with the whole house on it. Step inside, or a click on the big window, shows the
 * renders full size, one after another.
 *
 * Usage:
 *   <script type="module" src="components/otter-home/src/otter-home.js"></script>
 *   <otter-home></otter-home>
 *
 * Styles: otter-home.css, next to this file (loaded automatically).
 * Design notes: ../DESIGN.md.
 * Still pictures only: no WebGL and nothing drawn every frame. Respects prefers-reduced-motion.
 * Code: MIT · Visual design: CC BY 4.0 · nonsenseblue
 */

import { definePiece, fitBoard, onScreen } from '../../shared/piece.js';
const STYLE = new URL('./otter-home.css', import.meta.url).href + new URL(import.meta.url).search;
const FONT = 'https://fonts.googleapis.com/css2?family=Barlow:wght@300;600&family=Inter:wght@400;500&display=swap';
const FACES = ['300 10px Barlow', '600 10px Barlow', '400 10px Inter', '500 10px Inter'];

/* every render, one literal URL each so bundlers ship the files; levels top to bottom as they are reached */
const I = {
  hero: new URL('../assets/sheet-hero.webp', import.meta.url).href,
  steps: new URL('../assets/sheet-steps.webp', import.meta.url).href,
  anatomy: new URL('../assets/sheet-anatomy.webp', import.meta.url).href,
  backdrop: new URL('../assets/backdrop.webp', import.meta.url).href,
  ext_sea: new URL('../assets/ext-sea.webp', import.meta.url).href,
  ext_south: new URL('../assets/ext-south.webp', import.meta.url).href,
  ext_west: new URL('../assets/ext-west.webp', import.meta.url).href,
  ext_iso: new URL('../assets/ext-iso.webp', import.meta.url).href,
  ext_pool: new URL('../assets/ext-pool.webp', import.meta.url).href,
  ext_pergola: new URL('../assets/ext-pergola.webp', import.meta.url).href,
  ext_onsen: new URL('../assets/ext-onsen.webp', import.meta.url).href,
  ext_road: new URL('../assets/ext-road.webp', import.meta.url).href,
  ext_cars: new URL('../assets/ext-cars.webp', import.meta.url).href,
  yard_west: new URL('../assets/yard-west.webp', import.meta.url).href,
  yard_bench: new URL('../assets/yard-bench.webp', import.meta.url).href,
  yard_overview: new URL('../assets/yard-overview.webp', import.meta.url).href,
  sea_far: new URL('../assets/sea-far.webp', import.meta.url).href,
  f3_plan: new URL('../assets/f3-plan.webp', import.meta.url).href,
  f3_screen: new URL('../assets/f3-screen.webp', import.meta.url).href,
  f3_sofa: new URL('../assets/f3-sofa.webp', import.meta.url).href,
  f2_plan: new URL('../assets/f2-plan.webp', import.meta.url).href,
  f2_bed: new URL('../assets/f2-bed.webp', import.meta.url).href,
  f2_nightstand: new URL('../assets/f2-nightstand.webp', import.meta.url).href,
  f2_dressing: new URL('../assets/f2-dressing.webp', import.meta.url).href,
  f2_makeup: new URL('../assets/f2-makeup.webp', import.meta.url).href,
  f2_study: new URL('../assets/f2-study.webp', import.meta.url).href,
  f2_reading: new URL('../assets/f2-reading.webp', import.meta.url).href,
  f2_bath: new URL('../assets/f2-bath.webp', import.meta.url).href,
  f2_vanity: new URL('../assets/f2-vanity.webp', import.meta.url).href,
  f2_washer: new URL('../assets/f2-washer.webp', import.meta.url).href,
  f2_toilet: new URL('../assets/f2-toilet.webp', import.meta.url).href,
  f2_balcony: new URL('../assets/f2-balcony.webp', import.meta.url).href,
  f1_plan: new URL('../assets/f1-plan.webp', import.meta.url).href,
  f1_living: new URL('../assets/f1-living.webp', import.meta.url).href,
  f1_console: new URL('../assets/f1-console.webp', import.meta.url).href,
  f1_dining: new URL('../assets/f1-dining.webp', import.meta.url).href,
  f1_kitchen: new URL('../assets/f1-kitchen.webp', import.meta.url).href,
  f1_cafe: new URL('../assets/f1-cafe.webp', import.meta.url).href,
  f1_toilet: new URL('../assets/f1-toilet.webp', import.meta.url).href,
  f1_genkan: new URL('../assets/f1-genkan.webp', import.meta.url).href,
  b1_plan: new URL('../assets/b1-plan.webp', import.meta.url).href,
  b1_cellar: new URL('../assets/b1-cellar.webp', import.meta.url).href,
  b1_lounge: new URL('../assets/b1-lounge.webp', import.meta.url).href,
  b1_listen: new URL('../assets/b1-listen.webp', import.meta.url).href,
  b1_shower: new URL('../assets/b1-shower.webp', import.meta.url).href,
  b1_closet: new URL('../assets/b1-closet.webp', import.meta.url).href,
  b1_pool: new URL('../assets/b1-pool.webp', import.meta.url).href,
  b1_storage: new URL('../assets/b1-storage.webp', import.meta.url).href,
};

/* the panoramas, one full turn each, taken from the same spot as the photo; the middle of each looks where the photo looks */
const P = {
  ext_sea: new URL('../assets/pano-ext-sea.webp', import.meta.url).href,
  ext_south: new URL('../assets/pano-ext-south.webp', import.meta.url).href,
  ext_west: new URL('../assets/pano-ext-west.webp', import.meta.url).href,
  ext_iso: new URL('../assets/pano-ext-iso.webp', import.meta.url).href,
  ext_pool: new URL('../assets/pano-ext-pool.webp', import.meta.url).href,
  ext_pergola: new URL('../assets/pano-ext-pergola.webp', import.meta.url).href,
  ext_onsen: new URL('../assets/pano-ext-onsen.webp', import.meta.url).href,
  ext_road: new URL('../assets/pano-ext-road.webp', import.meta.url).href,
  ext_cars: new URL('../assets/pano-ext-cars.webp', import.meta.url).href,
  yard_west: new URL('../assets/pano-yard-west.webp', import.meta.url).href,
  /* yard_bench: left out for now; its panorama is taken from inside a tree's crown, so turning round shows leaves at arm's length.
  yard_bench: new URL('../assets/pano-yard-bench.webp', import.meta.url).href, */
  sea_far: new URL('../assets/pano-sea-far.webp', import.meta.url).href,
  f3_screen: new URL('../assets/pano-f3-screen.webp', import.meta.url).href,
  f3_sofa: new URL('../assets/pano-f3-sofa.webp', import.meta.url).href,
  f2_bed: new URL('../assets/pano-f2-bed.webp', import.meta.url).href,
  f2_nightstand: new URL('../assets/pano-f2-nightstand.webp', import.meta.url).href,
  f2_dressing: new URL('../assets/pano-f2-dressing.webp', import.meta.url).href,
  f2_makeup: new URL('../assets/pano-f2-makeup.webp', import.meta.url).href,
  f2_study: new URL('../assets/pano-f2-study.webp', import.meta.url).href,
  f2_reading: new URL('../assets/pano-f2-reading.webp', import.meta.url).href,
  f2_bath: new URL('../assets/pano-f2-bath.webp', import.meta.url).href,
  f2_vanity: new URL('../assets/pano-f2-vanity.webp', import.meta.url).href,
  f2_washer: new URL('../assets/pano-f2-washer.webp', import.meta.url).href,
  f2_toilet: new URL('../assets/pano-f2-toilet.webp', import.meta.url).href,
  f2_balcony: new URL('../assets/pano-f2-balcony.webp', import.meta.url).href,
  f1_living: new URL('../assets/pano-f1-living.webp', import.meta.url).href,
  f1_console: new URL('../assets/pano-f1-console.webp', import.meta.url).href,
  f1_dining: new URL('../assets/pano-f1-dining.webp', import.meta.url).href,
  f1_kitchen: new URL('../assets/pano-f1-kitchen.webp', import.meta.url).href,
  f1_cafe: new URL('../assets/pano-f1-cafe.webp', import.meta.url).href,
  f1_toilet: new URL('../assets/pano-f1-toilet.webp', import.meta.url).href,
  f1_genkan: new URL('../assets/pano-f1-genkan.webp', import.meta.url).href,
  b1_cellar: new URL('../assets/pano-b1-cellar.webp', import.meta.url).href,
  b1_lounge: new URL('../assets/pano-b1-lounge.webp', import.meta.url).href,
  b1_listen: new URL('../assets/pano-b1-listen.webp', import.meta.url).href,
  b1_shower: new URL('../assets/pano-b1-shower.webp', import.meta.url).href,
  b1_closet: new URL('../assets/pano-b1-closet.webp', import.meta.url).href,
  b1_pool: new URL('../assets/pano-b1-pool.webp', import.meta.url).href,
  b1_storage: new URL('../assets/pano-b1-storage.webp', import.meta.url).href,
};
/* how far each photo looks up or down, in degrees: the panorama is hung so that this sits in the middle of the window */
const PITCH = { ext_sea: -6.2, ext_south: -2.4, ext_west: -5.1, ext_iso: -24.0, ext_pool: -16.2, ext_pergola: -9.3, ext_onsen: -19.5, ext_road: 4.0, ext_cars: -8.4, yard_west: -2.2, yard_bench: -15.2, sea_far: -15.9, f3_screen: 0.0, f3_sofa: -6.2, f2_bed: -7.1, f2_nightstand: -24.4, f2_dressing: -8.2, f2_makeup: -9.8, f2_study: -11.1, f2_reading: -9.0, f2_bath: -11.5, f2_vanity: -9.5, f2_washer: -13.7, f2_toilet: -25.0, f2_balcony: -4.6, f1_living: -3.9, f1_console: -4.8, f1_dining: -4.9, f1_kitchen: -6.5, f1_cafe: -6.4, f1_toilet: -20.3, f1_genkan: -20.3, b1_cellar: -4.6, b1_lounge: -9.7, b1_listen: -6.9, b1_shower: -11.1, b1_closet: -7.1, b1_pool: -5.4, b1_storage: -8.7 };

const LEVELS = [
  { name: 'Outside', shots: [['ext_sea', 'From the sea'], ['ext_south', 'The front'], ['ext_west', 'From the west'], ['ext_iso', 'From above'], ['ext_pool', 'Pool'], ['ext_pergola', 'Shade'], ['ext_onsen', 'Onsen balcony'], ['ext_road', 'From the road'], ['ext_cars', 'Carport']] },
  { name: 'Garden', shots: [['yard_west', 'West garden'], ['yard_bench', 'Bench above the sea'], ['yard_overview', 'The whole garden'], ['sea_far', 'Sea and house']] },
  { name: '3F', shots: [['f3_plan', 'The whole floor'], ['f3_screen', 'Screen'], ['f3_sofa', 'Sofa']] },
  { name: '2F', shots: [['f2_plan', 'The whole floor'], ['f2_bed', 'Bedroom'], ['f2_nightstand', 'Nightstand'], ['f2_dressing', 'Dressing room'], ['f2_makeup', 'Dressing table'], ['f2_study', 'Study'], ['f2_reading', 'Reading corner'], ['f2_bath', 'Bath'], ['f2_vanity', 'Washbasin'], ['f2_washer', 'Laundry'], ['f2_toilet', 'Toilet'], ['f2_balcony', 'Balcony']] },
  { name: '1F', shots: [['f1_plan', 'The whole floor'], ['f1_living', 'Living room'], ['f1_console', 'Record shelf'], ['f1_dining', 'Dining'], ['f1_kitchen', 'Kitchen'], ['f1_cafe', 'Café corner'], ['f1_toilet', 'Toilet'], ['f1_genkan', 'Entrance']] },
  { name: 'B1', shots: [['b1_plan', 'The whole floor'], ['b1_cellar', 'Bar'], ['b1_lounge', 'Lounge'], ['b1_listen', 'Records'], ['b1_shower', 'Shower'], ['b1_closet', 'Wardrobe'], ['b1_pool', 'Out to the pool'], ['b1_storage', 'Storeroom']] },
];

/* where each level sits on the small house on the desk, as left, top, width, height in % of the desk picture */
const HERE = { Outside: [22, 8, 58, 74], Garden: [2, 40, 52, 56], '3F': [36, 12, 30, 20], '2F': [30, 26, 40, 18], '1F': [30, 40, 40, 17], B1: [33, 54, 36, 16] };

const ICON = {
  go: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  prev: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg>',
  next: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"/></svg>',
  replay: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.6"/><path d="M12 1.8v3h-3"/></svg>',
  close: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13"/></svg>',
};

const STRIPS = 24;
const DEEP = 60;   /* strips in the view you step into: 100° of arc, under 2° each, so straight lines stay straight */
/* the badge's lettering runs once round its circle, evenly spaced; the ring turns slowly while it is on screen */
const RING = `<svg viewBox="0 0 140 140" aria-hidden="true"><defs><path id="ring" d="M70,70 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/>
<linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9d2a5"/><stop offset="1" stop-color="#e3c99e"/></linearGradient></defs>
<g class="turn"><text><textPath href="#ring" textLength="287.0" lengthAdjust="spacing">STEP INSIDE  ·  STEP INSIDE  ·  </textPath></text></g>
<circle cx="70" cy="70" r="25" fill="none" stroke="url(#rg)" stroke-width="1.4"/><path class="arr" d="M63 77 77 63M66 63h11v11"/></svg>`;

const MARKUP = `<div class="board"><div class="stage">
<button class="sheet hero" type="button" aria-label="Open: Built to step into without leaving"><img src="${I.hero}" alt="" draggable="false"></button>
<button class="sheet steps" type="button" aria-label="Open: how it works"><img src="${I.steps}" alt="" draggable="false"></button>
<button class="badge" type="button" aria-label="Step inside">${RING}</button>
<button class="sheet anatomy" type="button" aria-label="Open: what you see"><img src="${I.anatomy}" alt="" draggable="false"></button>
</div></div>
<dialog class="space" tabindex="-1" aria-label="Hillside House"><div class="vrhost"><div class="vr">
<div class="launch"><div class="glass lp"><p class="lk">Hillside House</p><h3>Where would you<br>like to begin?</h3>
<div class="opts"><button type="button" data-go="0" class="on"><span style="background-image:url(${I.ext_sea})"></span><b>Outside</b><i>9 views</i></button><button type="button" data-go="1"><span style="background-image:url(${I.yard_bench})"></span><b>Garden</b><i>4 views</i></button><button type="button" data-go="4"><span style="background-image:url(${I.f1_living})"></span><b>Inside</b><i>Four floors, B1 to 3F</i></button></div>
<button class="enter" type="button">Enter${ICON.go}</button></div><p class="lhint">Look, then pinch to choose</p></div>
<div class="bg" style="background-image:url(${I.backdrop})"></div>
<button class="win" type="button" aria-label="Open full size"><span class="cyl">${'<i></i>'.repeat(STRIPS)}</span></button>
<nav class="glass pan floors" aria-label="Floors"><h4>Floors</h4>${LEVELS.map((L, l) => `<button type="button" data-l="${l}">${L.name}</button>`).join('')}</nav>
<div class="glass pan views"><h4>Views</h4><div class="vw"></div><button class="go" type="button">Step inside${ICON.go}</button></div>
<div class="imm" aria-hidden="true"><img class="iimg" alt="" draggable="false"><div class="iwin"><span class="cyl">${'<i></i>'.repeat(DEEP)}</span></div>
<button class="glass ib iback" type="button">${ICON.prev}<span>Back</span></button>
<button class="glass ib iprev" type="button" aria-label="Previous">${ICON.prev}</button><button class="glass ib inext" type="button" aria-label="Next">${ICON.next}</button>
<p class="glass icap"></p></div>
<div class="glass desk"><div class="mini"><img src="${I.ext_iso}" alt="" draggable="false"><i class="here"></i><span class="lab">Hillside House</span></div></div>
</div></div>
<button class="sclose" type="button" aria-label="Close">${ICON.close}</button></dialog>
`;

function run(root) {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const board = root.querySelector('.board'), stage = root.querySelector('.stage');
  /* the product sheet on the page, drawn at 1600 × 900 and scaled to the column */
  fitBoard(board, board, stage, () => ({ w: 1760, h: 720 }), () => {});
  if (still) board.classList.add('still');

  /* the interface, in its own view: always the wide layout, scaled to fit the screen, phones included */
  const space = root.querySelector('dialog.space'), host = root.querySelector('.vrhost'), vr = root.querySelector('.vr');
  /* measured with offsetWidth, which ignores the quarter turn the view takes on a phone held upright */
  const fitVr = () => { if (host.offsetWidth) vr.style.setProperty('--k', host.offsetWidth / 1600); };
  new ResizeObserver(fitVr).observe(host);
  if (still) vr.classList.add('still');
  /* two bent windows: the big one in the space, and the larger one you step into; both are strips on a cylinder seen from inside */
  const W = 940, H = 400;
  vr.style.setProperty('--ww', W); vr.style.setProperty('--wh', H);
  const bend = (frame, w, h, r, eye = 1.15) => {
    const el = frame.querySelector('.cyl'), strips = [...el.children], n = strips.length, ang = w / r, sw = w / n;
    strips.forEach((s, i) => {
      const a = -ang / 2 + (i + .5) * ang / n;
      s.style.cssText = `left:${(-sw / 2 - .5).toFixed(1)}px;width:${(sw + 1).toFixed(1)}px;top:${-h / 2}px;height:${h}px;transform:translateZ(${r}px) rotateY(${(-a * 180 / Math.PI).toFixed(3)}deg) translateZ(${-r}px)`;
    });
    frame.style.perspective = `${Math.round(r * eye)}px`;
    return { el, strips, w, h, r, sw };
  };
  const bigC = bend(root.querySelector('.win'), W, H, 760), deepC = bend(root.querySelector('.iwin'), 1142, 642, 924);
  /* the ends of a bent window come toward you and look about 1.19 times taller than its middle (perspective 1.15 r, 71° of arc),
     so the larger one is sized for its ends to fill the photo's own frame, 1360 × 765; the controls sit 48 in from the space's edge, clear of it */
  /* a panorama wraps the whole cylinder once round, so a pixel of arc is a pixel of picture; turn is how far it has been dragged, in radians */
  let turn = 0;
  const hang = (c, k) => {
    if (P[k]) {
      const pw = 2 * Math.PI * c.r, ph = pw / 2, y = c.h / 2 - (90 - PITCH[k]) / 180 * ph, x = c.w / 2 - pw / 2 + turn * c.r;
      c.el.style.setProperty('--img', `url(${P[k]})`); c.el.classList.add('pano');
      c.strips.forEach((s, i) => { s.style.backgroundSize = `${pw.toFixed(1)}px ${ph.toFixed(1)}px`; s.style.backgroundPosition = `${(x - i * c.sw).toFixed(1)}px ${y.toFixed(1)}px`; });
    } else {
      c.el.style.setProperty('--img', `url(${I[k]})`); c.el.classList.remove('pano');
      c.strips.forEach((s, i) => { s.style.backgroundSize = `${c.w}px ${c.h}px`; s.style.backgroundPosition = `${-(i * c.sw).toFixed(1)}px 0`; });
    }
  };
  /* the start screen comes first each time: choose where to begin, then Enter */
  const launch = root.querySelector('.launch'), picks = [...launch.querySelectorAll('.opts button')];
  let pick = 0;
  picks.forEach(b => b.addEventListener('click', () => { pick = +b.dataset.go; picks.forEach(x => x.classList.toggle('on', x === b)); }));
  launch.querySelector('.enter').addEventListener('click', () => { fill(pick); show(pick, 0, false); vr.classList.add('in'); });
  const enter = () => { if (typeof space.showModal !== 'function') return; vr.classList.remove('in'); space.showModal(); space.focus(); fitVr(); };
  /* on a phone held upright both views are turned a quarter, so the house fills the screen when the phone is turned */
  const upright = matchMedia('(max-width: 720px) and (orientation: portrait)');
  root.querySelectorAll('.sheet, .badge').forEach(b => b.addEventListener('click', enter));
  onScreen(board, v => board.classList.toggle('on', v));
  root.querySelector('.sclose').addEventListener('click', () => space.close());
  space.addEventListener('click', e => { if (e.target === space) space.close(); });
  space.addEventListener('keydown', e => { if (e.key !== 'Escape') e.stopPropagation(); });
  ['wheel', 'touchmove'].forEach(t => space.addEventListener(t, e => e.stopPropagation(), { passive: true }));

  const win = root.querySelector('.win'), cyl = root.querySelector('.cyl');
  const tabs = [...root.querySelectorAll('.floors button')], vw = root.querySelector('.vw'), here = root.querySelector('.here');
  let lv = 0, at = 0;
  const show = (l, j, fade = true) => {
    const changed = l !== lv || j !== at;
    lv = l; at = j;
    tabs.forEach((b, i) => { b.classList.toggle('on', i === l); b.setAttribute('aria-pressed', i === l); });
    const [k] = LEVELS[l].shots[j];
    if (changed) turn = 0;   /* a new view starts looking where its photo looks */
    const paint = () => { hang(bigC, k); cyl.classList.remove('out'); };
    if (fade && changed && !still) { cyl.classList.add('out'); setTimeout(paint, 180); } else paint();
    vw.querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', i === j));
    const [x, y, w, h] = HERE[LEVELS[l].name];
    here.style.cssText = `left:${x}%;top:${y}%;width:${w}%;height:${h}%`;
  };
  const fill = l => {
    vw.innerHTML = LEVELS[l].shots.map(([k, n], j) => `<button type="button" data-j="${j}" aria-label="${n}"><img src="${I[k]}" alt="" loading="lazy" draggable="false"></button>`).join('');
    vw.scrollTop = 0;
    vw.querySelectorAll('button').forEach(b => b.addEventListener('click', () => show(lv, +b.dataset.j)));
  };
  tabs.forEach((b, i) => b.addEventListener('click', () => { if (i !== lv) { fill(i); show(i, 0); } }));
  fill(0); show(0, 0, false);
  /* the scroll of the views panel stays inside it */
  vw.addEventListener('wheel', e => e.stopPropagation(), { passive: true });

  /* a little parallax: the panels nearer to you move more as the pointer moves; nothing runs while it is still */
  if (!still) {
    let raf = 0, px = 0, py = 0;
    vr.addEventListener('pointermove', e => {
      const r = vr.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width * 2 - 1; py = (e.clientY - r.top) / r.height * 2 - 1;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; vr.style.setProperty('--px', px.toFixed(3)); vr.style.setProperty('--py', py.toFixed(3)); });
    });
    vr.addEventListener('pointerleave', () => { vr.style.setProperty('--px', 0); vr.style.setProperty('--py', 0); });
  }

  /* stepping inside: the chosen picture grows to fill the space, with glass controls of the interface's own */
  const imm = root.querySelector('.imm'), img = imm.querySelector('.iimg'), cap = imm.querySelector('.icap'), iwin = imm.querySelector('.iwin');
  const deep = () => vr.classList.contains('deep');
  const open = j => {
    const S = LEVELS[lv].shots, n = S.length;
    j = (j + n) % n;
    const [k, label] = S[j];
    cap.textContent = `${j + 1} / ${n} · ${LEVELS[lv].name} · ${label}`;
    show(lv, j, false);
    /* with a panorama the space is the larger bent window you can turn; without one, the photo itself */
    imm.classList.toggle('pano', !!P[k]);
    const face = P[k] ? iwin : img;
    if (P[k]) hang(deepC, k); else img.src = I[k];
    if (!still) { face.classList.remove('in'); void face.offsetWidth; face.classList.add('in'); }
    vr.classList.add('deep'); imm.setAttribute('aria-hidden', 'false');
  };
  const back = () => { vr.classList.remove('deep'); imm.setAttribute('aria-hidden', 'true'); };
  /* drag sideways on a panorama to look round; a press that hardly moves is still a click. The space is drawn at 1600 wide and
     scaled, and on a phone held upright it is turned a quarter, so the drag is measured in the space's own pixels along its width */
  let moved = false;
  const turnable = (frame, c) => {
    let from = null;
    const along = e => (upright.matches ? e.clientY : e.clientX) / (host.offsetWidth / 1600);
    frame.addEventListener('pointerdown', e => { moved = false; if (!c.el.classList.contains('pano')) return; from = { x: along(e), turn }; frame.setPointerCapture(e.pointerId); });
    frame.addEventListener('pointermove', e => {
      if (!from) return;
      const d = along(e) - from.x;
      if (Math.abs(d) > 4) moved = true;
      turn = from.turn + d / c.r; hang(c, LEVELS[lv].shots[at][0]);
    });
    const end = () => { from = null; };
    frame.addEventListener('pointerup', end); frame.addEventListener('pointercancel', end);
  };
  turnable(win, bigC); turnable(iwin, deepC);
  win.addEventListener('click', () => { if (moved) { moved = false; return; } open(at); });
  root.querySelector('.go').addEventListener('click', () => open(at));
  imm.querySelector('.iprev').addEventListener('click', () => open(at - 1));
  imm.querySelector('.inext').addEventListener('click', () => open(at + 1));
  imm.querySelector('.iback').addEventListener('click', back);
  /* inside the space the arrow keys turn the pictures; Escape steps back out before it closes the space */
  space.addEventListener('keydown', e => {
    if (!deep()) return;
    if (e.key === 'ArrowRight') { open(at + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { open(at - 1); e.preventDefault(); }
    if (e.key === 'Escape') { back(); e.preventDefault(); }
  });
  space.addEventListener('cancel', e => { if (deep()) { e.preventDefault(); back(); } });
  space.addEventListener('close', back);
  let sx = null, sy = 0;
  /* a sideways swipe turns to the next photo; on a panorama the same gesture turns the view instead */
  imm.addEventListener('touchstart', e => { sx = imm.classList.contains('pano') ? null : e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  imm.addEventListener('touchend', e => {
    if (sx === null) return;
    let dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
    if (upright.matches) [dx, dy] = [dy, -dx];
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) open(at + (dx < 0 ? 1 : -1));
  }, { passive: true });
}

definePiece('otter-home', { style: STYLE, font: FONT, faces: FACES, markup: MARKUP, hide: '.board', run });

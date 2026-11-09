/**
 * <claim-check> · tiny-consoles
 * What someone left at the counters this week, gathered in a small stack: a repair ticket, a laundry
 * slip with its carbon copy, and two tags. They lie finished; open one full size and it is written
 * again, field by field, until the day is circled by hand.
 *
 * Usage:
 *   <script type="module" src="components/claim-check/src/claim-check.js"></script>
 *   <claim-check></claim-check>
 *
 * Styles: claim-check.css, next to this file (loaded automatically).
 * Design notes: ../DESIGN.md.
 * No outside dependencies; shares a little code with the other pieces in components/shared/. Respects prefers-reduced-motion.
 * Code: MIT · Visual design: CC BY 4.0 · nonsenseblue
 */

import { zoomable } from '../../shared/zoom.js';
import { definePiece, fitBoard } from '../../shared/piece.js';
const STYLE = new URL('./claim-check.css', import.meta.url).href + new URL(import.meta.url).search;

const FONT = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Cutive+Mono&display=swap';

/* a circle made by hand: not round, a little tilted, and the pen runs on past where it started */
function loop(cx, cy, rx, ry, tilt, start, turns, seed) {
  const pts = [], n = 72, c = Math.cos(tilt), s = Math.sin(tilt);
  for (let i = 0; i <= n; i++) {
    const k = i / n, th = start + 2 * Math.PI * turns * k;
    const r = 1 + .07 * Math.sin(2 * th + seed) + .04 * Math.sin(5 * th + seed * 2) + .14 * Math.max(0, k - .8) / .2 * .6 + .03 * k;
    const x = rx * r * Math.cos(th), y = ry * r * Math.sin(th) * (Math.sin(th) > 0 ? .92 : 1.04);
    pts.push([cx + x * c - y * s, cy + x * s + y * c]);
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i += 2) d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${pts[i + 1][0].toFixed(1)} ${pts[i + 1][1].toFixed(1)}`;
  return d;
}
const DEG = Math.PI / 180;
const PEN = loop(30, 13, 25, 10.5, -.09, 205 * DEG, 1.2, 1.3);
const RING = loop(20, 9, 17, 8.5, .07, 220 * DEG, 1.18, 2.1);
const CRAYON = loop(12, 8, 9.5, 7, -.14, 235 * DEG, 1.22, .7);

/* the paper's tooth: noise lit from the top left, kept light, with a few dark specks */
const paper = (id, freq, octaves, depth, light, seed) => `<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${octaves}" seed="${seed}" result="n"/>
  <feDiffuseLighting in="n" surfaceScale="${depth}" lighting-color="#fff" result="l"><feDistantLight azimuth="225" elevation="${light}"/></feDiffuseLighting>
  <feComponentTransfer in="l" result="lit"><feFuncR type="linear" slope=".42" intercept=".62"/><feFuncG type="linear" slope=".42" intercept=".62"/><feFuncB type="linear" slope=".42" intercept=".62"/></feComponentTransfer>
  <feTurbulence type="fractalNoise" baseFrequency="1.9" numOctaves="1" seed="${seed + 7}" result="sp"/>
  <feColorMatrix in="sp" type="matrix" values="0 0 0 0 .32  0 0 0 0 .29  0 0 0 0 .25  0 0 0 -14 3.4" result="dots"/>
  <feMerge><feMergeNode in="lit"/><feMergeNode in="dots"/></feMerge></filter>`;

const DEFS = `<svg class="defs" aria-hidden="true">
  <!-- printed rules and labels: ink that did not quite take everywhere, and spread a little -->
  <filter id="print" x="-2%" y="-2%" width="104%" height="104%">
    <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="11" result="fine"/>
    <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="5" result="broad"/>
    <feComposite in="fine" in2="broad" operator="arithmetic" k2=".75" k3=".3" result="mix"/>
    <feColorMatrix in="mix" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 2.62" result="mask"/>
    <feGaussianBlur in="SourceGraphic" stdDeviation=".3" result="spread"/>
    <feComposite in="spread" in2="mask" operator="in" result="inked"/>
    <feTurbulence type="fractalNoise" baseFrequency=".09" seed="13" result="wob"/>
    <feDisplacementMap in="inked" in2="wob" scale=".45" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="worn"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.45" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in" result="s"/><feTurbulence type="fractalNoise" baseFrequency=".05" seed="2" result="w"/><feDisplacementMap in="s" in2="w" scale="1.6"/></filter>
  <filter id="carbon"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" result="d"/><feGaussianBlur in="d" stdDeviation=".35"/></filter>
  <filter id="crayon"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="9" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2 1.4" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in" result="s"/><feTurbulence type="fractalNoise" baseFrequency=".08" seed="3" result="w"/><feDisplacementMap in="s" in2="w" scale="2"/></filter>
  <filter id="washer"><feTurbulence type="fractalNoise" baseFrequency=".6" seed="21" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.3"/></filter>
  ${paper('card', 1.05, 4, .55, 60, 3)}
  ${paper('thin', 1.4, 3, .42, 62, 5)}
  ${paper('stock', .85, 5, .9, 56, 11)}
</svg>`;

const grain = (w, h, id) => `<svg class="grain" width="${w}" height="${h}" aria-hidden="true"><rect width="100%" height="100%" filter="url(#${id})"/></svg>`;
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S'];
const tag = (shop, kind, no, item, todo, ready, day) => `<section class="sheet tag-s"><div class="tag">
  ${grain(300, 140, 'stock')}<i class="eye"></i>
  <div class="in"><div class="head"><span class="shop">${shop}<span class="lab">${kind}</span></span><b>${no}</b></div>
    <div class="row"><span class="lab">Item</span><span class="typed">${item}</span></div>
    <div class="row"><span class="lab">Do</span><span class="typed">${todo}</span></div>
    <div class="row"><span class="lab">Ready</span><span class="typed">${ready}</span></div>
    <div class="wk">${DAYS.map((d, i) => `<span>${d}${i === day ? `<svg class="crayon" width="24" height="16" viewBox="0 0 24 16" aria-hidden="true"><path d="${CRAYON}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>` : ''}</span>`).join('')}</div></div>
</div></section>`;

const MARKUP = `${DEFS}<div class="desk" part="desk"><div class="stage">
<section class="sheet"><div class="docket">
  <div class="grid">
    <div class="r top">
      <div class="c shop"><span class="lab">Townsend</span><span class="lab">Repairs<br>&amp; Small<br>Mending</span><span class="lab">Est. 1961</span></div>
      <div class="c" style="flex:1"><span class="lab" style="opacity:.75">Watches · Shoes · Umbrellas · Zips · Bags</span></div>
      <div class="c no"><span class="lab">Ticket No.</span><b>0318</b></div>
    </div>
    <div class="r line"><div class="c" style="flex:1"><span class="lab">Name</span><span class="typed">E. Marlowe</span></div><div class="c" style="width:150px"><span class="lab">Received</span><span class="typed" style="left:58px">03/11</span></div></div>
    <div class="r line"><div class="c" style="flex:1"><span class="lab">Article</span><span class="typed">Pocket watch, brass case, no chain</span></div><div class="c" style="width:150px"><span class="lab">No. of pieces</span><span class="typed" style="left:110px">1</span></div></div>
    <div class="r line"><div class="c" style="flex:1"><span class="lab">Fault</span><span class="typed">Stops at night. Starts again by noon.</span></div></div>
    <div class="r days">
      <div class="c"><span class="lab">Mon</span></div><div class="c"><span class="lab">Tue</span></div>
      <div class="c"><span class="lab">Wed</span><svg class="pen" width="60" height="26" viewBox="0 0 60 26" aria-hidden="true"><path d="${PEN}" fill="none" stroke="#24221f" stroke-width="1.05" stroke-linecap="round" opacity=".88"/></svg>
        <div class="stamp"><small>Received</small>03 NOV<small>Townsend</small></div></div>
      <div class="c"><span class="lab">Thu</span></div><div class="c"><span class="lab">Fri</span></div><div class="c"><span class="lab">Sat</span></div><div class="c" style="opacity:.35"><span class="lab">Closed</span></div>
    </div>
    <div class="r" style="height:70px">
      <div class="c" style="flex:1"><span class="lab">Work to be done</span>
        <div class="typed" style="position:static;margin:9px 0 0 6px;line-height:1.5">Clean and oil. Check the mainspring.<br>Do not polish the case, customer asks.</div></div>
      <div class="c" style="width:150px"><span class="lab">Estimate</span><span class="typed" style="left:auto;right:10px;bottom:30px">£ 24.00</span><span class="lab" style="position:absolute;left:6px;bottom:22px">Deposit</span><span class="typed" style="left:auto;right:10px;bottom:6px">£ 10.00</span></div>
    </div>
    <div class="r" style="height:26px">
      <div class="c" style="width:58px"><span class="lab">Clean</span><span class="tick" style="left:36px">x</span></div>
      <div class="c" style="width:58px"><span class="lab">Repair</span><span class="tick" style="left:40px">x</span></div>
      <div class="c" style="width:58px"><span class="lab">Replace</span></div>
      <div class="c" style="flex:1"><span class="lab">Ready</span><span class="typed" style="left:44px">after four, any day you like</span></div>
    </div>
    <div class="r" style="border-bottom:0;padding-top:7px"><div class="fine" style="width:330px">Articles not collected within ninety days may be sold to cover the cost of repair. We are not responsible for loss by fire or by time.</div></div>
  </div>
  ${grain(600, 342, 'card')}
</div></section>
<section class="sheet slip-s"><div class="slip">
  <div class="part copy">
    <h1>MERIDIAN</h1>
    <div class="lab sub">Laundry · Dry Cleaning · Pressing</div>
    <div class="row"><span class="lab">Name</span><span class="typed carbon">Okafor</span><span class="lab right">No.</span><span class="typed carbon">47</span></div>
    <div class="row"><span class="lab">In</span><span class="typed carbon">Tues</span><span class="lab right">Out</span><span class="typed carbon">Fri</span></div>
    <table>
      <tr><th style="width:26px">Qty</th><th>Article</th><th style="width:84px">Note</th></tr>
      <tr><td class="typed carbon">3</td><td class="typed carbon">Shirt, white</td><td class="typed carbon">collar</td></tr>
      <tr><td class="typed carbon">1</td><td class="typed carbon">Wool coat</td><td class="typed carbon">btn top</td></tr>
      <tr><td class="typed carbon">1</td><td class="typed carbon">Tablecloth</td><td class="typed carbon">wine</td></tr>
      <tr><td class="typed carbon">2</td><td class="typed carbon">Pillowcase</td><td></td></tr>
      <tr><td></td><td></td><td></td></tr>
    </table>
    <div class="days lab"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri<svg class="ring" width="40" height="18" viewBox="0 0 40 18" aria-hidden="true"><path d="${RING}" fill="none" stroke="#4b3f8c" stroke-width="1.25" stroke-linecap="round" opacity=".85"/></svg></span><span>Sat</span></div>
    <div class="lab" style="margin-top:8px;opacity:.75">Shop copy</div>
  </div>
  <div class="perf"></div>
  <div class="part stub">
    <div style="display:flex;justify-content:space-between"><span class="lab">Meridian · Customer stub</span><span class="lab">Keep this</span></div>
    <div class="bignum carbon">47</div>
    <div class="fine">Ready Friday after noon. No stub, no clothes.<br>Unclaimed after thirty days go to charity.</div>
  </div>
  ${grain(330, 430, 'thin')}
</div></section>
${tag('Keys &amp; Blades', 'Sharpening', '0907', 'Kitchen knife, carbon', 'Dull. Will not cut bread', 'Next Tue', 1)}
${tag('A. Pell', 'Alterations', '261', 'Trousers, grey wool', 'Hem up 2 cm, keep cuff', 'Fri', 3)}
</div></div>`;

/* where each sheet lies: design units, rotation in degrees, scale. The sizes keep to real ones: the tag is
   a 12 cm tag, the ticket about 15 cm, the slip 10 by 13. Wide boards leave room round the stack; on a
   phone the board is cut close to it, so the stack is not lost in the margins. */
const LAYOUTS = {
  wide:   { w: 1640, h: 690, at: [[504.6, 145.6, -2, .818], [359.4, 112.6, -3.5, .964], [808.2, 403, -6, 1.043], [847.8, 442.6, 4, 1.043]] },
  narrow: { w: 690,  h: 476, at: [[150, 80, -2, .62], [40, 55, -3.5, .73], [380, 275, -6, .79], [410, 305, 4, .79]] },
};

/* ---------- motion ---------- */

const CHAR = 24, GAP = 65;   /* ms per character, ms between one field and the next */

function textNodes(el) {
  const out = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) if (w.currentNode.nodeValue.trim()) out.push(w.currentNode);
  return out;
}

/* one sheet's writing as a timeline: seek(t) shows it as it is t ms after it starts; live plays the stamp */
function timeline(sheet) {
  const ev = [];
  let t = 300;
  const type = el => {
    /* each piece of text keeps its full place; the part not yet typed is there but invisible */
    const nodes = textNodes(el).map(n => {
      const text = n.nodeValue, wrap = document.createElement('span'), shown = document.createTextNode(''), rest = document.createElement('span');
      rest.className = 'unt'; rest.textContent = text;
      wrap.append(shown, rest); n.replaceWith(wrap);
      return { shown, rest: rest.firstChild, text };
    });
    const len = nodes.reduce((a, x) => a + x.text.length, 0), t0 = t;
    ev.push(T => {
      let n = Math.max(0, Math.floor((T - t0) / CHAR));
      for (const x of nodes) { const k = Math.min(n, x.text.length); if (x.shown.nodeValue.length !== k) { x.shown.nodeValue = x.text.slice(0, k); x.rest.nodeValue = x.text.slice(k); } n -= k; }
    });
    t += len * CHAR + GAP;
  };
  /* the carbon copy comes up field by field, from blurred to as sharp as carbon gets */
  const press = (el, dur, step) => {
    const t0 = t;
    ev.push(T => {
      const k = Math.max(0, Math.min(1, (T - t0) / dur)), e = 1 - Math.pow(1 - k, 3);
      if (k >= 1) { el.style.removeProperty('opacity'); el.style.removeProperty('filter'); return; }
      el.style.opacity = (e * .88).toFixed(3);
      el.style.filter = `url(#carbon) blur(${((1 - e) * 1.2).toFixed(2)}px)`;
    });
    t += step;
  };
  /* a line drawn by hand, in one go */
  const draw = (path, dur) => {
    const L = path.getTotalLength(), t0 = t;
    path.style.strokeDasharray = L;
    ev.push(T => { const k = Math.max(0, Math.min(1, (T - t0) / dur)); path.style.strokeDashoffset = (L * (1 - (1 - (1 - k) * (1 - k)))).toFixed(2); });
    t += dur;
  };
  const stampDown = (stamp, card) => {
    const t0 = t;
    ev.push((T, live) => {
      if (T < t0) { stamp.classList.remove('down', 'set'); return; }
      if (!live) { stamp.classList.remove('down'); stamp.classList.add('set'); return; }
      if (stamp.classList.contains('down') || stamp.classList.contains('set')) return;
      stamp.classList.add('down');
      card.classList.remove('thud'); void card.offsetWidth; card.classList.add('thud');
    });
    t += 420;
  };

  if (sheet.querySelector('.docket')) {
    sheet.querySelectorAll('.no b, .typed, .tick').forEach(type);
    t += 180; draw(sheet.querySelector('.pen path'), 520);
    t += 220; stampDown(sheet.querySelector('.stamp'), sheet.querySelector('.docket'));
  } else if (sheet.querySelector('.slip')) {
    sheet.querySelectorAll('.carbon').forEach(el => press(el, 280, 110));
    t += 260; draw(sheet.querySelector('.ring path'), 480);
  } else {
    sheet.querySelectorAll('.head b, .typed').forEach(type);
    t += 200; draw(sheet.querySelector('.crayon path'), 460);
  }
  const end = t + 200;
  return { end, seek: (T, live = false) => ev.forEach(f => f(T, live)) };
}

function run(root, host) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desk = root.querySelector('.desk'), stage = root.querySelector('.stage');
  const sheets = [...root.querySelectorAll('.sheet')];

  /* on the board every sheet is finished; opening one full size writes it again from the start */
  let zoom = null, writing = null, gen = 0;
  const write = (s, my) => new Promise(resolve => {
    const t0 = performance.now();
    const tick = now => {
      if (my !== gen) return resolve();
      /* a frame can carry a timestamp from just before the click */
      const T = Math.max(0, now - t0);
      s.seek(T, true);
      if (T < s.end) requestAnimationFrame(tick); else resolve();
    };
    requestAnimationFrame(tick);
  });
  const opened = el => {
    const s = lines[sheets.indexOf(el)];
    if (!s) return;
    if (zoom && zoom.isOpen(el)) {
      if (writing === el) return;
      writing = el;
      if (reduce.matches) { s.seek(Infinity); return; }
      const my = ++gen;
      s.seek(0);
      write(s, my).then(() => { if (my === gen) writing = null; });
    } else {
      if (writing === el) { gen++; writing = null; }
      s.seek(Infinity);
    }
  };
  zoom = zoomable(root, sheets, {
    after: opened,
    replay: el => { if (writing === el) { gen++; writing = null; } opened(el); },
    label: el => ['Repair ticket', 'Laundry slip', 'Tag, sharpening', 'Tag, alterations'][sheets.indexOf(el)],
  });

  /* lay the stack on the board and scale the board to the space it has */
  fitBoard(host, desk, stage, width => LAYOUTS[width < 620 ? 'narrow' : 'wide'], L => sheets.forEach((el, i) => {
    const [x, y, r, s] = L.at[i];
    el.style.setProperty('--x', x); el.style.setProperty('--y', y); el.style.setProperty('--r', r + 'deg'); el.style.setProperty('--s', s); el.style.setProperty('--z', i + 1);
  }));

  const lines = sheets.map(timeline);
  lines.forEach(s => s.seek(Infinity));
}

definePiece('claim-check', { style: STYLE, font: FONT, markup: MARKUP, hide: '.desk', faces: ['12px "Cutive Mono"', '400 10px Archivo', '500 10px Archivo', '600 10px Archivo'], run });

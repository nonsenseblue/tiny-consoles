/**
 * <pliocene-coast> · tiny-consoles
 * A torn paper collage of what the Galactic Railroad might have left in the ground: bone chips,
 * a sand of stars, a coal-sack hole with a piece of amber at its floor, a railway that winds out
 * from one point and breaks off. When it comes on screen everything moves together for a few
 * seconds and settles; touch the bone chips and they keep crumbling into powder that stays.
 *
 * Usage:
 *   <script type="module" src="components/pliocene-coast/src/pliocene-coast.js"></script>
 *   <pliocene-coast></pliocene-coast>
 *
 * Styles: pliocene-coast.css, next to this file (loaded automatically).
 * Design notes: ../DESIGN.md.
 * The paper layer is baked into assets/collage.webp; the parts that move live in assets/live.svg.
 * No outside dependencies; shares a little code with the other pieces in components/shared/. Respects prefers-reduced-motion.
 * Code: MIT · Visual design: CC BY 4.0 · nonsenseblue
 */

import { definePiece, onScreen } from '../../shared/piece.js';
import { zoomable } from '../../shared/zoom.js';
const STYLE = new URL('./pliocene-coast.css', import.meta.url).href + new URL(import.meta.url).search;
const COLLAGE = new URL('../assets/collage.webp', import.meta.url).href;
const LIVE = new URL('../assets/live.svg', import.meta.url).href;
const FONT = 'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500&display=swap';

const W = 1560, H = 820;
const INTRO = 8000;               // everything moves together this long, then settles
const CHIPS = [[520, 200, 44], [600, 268, 36], [668, 330, 30], [724, 384, 22], [762, 424, 14]];
const RINGS = { cx: 470, cy: 680, rx: 380, ry: 330 }; // the coal sack: powder settles on its rim
const FLOOR = 640;


/* shown beside the collage when it is opened full size; every line our own, nothing quoted */
const NOTES = {
  title: 'Nokto de la Galaksia Fervojo', meta: 'Night on the Galactic Railroad · Kenji Miyazawa · film by Gisaburō Sugii, 1985',
  lead: 'On the night of the star festival a boy who is teased at school finds himself on a train across the Milky Way, with the one friend he has. They ride through the whole night together. Only one of them comes back. The 1985 film writes everything on screen in Esperanto, the language Miyazawa loved, and so does the title here.',
  parts: [
    ['The coast', 'Halfway along the line they get off at a riverbank of crystal sand, where a professor is digging out the bones of an animal from more than a million years ago. Here that dig is the whole picture: chips of bone, strata, and the sand they lie in.'],
    ['The hole', 'Near the end of the journey there is a black hole in the sky that nothing comes back from. The big dark rings are that hole; at its floor is the one warm thing, a piece of amber, for the scorpion who wished its body could burn as a light for others.'],
    ['The railway', 'The line winds out from a single point and breaks off before it finishes, the way the journey does.'],
    ['The river and the feathers', 'Birds are caught along the river and come apart in your hand like sweets. A few feathers are falling; one has reached the water, and under the rings the river holds their broken reflection.'],
    ['How it moves', 'When it comes into view everything moves at once for a few seconds and then settles. Touch a bone chip and it crumbles into powder that stays where it falls. Replay puts it all back.'],
  ],
};

const MARKUP = `
<div class="board" part="board">
  <img class="bg" src="${COLLAGE}" alt="" draggable="false">
  <div class="live" aria-hidden="true"></div>
</div>`;

function run(root) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const board = root.querySelector('.board'), live = root.querySelector('.live');
  let replay = () => {};
  // the collage opens full size over the page; Replay plays the first eight seconds again
  zoomable(root, [board], { label: () => 'Pliocene Coast', replay: () => replay(), notes: () => NOTES, notesFont: '"EB Garamond", serif' });

  fetch(LIVE).then(r => r.text()).then(text => {
    live.innerHTML = text;
    start(live.querySelector('svg'));
  }).catch(() => {});

  function start(svg) {
    const NS = 'http://www.w3.org/2000/svg';
    const grow = svg.querySelector('.grow'), len = grow.getTotalLength();
    const amber = svg.querySelector('.amin'), sand = svg.querySelector('.sand-in'), powder = svg.querySelector('.powder');
    const chips = [...svg.querySelectorAll('.chip')].map((el, i) => {
      const [cx, cy, R] = CHIPS[i];
      el.style.transformBox = 'view-box'; el.style.transformOrigin = `${cx}px ${cy}px`;
      return { el, cx, cy, R, life: 1 };
    });
    grow.style.strokeDasharray = len;

    if (reduce) { grow.style.strokeDashoffset = 0; return; }
    grow.style.strokeDashoffset = len;

    let parts = [], heap = {};
    let t0 = null, last = 0, raf = 0, visible = false, px = -1e4, py = -1e4, ax = 0, ay = 0;

    const setChip = c => { c.el.style.transform = `scale(${(0.15 + 0.85 * c.life).toFixed(3)})`; c.el.style.opacity = c.life < 0.08 ? 0 : 1; };
    const spawn = (x, y) => {
      const el = document.createElementNS(NS, 'circle');
      el.setAttribute('r', (Math.random() * 1.1 + 0.35).toFixed(2));
      el.setAttribute('fill', '#e2dac9');
      el.setAttribute('opacity', (0.45 + Math.random() * 0.5).toFixed(2));
      powder.appendChild(el);
      parts.push({ el, x, y, vx: (Math.random() - 0.4) * 22, vy: Math.random() * 10, done: false });
    };
    const shed = (c, chance) => {
      if (Math.random() > chance) return;
      const a = Math.random() * Math.PI * 2;
      spawn(c.cx + Math.cos(a) * c.R * c.life * 0.9, c.cy + Math.sin(a) * c.R * c.life * 0.55);
    };
    const surface = bin => ground(bin * 3) - (heap[bin] || 0);
    const ground = x => {
      const u = (x - RINGS.cx) / RINGS.rx;
      return Math.abs(u) < 1 ? RINGS.cy - RINGS.ry * Math.sqrt(1 - u * u) - 2 : FLOOR;
    };

    function frame(now) {
      raf = 0;
      if (!visible) return;
      if (t0 === null) t0 = now;
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      const k = Math.min(1, Math.max(0, (now - t0) / INTRO));
      let busy = k < 1;

      // the railway winds out from its first point, once
      grow.style.strokeDashoffset = len * Math.pow(1 - k, 2.2);
      // the sand sinks a little
      sand.setAttribute('transform', `translate(0 ${(3 * (1 - Math.pow(1 - k, 2))).toFixed(2)})`);

      // amber: the light inside shifts a pixel or two, with the pointer or on its own during the intro
      let tx, ty;
      if (px > -1e3) { tx = Math.max(-1, Math.min(1, (px - 470) / 400)) * 2.2; ty = Math.max(-1, Math.min(1, (py - 630) / 300)) * 1.6; }
      else { tx = Math.sin(k * Math.PI) * 1.8; ty = -Math.sin(k * Math.PI) * 1.2; }
      ax += (tx - ax) * Math.min(1, dt * 2); ay += (ty - ay) * Math.min(1, dt * 2);
      amber.setAttribute('transform', `translate(${ax.toFixed(2)} ${ay.toFixed(2)})`);
      if (Math.abs(tx - ax) + Math.abs(ty - ay) > 0.02) busy = true;

      // during the intro the smallest chip crumbles by itself and the next one starts to
      if (k < 1) {
        const a = chips[4], b = chips[3];
        if (a.life > 0) { a.life = Math.max(0, Math.min(a.life, 1 - k * 1.15)); shed(a, 0.8); setChip(a); }
        if (b.life > 0.72) { b.life = Math.max(0.72, Math.min(b.life, 1 - k * 0.3)); shed(b, 0.25); setChip(b); }
      }
      // a chip under the pointer keeps wearing away
      for (const c of chips) {
        if (c.life <= 0 || Math.hypot(px - c.cx, py - c.cy) > c.R + 24) continue;
        c.life = Math.max(0, c.life - 0.32 * dt * (30 / c.R));
        shed(c, 0.9); shed(c, 0.9); setChip(c); busy = true;
      }
      // powder falls and stays where it lands
      for (const p of parts) {
        if (p.done) continue;
        busy = true;
        p.vy += 260 * dt; p.vx *= 0.985; p.x += p.vx * dt; p.y += p.vy * dt;
        const bin = Math.round(p.x / 3), floor = surface(bin);
        if (p.y >= floor) {
          // like sand, a grain on a steep heap rolls off to the lower side before it settles
          let best = bin;
          for (let j = -3; j <= 3; j++) if (j && surface(bin + j) - floor > 2.4 * Math.abs(j) && surface(bin + j) > surface(best)) best = bin + j;
          if (best !== bin) { p.x = best * 3; p.y = Math.min(p.y, surface(best) - 0.5); p.vy = 0; }
          else {
            p.y = floor; p.done = true;
            for (let j = -3; j <= 3; j++) heap[bin + j] = (heap[bin + j] || 0) + 0.45 * Math.exp(-j * j / 4);
          }
        }
        p.el.setAttribute('cx', p.x.toFixed(1)); p.el.setAttribute('cy', p.y.toFixed(1));
      }
      if (busy || px > -1e3) raf = requestAnimationFrame(frame); else last = 0;
    }
    const wake = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };
    // everything back to how it was before it came into view: chips whole, no powder, no railway yet
    replay = () => {
      for (const c of chips) { c.life = 1; setChip(c); }
      powder.replaceChildren(); parts = []; heap = {};
      grow.style.strokeDashoffset = len; ax = ay = 0;
      t0 = null; last = 0; wake();
    };

    board.addEventListener('pointermove', e => {
      const r = board.getBoundingClientRect();
      px = (e.clientX - r.left) * W / r.width; py = (e.clientY - r.top) * H / r.height;
      wake();
    });
    board.addEventListener('pointerleave', () => { px = py = -1e4; wake(); });
    onScreen(board, on => { visible = on; if (on) wake(); else last = 0; });
  }
}

definePiece('pliocene-coast', { style: STYLE, font: FONT, markup: MARKUP, hide: '.board', run });

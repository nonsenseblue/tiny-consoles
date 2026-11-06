/**
 * <pliocene-coast> · tiny-consoles
 * A torn paper collage of what the Galactic Railroad might have left in the ground: bone chips,
 * a sand of stars, a coal-sack hole with a piece of amber at its floor, a railway that winds out
 * from one point and breaks off. When it comes on screen everything moves together for a few
 * seconds and settles, the feathers drifting down onto the river; touch the bone chips and they crumble
 * into powder that slides into the river and dissolves in rings of water.
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
const RINGS = { cx: 470, cy: 680, rx: 380, ry: 330 }; // the coal sack: powder lands on its rim and slides off into the river
// where each feather comes to rest on the river, lying almost flat, and when it lets go (s) and how long it falls (s)
// the first, longest feather stays on its sheet; the other two fall
const DISC = { x: 1010, y: 520, r: 92 }; // the black and white rings: spun once when it comes into view, and again under the pointer
const DRIFT = [null, { x: 1150, y: 690, a: -0.1, at: 0.6, fall: 10.5 }, { x: 1395, y: 788, a: -0.05, at: 2.2, fall: 9.5 }];


/* shown beside the collage when it is opened full size; every line our own, nothing quoted */
const NOTES = {
  title: 'Nokto de la Galaksia Fervojo', meta: 'Night on the Galactic Railroad · Kenji Miyazawa · film by Gisaburō Sugii, 1985',
  lead: 'On the night of the star festival a boy who is teased at school finds himself on a train across the Milky Way, with the one friend he has. They ride through the whole night together. Only one of them comes back. The 1985 film writes everything on screen in Esperanto, the language Miyazawa loved, and so does the title here.',
  parts: [
    ['The coast', 'Halfway along the line they get off at a riverbank of crystal sand, where a professor is digging out the bones of an animal from more than a million years ago. Here that dig is the whole picture: chips of bone, strata, and the sand they lie in.'],
    ['The hole', 'Near the end of the journey there is a black hole in the sky that nothing comes back from. The big dark rings are that hole; at its floor is the one warm thing, a piece of amber, for the scorpion who wished its body could burn as a light for others.'],
    ['The railway', 'The line winds out from a single point and breaks off before it finishes, the way the journey does.'],
    ['The river and the feathers', 'Birds are caught along the river and come apart in your hand like sweets. A few feathers fall onto the water, and under the rings the river holds their broken reflection.'],
    ['How it moves', 'When it comes into view everything moves at once for a few seconds and then settles. The feathers let go one by one and drift down onto the river. Touch a bone chip and it crumbles; the powder slides off the rim into the river and is gone, in small rings of water. Replay puts it all back.'],
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
    const amber = svg.querySelector('.amin'), sand = svg.querySelector('.sand-in'), powder = svg.querySelector('.powder'), ripples = svg.querySelector('.ripples');
    const disc = svg.querySelector('.disc');
    let spin = 0, turn = 0;
    const feathers = [...svg.querySelectorAll('.feather')].filter((el, i) => DRIFT[i]).map(el => {
      const d = DRIFT[[...svg.querySelectorAll('.feather')].indexOf(el)];
      return { el, x: +el.dataset.x, y: +el.dataset.y, a: +el.dataset.a, dx: d.x, dy: d.y, da: d.a, at: d.at, fall: d.fall, landed: false };
    });
    const chips = [...svg.querySelectorAll('.chip')].map((el, i) => {
      const [cx, cy, R] = CHIPS[i];
      el.style.transformBox = 'view-box'; el.style.transformOrigin = `${cx}px ${cy}px`;
      return { el, cx, cy, R, life: 1 };
    });
    grow.style.strokeDasharray = len;

    if (reduce) { grow.style.strokeDashoffset = 0; return; }
    grow.style.strokeDashoffset = len;

    let parts = [], rings = [];
    let t0 = null, last = 0, raf = 0, visible = false, px = -1e4, py = -1e4, ax = 0, ay = 0;

    const setChip = c => { c.el.style.transform = `scale(${(0.15 + 0.85 * c.life).toFixed(3)})`; c.el.style.opacity = c.life < 0.08 ? 0 : 1; };
    const spawn = (x, y) => {
      const el = document.createElementNS(NS, 'circle');
      el.setAttribute('r', (Math.random() * 1.1 + 0.35).toFixed(2));
      el.setAttribute('fill', '#e2dac9');
      el.setAttribute('opacity', (0.45 + Math.random() * 0.5).toFixed(2));
      powder.appendChild(el);
      parts.push({ el, x, y, vx: (Math.random() - 0.4) * 22, vy: Math.random() * 10, on: false, wet: 0, op: +el.getAttribute('opacity') });
    };
    const shed = (c, chance) => {
      if (Math.random() > chance) return;
      const a = Math.random() * Math.PI * 2;
      spawn(c.cx + Math.cos(a) * c.R * c.life * 0.9, c.cy + Math.sin(a) * c.R * c.life * 0.55);
    };
    const inside = x => Math.abs((x - RINGS.cx) / RINGS.rx) < 0.985;
    const ground = x => { const u = (x - RINGS.cx) / RINGS.rx; return RINGS.cy - RINGS.ry * Math.sqrt(Math.max(0, 1 - u * u)) - 2; };
    // a ring of water spreading out from where something touched the river
    // a ring of water, drawn by hand: a few broken arcs of uneven weight that spread out and fade
    const RIPPLE_INK = '#1d2126', RIPPLE_STYLE = 'cut';
    const ripple = (x, y, size, count, life = 2.4, width = 1.3, gap = 0.45) => {
      if (rings.length > 24 && size < 60) return;
      for (let i = 0; i < count; i++) {
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('opacity', 0);
        // arcs on a unit circle, squashed later; each arc its own length, gaps between, a little wobble
        let a0 = Math.random() * Math.PI * 2;
        const end = a0 + Math.PI * 2;
        while (a0 < end - 0.3) {
          const a1 = Math.min(end, a0 + (RIPPLE_STYLE === 'cut' ? 0.35 + Math.random() * 0.9 : 0.12 + Math.random() * 0.22));
          const pts = [];
          for (let a = a0; a <= a1 + 1e-6; a += 0.06) {
            const w = 1 + (Math.random() - 0.5) * 0.04 + Math.sin(a * 5 + i) * 0.02;
            pts.push(`${(Math.cos(a) * w).toFixed(3)} ${(Math.sin(a) * w).toFixed(3)}`);
          }
          const seg = document.createElementNS(NS, 'path');
          seg.setAttribute('d', 'M' + pts.join(' L'));
          seg.setAttribute('fill', 'none');
          seg.setAttribute('stroke', RIPPLE_STYLE === 'cut' ? RIPPLE_INK : '#7f8c97');
          seg.setAttribute('stroke-linecap', 'round');
          seg.setAttribute('vector-effect', 'non-scaling-stroke');
          seg.setAttribute('stroke-width', (width * (RIPPLE_STYLE === 'cut' ? 1.3 : 2.2) * (0.6 + Math.random() * 0.8)).toFixed(2));
          g.appendChild(seg);
          a0 = a1 + 0.15 + Math.random() * (RIPPLE_STYLE === 'cut' ? 0.5 : 0.25);
        }
        ripples.appendChild(g);
        rings.push({ el: g, x, y, size, life, age: -i * gap });
      }
    };
    const placeFeather = (f, t) => {
      // a slow fall that eases in and out, swinging from side to side less and less, turning to lie on the water
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const sway = Math.sin(t * Math.PI * 3.2) * (1 - t);
      const x = f.x + (f.dx - f.x) * e + sway * 34, y = f.y + (f.dy - f.y) * e;
      const rot = (f.a + (f.da - f.a) * e + sway * 0.35) * 180 / Math.PI - f.a * 180 / Math.PI;
      f.el.setAttribute('transform', `translate(${(x - f.x).toFixed(1)} ${(y - f.y).toFixed(1)}) rotate(${rot.toFixed(2)} ${f.x} ${f.y})`);
    };

    function frame(now) {
      raf = 0;
      if (!visible) return;
      if (t0 === null) { t0 = now; spin = 110; }
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
      // powder falls onto the rim of the rings, slides down it into the river and dissolves there
      for (const p of parts) {
        busy = true;
        if (p.wet) {
          p.wet += dt; p.x += 6 * dt;
          p.el.setAttribute('opacity', (p.op * Math.max(0, 1 - p.wet / 1.4)).toFixed(2));
          if (p.wet > 1.4) { p.el.remove(); p.gone = true; continue; }
        } else if (p.on) {
          const dir = Math.sign(p.x - RINGS.cx) || 1;
          p.vx = Math.min(140, Math.abs(p.vx) + 90 * dt) * dir;
          p.x += p.vx * dt; p.y = ground(p.x);
          if (!inside(p.x)) { p.wet = 0.001; p.y = RINGS.cy + 4 + Math.random() * 8; if (Math.random() < 0.12) ripple(p.x, p.y, 16, 1); }
        } else {
          p.vy += 260 * dt; p.vx *= 0.985; p.x += p.vx * dt; p.y += p.vy * dt;
          if (inside(p.x) && p.y >= ground(p.x)) { p.on = true; p.y = ground(p.x); p.vx = 10; }
          else if (!inside(p.x) && p.y >= RINGS.cy + 4) { p.wet = 0.001; if (Math.random() < 0.12) ripple(p.x, p.y, 16, 1); }
        }
        p.el.setAttribute('cx', p.x.toFixed(1)); p.el.setAttribute('cy', p.y.toFixed(1));
      }
      if (parts.some(p => p.gone)) parts = parts.filter(p => !p.gone);
      // the feathers let go one after another and drift down onto the river
      const secs = (now - t0) / 1000;
      for (const f of feathers) {
        if (f.landed) continue;
        busy = true;
        const t = Math.min(1, Math.max(0, (secs - f.at) / f.fall));
        placeFeather(f, t);
        if (t >= 1) { f.landed = true; ripple(f.dx, f.dy + 4, 190, 4, 4.2, 1.9, 0.6); }
      }
      // the disc turns like a record let go: pushed while the pointer rests on it, slowing to a stop on its own
      if (Math.hypot(px - DISC.x, py - DISC.y) < DISC.r) spin = Math.min(130, spin + 150 * dt);
      spin *= Math.exp(-0.45 * dt);
      if (spin > 0.4) { turn = (turn + spin * dt) % 360; disc.setAttribute('transform', `rotate(${turn.toFixed(2)} ${DISC.x} ${DISC.y})`); busy = true; }
      else spin = 0;
      // rings of water spread and fade
      for (const r of rings) {
        r.age += dt;
        if (r.age < 0) { r.el.setAttribute('opacity', 0); continue; }
        const q = r.age / r.life, rx = 6 + r.size * (1 - Math.pow(1 - q, 2));
        r.el.setAttribute('transform', `translate(${r.x} ${r.y}) scale(${rx.toFixed(1)} ${(rx * 0.22).toFixed(1)})`);
        r.el.setAttribute('opacity', Math.max(0, Math.min(1, q * 8) * Math.pow(1 - q, 1.3)).toFixed(2));
        if (q >= 1) { r.el.remove(); r.gone = true; }
      }
      if (rings.length) { busy = true; rings = rings.filter(r => !r.gone); }
      if (busy || px > -1e3) raf = requestAnimationFrame(frame); else last = 0;
    }
    const wake = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };
    // everything back to how it was before it came into view: chips whole, no powder, no railway yet
    replay = () => {
      for (const c of chips) { c.life = 1; setChip(c); }
      powder.replaceChildren(); parts = []; ripples.replaceChildren(); rings = [];
      for (const f of feathers) { f.landed = false; f.el.removeAttribute('transform'); }
      grow.style.strokeDashoffset = len; ax = ay = 0; turn = 0; disc.removeAttribute('transform');
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

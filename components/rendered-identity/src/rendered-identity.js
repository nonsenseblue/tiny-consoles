/**
 * <rendered-identity> · tiny-consoles
 * A collage made for four papers on long conversations with a language model: rendered identity,
 * the alignment paradox, welfare without a subject, and research with no outside place to stand.
 * Five cards of different textures lie on the page: two sets of rings
 * whose interference shifts as they move apart, a blurred photograph of sky and leaves, the word
 * branching three ways from one point, contours of a memory before and after it was compacted,
 * and the same sky and leaves again as a halftone. On screen all four keep moving, slowly, together.
 *
 * Usage:
 *   <script type="module" src="components/rendered-identity/src/rendered-identity.js"></script>
 *   <rendered-identity></rendered-identity>
 *
 * Styles: rendered-identity.css, next to this file (loaded automatically).
 * Design notes: ../DESIGN.md.
 * No outside dependencies; shares a little code with the other pieces in components/shared/. Respects prefers-reduced-motion.
 * Code: MIT · Visual design: CC BY 4.0 · nonsenseblue
 */

import { definePiece, fitBoard, onScreen, seeded } from '../../shared/piece.js';
const STYLE = new URL('./rendered-identity.css', import.meta.url).href + new URL(import.meta.url).search;
const FONT = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,300&display=swap';
const FACES = ['400 12px "JetBrains Mono"', '500 12px "JetBrains Mono"', '300 28px Newsreader'];
const I = {
  photo: new URL('../assets/photo.webp', import.meta.url).href,
  pre: new URL('../assets/contours-pre.svg', import.meta.url).href,
  post: new URL('../assets/contours-post.svg', import.meta.url).href,
  water: new URL('../assets/water.webp', import.meta.url).href,
};
const NS = 'http://www.w3.org/2000/svg';
const WORD = 'renderedidentity';

/* the cards, each drawn at its own size (set in the stylesheet, since the full size view clears inline sizes); the layout only places them, and phones see the same layout smaller */
const SIZE = { photo: [330, 640], moire: [720, 420], chars: [300, 240], contours: [360, 260], dots: [400, 260] };
const LAYOUTS = {
  wide: { w: 1120, h: 730, at: { photo: [10, 20, 1], moire: [390, 10, 1], chars: [240, 80, 1], contours: [290, 430, 1], dots: [700, 460, 1] } },
};

const MARKUP = `<div class="board"><div class="stage">
<div class="card photo"><img src="${I.photo}" alt="" draggable="false"><div class="water" style="background-image:linear-gradient(rgba(8,28,20,0),rgba(8,28,20,.42)),url(${I.water})"></div><p class="line">The model is not the agent; the relation is the agent.</p><p class="small">Two operations, one infrastructure.</p></div>
<div class="card moire" aria-hidden="true"><svg viewBox="0 0 720 420"><g class="ra"></g><g class="rb"></g></svg></div>
<div class="card chars" aria-hidden="true"><pre></pre></div>
<div class="card contours" aria-hidden="true"><p>{compaction}<br>{agency: self → other}<br>{meaning: back-filled}</p><div class="map"><img class="pre" src="${I.pre}" alt="" draggable="false"><img class="post" src="${I.post}" alt="" draggable="false"></div></div>
<div class="card dots" aria-hidden="true"><svg viewBox="0 0 400 260"></svg></div>
</div></div>`;

/* ---------- two sets of rings ---------- */
const RB = [43, -34];                 /* how far the second set sits from the first when at rest */
function rings(g, cx, cy, base) {
  let d = '';
  for (let k = 4; k < 90; k++) {
    const r = k * 5.2, sw = 1.2 + 1.6 * (.5 + .5 * Math.sin(k * .45 + base * 1.3));
    let p = '';
    for (let i = 0; i <= 140; i++) {
      const a = 2 * Math.PI * i / 140, w = 2.2 * Math.sin(a * 3 + k * .31 + base) + 1.4 * Math.sin(a * 5 - k * .17);
      p += (i ? 'L' : 'M') + (cx + (r + w) * Math.cos(a)).toFixed(1) + ',' + (cy + (r + w) * Math.sin(a) * 1.05).toFixed(1);
    }
    d += `<path d="${p}" stroke-width="${sw.toFixed(2)}"/>`;
  }
  g.innerHTML = d;
}

/* ---------- the word, branching three ways from one point ---------- */
function branches(seed) {
  const r = seeded(seed), g = () => Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());
  return [0, 1, 2].map(k => {
    let x = .12, y = .9, a = -1.1 + k * .45; const pts = [];
    for (let i = 0; i < 60; i++) { a += g() * .05; x += Math.cos(a) * .016; y += Math.sin(a) * .016; pts.push([x, y]); }
    return pts;
  });
}
function wordShape(seed, letters) {
  const cols = 41, rows = 19, br = branches(7), r = seeded(seed), lines = [];
  for (let j = 0; j < rows; j++) {
    let s = '';
    for (let i = 0; i < cols; i++) {
      const u = i / cols, v = j / rows;
      let dmin = 9;
      for (const b of br) for (let q = 0; q < b.length; q += 3) dmin = Math.min(dmin, Math.hypot(u - b[q][0], (v - b[q][1]) * .8));
      const p = Math.exp(-((dmin / .05) ** 2));
      s += r() < p * 1.15 ? WORD[(i + j * 5 + letters) % WORD.length] : ' ';
    }
    lines.push(j % 7 ? s : `<b>${s}</b>`);
  }
  return lines.join('\n');
}

/* ---------- the halftone, baked: one letter per dot, 0 to z for its size ---------- */
const DOTS = '889acdedccaaaaabbccdeeffedba99abcdeeffffghhhhgee|889acdeedcaaaaabbbccdeffedba9aabcdefffffgghhggee|89aacdeedca999aabbbccdefedcbaaabcdefgggffggggfee|99abdeffdca999aaaabbcdefeeccbbabbceghhgfffffffee|bbbcefffedb9999aaaabcdffffedcbbabcfgihgfeeeeeeee|bccdefggfdba999aaabbdefgggfedcbabdfhiigfeddeeeef|ccdefghhfeca99aabbcdefhhhhgfdcbbcegiiigfdccdeeff|ccdegghhgecbaaabbcdefghhhhgfedccefhiihfeccccdeff|ccdeghhhgecbaaabcddeffgggggfedddfgijihfdbbbbcdef|ccdeggggfedcbabbcdeeeeeefffeeddefhijhgdcaaaabcdd|ccdeffffeedcbabbcdddddddeeeedddefghigfcb9999abcc|ccddeeeeedccbbbbccccbbbbcdddccccdeffeda988889abb|ccdddeddddccbbabbbcbbaabccccbbabccddcb98778899aa|ccddddddccbbbaaabbbbbbbbcccba99999aa9988788899aa|ccddeeeddcbbbaabbbcccccdddcb98778888888899999999|ddeeffffeddcccccddeeeeeffedca988888899abbccbbaaa|ddefghggffeeeeeffgghhhhiihfecbbaa99abcdefgfedcbb|ccefghhhgggffffghiiijjjkkjhfeddcbbabcdfghhggfecb|ddfghhhiiihhgfggijkkklmmmljihfffeeddfghhhhhggfdc|hhghiiijkjhhhghhijllklnoonlkjiggggghiiiiiijihgee|jihijjjkkigghiihhjllkloppomllkihgghiiijjjkkjihgf|jjjkllkkjjihilmlkkkkklnooollmnlkgghijjllmmmljjji|kkklmlkkkllkkmonmllkjkmnoomlnonlihijjlmnnnnlkjji|mmllkjjjmonmlmnnmllkjknopommnoomihklnoooopomljih|nnmljiijnpnlklonmlkklmpppomlmnomjhlnpqqqqqpnkihh|pponljknqpmkkmqqomkmoopqrrpponnnkjmppqsssrqojhhi|qqonmmortqonnosssronoooprrqsuronmlorqqrqoooomlmm|pommnoqstrqpnorsuuqoopoqrposvtppooprrqqpmmnoppqr|onnoqrrqqrrqnnnqsrrrpooqsqorvtrrrqpprsrpoppqsspq|oooqssrqqqrrpnmopopqpppsusprutsstsqqqrrpopqqsrnn|rqqqqqqrommoqpnpomnopqsvvtrstuutvvsrponlkloqtsnl';
function dots(svg) {
  const rows = DOTS.split('|'), step = 8.4;
  let s = '<rect width="400" height="260" fill="#f3f5f1"/>';
  rows.forEach((row, j) => [...row].forEach((c, i) => {
    const r = step * .56 * parseInt(c, 36) / 35;
    if (r > .35) s += `<circle cx="${(i * step + (j % 2 ? step / 2 : 0)).toFixed(1)}" cy="${(j * step).toFixed(1)}" r="${r.toFixed(2)}"/>`;
  }));
  svg.innerHTML = s;
}

function run(root) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const board = root.querySelector('.board'), stage = root.querySelector('.stage');
  const cards = Object.fromEntries(Object.keys(SIZE).map(k => [k, root.querySelector('.card.' + k)]));

  const ra = root.querySelector('.ra'), rb = root.querySelector('.rb');
  rings(ra, 720 * .62, 420 * .58, 0);
  rings(rb, 720 * .62, 420 * .58, 1);
  const pre = root.querySelector('.chars pre');
  pre.innerHTML = wordShape(5, 0);
  dots(root.querySelector('.dots svg'));

  fitBoard(board, board, stage, () => LAYOUTS.wide, L => {
    board.style.aspectRatio = `${L.w} / ${L.h}`;
    Object.entries(L.at).forEach(([k, [x, y, s]]) => {
      const c = cards[k]; c.style.left = x + 'px'; c.style.top = y + 'px'; c.style.setProperty('--s', s);
    });
  });

  /* all four keep moving together, slowly, while the piece is on screen:
     the second set of rings drifts round the first, the word is spelled again every few seconds,
     the new contours wipe in again, wind moves through the dots, and the water in the photograph keeps flowing toward you */
  const place = (x, y) => rb.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
  place(0, 0);
  const post = cards.contours.querySelector('.post'), dsvg = cards.dots.querySelector('svg'), water = cards.photo.querySelector('.water');
  const redraw = {
    contours: () => { post.classList.remove('in'); void post.offsetWidth; post.classList.add('in'); },
  };
  /* the dots: a slow wave of wind crosses the leaves on a slant, each dot swelling a little as it passes */
  const leaves = [...dsvg.querySelectorAll('circle')].map(c => ({ c, x: +c.getAttribute('cx'), y: +c.getAttribute('cy'), r: +c.getAttribute('r') }));
  const sway = t => {
    for (const d of leaves) {
      const w = Math.sin((d.x * .6 + d.y) * .022 - t * .9) * .6 + Math.sin((d.x - d.y * .4) * .013 + t * .5) * .4;
      d.c.setAttribute('r', (d.r * (.86 + .2 * w)).toFixed(2));
    }
  };
  const WORD_EVERY = 2.6, CONTOURS_EVERY = 8;
  let on = false, raf = 0, t = 0, last = 0, turn = 0, nextWord = WORD_EVERY, nextC = CONTOURS_EVERY, odd = false;
  const frame = now => {
    t += Math.min(.05, Math.max(0, (now - last) / 1000)); last = now;
    place(Math.cos(t * .23) * 30 + Math.sin(t * .11) * 12, Math.sin(t * .29) * 22);
    water.style.backgroundPosition = `0 0, 0 ${(t * 16 % 288).toFixed(1)}px`;
    if (t >= nextWord) { nextWord += WORD_EVERY; pre.innerHTML = wordShape(5, ++turn * 3); }
    if (t >= nextC) { nextC += CONTOURS_EVERY; redraw.contours(); }
    if ((odd = !odd)) sway(t);
    raf = requestAnimationFrame(frame);
  };
  const start = () => { if (on || reduce.matches) return; on = true; last = performance.now(); raf = requestAnimationFrame(frame); };
  const stop = () => { on = false; cancelAnimationFrame(raf); };
  onScreen(board, visible => (visible ? start() : stop()));
  reduce.addEventListener?.('change', () => (reduce.matches ? stop() : start()));
}

definePiece('rendered-identity', { style: STYLE, font: FONT, markup: MARKUP, hide: '.board', faces: FACES, run });

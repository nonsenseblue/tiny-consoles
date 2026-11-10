/**
 * <press-cuttings> · tiny-consoles
 * Four small piles of torn and cut paper, left on one desk on the last night of a town paper: the
 * newspaper office, the ferry, the bakery, a letter not sent. Each pile mixes papers of its own kind,
 * and each kind is torn or cut its own way. Open one full size and it squares itself up, so that the
 * last line of every slip, read down its edge, makes one sentence no single paper printed.
 *
 * Usage:
 *   <script type="module" src="components/press-cuttings/src/press-cuttings.js"></script>
 *   <press-cuttings></press-cuttings>
 *
 * Styles: press-cuttings.css, next to this file (loaded automatically).
 * Design notes: ../DESIGN.md.
 * No outside dependencies; shares a little code with the other pieces in components/shared/. Respects prefers-reduced-motion.
 * Code: MIT · Visual design: CC BY 4.0 · nonsenseblue
 */

import { zoomable } from '../../shared/zoom.js';
import { definePiece, fitBoard } from '../../shared/piece.js';
const STYLE = new URL('./press-cuttings.css', import.meta.url).href + new URL(import.meta.url).search;

const FONT = 'https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Jost:wght@500;700&family=Courier+Prime'
  + '&family=Bodoni+Moda:ital,wght@1,500&family=Barlow+Condensed:wght@500;600&family=Work+Sans:wght@400;500&family=Homemade+Apple&family=Reenie+Beanie'
  + '&family=Special+Elite&family=Stardos+Stencil:wght@400;700&family=La+Belle+Aurore&family=Cutive+Mono&display=swap';
const FACES = ['400 10px "Old Standard TT"', 'italic 400 10px "Old Standard TT"', '700 10px "Old Standard TT"', '500 10px Jost', '700 10px Jost',
  '10px "Courier Prime"', 'italic 500 10px "Bodoni Moda"', '500 10px "Barlow Condensed"', '600 10px "Barlow Condensed"', '400 10px "Work Sans"',
  '500 10px "Work Sans"', '10px "Homemade Apple"', '10px "Reenie Beanie"', '10px "Special Elite"', '400 10px "Stardos Stencil"',
  '700 10px "Stardos Stencil"', '10px "La Belle Aurore"', '10px "Cutive Mono"'];

/* ---------- how paper comes apart ---------- */

/* A tear is cut from the slip's own box: the box is shrunk, given a slow wobble, then a fine fray, and only what
   lies inside is kept. Around the new edge a rim shows the paler inside of the sheet; for most papers it shows only
   in places, broken up by a second, finer noise. */
const tear = (id, [f1, s1, k1], [f2, s2, k2], shrink, rim, rimSeed, core = '.97 .95 .9', gain = 3, broken = true) => {
  const [r, g, b] = core.split(' ');
  return `<filter id="${id}" x="-6%" y="-18%" width="112%" height="136%" color-interpolation-filters="sRGB">
    <feComponentTransfer in="SourceAlpha" result="sa"><feFuncA type="linear" slope="60"/></feComponentTransfer>
    <feMorphology in="sa" operator="erode" radius="${shrink}" result="e"/>
    <feTurbulence type="fractalNoise" baseFrequency="${f1}" numOctaves="2" seed="${s1}" result="w"/>
    <feDisplacementMap in="e" in2="w" scale="${k1}" xChannelSelector="R" yChannelSelector="G" result="a"/>
    <feTurbulence type="fractalNoise" baseFrequency="${f2}" numOctaves="2" seed="${s2}" result="f"/>
    <feDisplacementMap in="a" in2="f" scale="${k2}" xChannelSelector="R" yChannelSelector="G" result="T"/>
    <feComposite in="SourceGraphic" in2="T" operator="in" result="cut"/>
    <feMorphology in="T" operator="erode" radius="${rim}" result="inn"/><feComposite in="T" in2="inn" operator="out" result="ring"/>
    <feTurbulence type="fractalNoise" baseFrequency=".16" numOctaves="2" seed="${rimSeed}"/>
    <feColorMatrix values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} ${gain} 0 0 0 ${-.35 * gain}"/>
    <feComposite in2="ring" operator="in" result="${broken ? 'r0' : 'rim'}"/>
    ${broken ? `<feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="1" seed="${rimSeed + 3}"/>
    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2.6 0 0 0 -.7"/>
    <feComposite in="r0" operator="in" result="r1"/>
    <feComponentTransfer in="r1" result="rim"><feFuncA type="linear" slope=".8"/></feComponentTransfer>` : ''}
    <feMerge><feMergeNode in="cut"/><feMergeNode in="rim"/></feMerge>
  </filter>`;
};

/* print on paper: letterpress ink that spreads a little and misses in specks, worn typewriter ribbon, soft pencil */
const INKS = `
  <filter id="ink" x="-2%" y="-5%" width="104%" height="110%" color-interpolation-filters="sRGB">
    <feGaussianBlur stdDeviation=".28" result="s"/>
    <feComponentTransfer in="s" result="g"><feFuncA type="linear" slope="2.3" intercept="-.32"/></feComponentTransfer>
    <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7"/>
    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 -1.3" result="m"/>
    <feComposite in="g" in2="m" operator="in" result="p"/>
    <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="2"/>
    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.6 0 0 0 .1" result="u"/>
    <feComposite in="p" in2="u" operator="in"/>
  </filter>
  <filter id="ink2" x="-2%" y="-5%" width="104%" height="110%" color-interpolation-filters="sRGB">
    <feGaussianBlur stdDeviation=".22" result="s"/>
    <feComponentTransfer in="s" result="g"><feFuncA type="linear" slope="2.2" intercept="-.25"/></feComponentTransfer>
    <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7"/>
    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0 0 0 -1" result="m"/>
    <feComposite in="g" in2="m" operator="in"/>
  </filter>
  <filter id="fade" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".012 .5" numOctaves="2" seed="12"/>
    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.5 0 0 0 -.12" result="b"/>
    <feComposite in="SourceGraphic" in2="b" operator="in"/>
  </filter>
  <filter id="warp" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency=".012 .03" numOctaves="2" seed="5"/>
    <feDisplacementMap in="SourceGraphic" scale="46" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="pencil" x="-10%" y="-200%" width="120%" height="500%">
    <feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="2" seed="6" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale=".9" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency="1.6 .7" numOctaves="2" seed="21"/>
    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 4 0 0 0 -.8" result="m"/>
    <feComposite in="d" in2="m" operator="in"/>
  </filter>
  <filter id="pen" x="-2%" y="-5%" width="104%" height="110%">
    <feGaussianBlur stdDeviation=".18" result="s"/>
    <feComponentTransfer in="s"><feFuncA type="linear" slope="1.6"/></feComponentTransfer>
  </filter>
  <filter id="graphite" x="-2%" y="-5%" width="104%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="1.4 .9" numOctaves="2" seed="5"/>
    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3.2 0 0 0 -.6" result="m"/>
    <feComposite in="SourceGraphic" in2="m" operator="in"/>
  </filter>
  <filter id="rough" x="-2%" y="-5%" width="104%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="13"/>
    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 4 0 0 0 -1.3" result="m"/>
    <feComposite in="SourceGraphic" in2="m" operator="in" result="p"/>
    <feComponentTransfer in="p"><feFuncA type="linear" slope=".85"/></feComponentTransfer>
  </filter>
  <filter id="ribbon" x="-2%" y="-5%" width="104%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="19"/>
    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 0 0 0 -.5" result="m"/>
    <feComposite in="SourceGraphic" in2="m" operator="in"/>
  </filter>`;

const DEFS = `<svg class="defs" aria-hidden="true"><defs>
  ${/* newsprint, by hand */ tear('t1', ['.03 .06', 3, 7], ['.55', 11, 3.4], 3.2, .7, 8, '.97 .95 .9', 3, false)}
  ${tear('t3', ['.025 .08', 42, 6.5], ['.5', 27, 3.8], 3.2, .7, 14, '.97 .95 .9', 3, false)}
  ${/* a book page pulled along a ruler: a soft deckle */ tear('deckle', ['.018 .03', 23, 3.2], ['.28', 6, 2.2], 2.2, 1.5, 3, '.97 .95 .9', 6, false)}
  ${/* thick board: short and choppy, the core shows */ tear('ticket', ['.06 .09', 8, 5], ['.32', 4, 3.2], 3, 1.1, 9, '.95 .82 .73', 3.4)}
  ${/* heavy card ripped across in one go */ tear('postcard', ['.012 .02', 31, 14], ['.24', 12, 2.6], 4.5, 1.2, 20, '.96 .93 .86', 3.4)}
  ${/* along a fold: almost straight, a fine fuzz */ tear('fold', ['.004 .006', 2, 2], ['.9', 14, 1.6], 1.4, .55, 5, '.98 .99 .97', 4)}
  ${/* India paper: long pulled fibres */ tear('fibre', ['.03 .05', 44, 5], ['1.3 .35', 7, 6], 3.4, .5, 2, '.97 .95 .9', 2.4)}
  ${/* kraft: deep and ragged, the paler inside */ tear('kraft', ['.035 .05', 13, 9], ['1.1 .4', 3, 5], 4.5, 1.3, 7, '.86 .74 .56', 3.6)}
  ${/* bond: a quick, fairly even tear */ tear('bond', ['.02 .05', 25, 6], ['.6', 9, 2.4], 3, .7, 15, '.96 .94 .88', 2.6)}
  ${/* a crumpled bag: loose and wavy */ tear('bag', ['.025 .03', 37, 10], ['.45', 21, 3], 4.4, .9, 4, '.93 .88 .78', 2.8)}
  ${/* baking paper snaps: little angular steps, few fibres */ tear('snap', ['.05 .08', 2, 6], ['.14', 30, 3], 3, .5, 11, '.98 .98 .95', 1.6)}
  ${/* onion skin: thin and crisp */ tear('onion', ['.03 .07', 17, 5], ['.9', 6, 2.2], 3, .5, 12, '.9 .94 .97', 2)}
  ${/* music paper, along a fold */ tear('music', ['.012 .02', 26, 4], ['.3', 8, 2.6], 3, 1, 18, '.96 .93 .85', 3)}
  ${/* a cheap form, roughly */ tear('form', ['.04 .06', 33, 7], ['.55', 2, 3], 3.6, .7, 6, '.95 .92 .84', 2.6)}
  ${/* a gummed label lifted off */ tear('label', ['.05 .08', 41, 7], ['.7', 23, 3], 3.6, .6, 27, '.94 .9 .8', 2.6)}
  ${INKS}
</defs></svg>`;

/* ---------- what is printed on them ---------- */

const FILL = ['The decision was taken a little after nine, with the windows open and the river audible from the gallery.',
  'Nobody present could recall a vote on the matter, and the minute book, when found, was of no help.',
  'It is understood that the arrangement will stand until the spring, or until somebody objects in writing.',
  'A spokesman said the figures were roughly as expected and declined to say what had been expected.',
  'Those who remember the last occasion say it was colder, and that there were more chairs.',
  'Enquiries may be left at the office on Weir Lane, where they will be read with interest.'].join(' ').split(' ');
const lines = (from, n, words) => Array.from({ length: n }, (_, i) => `<div>${Array.from({ length: words }, (_, j) => FILL[(from + i * words + j) % FILL.length]).join(' ')}</div>`).join('');
/* a cutting from the paper keeps the line above it and a strip of the next column */
const news = (i, cls, html, tail, side, sw) => `<div class="print"><div class="main ${tail ? '' : 'notail'}" style="padding-${side === 'r' ? 'right' : 'left'}:${sw + 9}px">`
  + `${tail ? `<div class="tail">${lines(i * 7 + 3, 2, 16)}</div>` : ''}<div class="head ${cls}">${html}</div></div>`
  + `<div class="nb ${side}" style="width:${sw}px">${lines(i * 11, 16, 6)}</div></div>`;
const TIDES = [['Sa 8', '04 12', '16 40', '10 31', '22 58'], ['Su 9', '04 55', '17 21', '11 14', '23 40'], ['Mo 10', '05 39', '18 03', '11 58', '—'], ['Tu 11', '06 24', '18 47', '00 23', '12 44']];
const STAFF = (() => {
  const ln = y => `<line x1="0" x2="240" y1="${y}" y2="${y}" stroke="#262019" stroke-width=".4"/>`;
  const bar = x => `<line x1="${x}" x2="${x}" y1="3.4" y2="13.8" stroke="#262019" stroke-width=".5"/>`;
  const note = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="1.7" ry="1.2" transform="rotate(-20 ${x} ${y})" fill="#262019"/><line x1="${x + 1.5}" x2="${x + 1.5}" y1="${y}" y2="${(y - 7.5).toFixed(1)}" stroke="#262019" stroke-width=".45"/>`;
  return `<svg width="240" height="18" viewBox="0 0 240 18" aria-hidden="true">${[3.4, 6, 8.6, 11.2, 13.8].map(ln).join('')}${[80, 138, 208].map(bar).join('')}`
    + [[22, 9.6], [36, 8.3], [50, 7], [64, 8.3], [92, 10.9], [106, 9.6], [120, 8.3], [150, 7], [164, 5.7], [178, 7], [192, 8.3], [222, 9.6]].map(([x, y]) => note(x, y)).join('')
    + '<text x="228" y="17" font-family="Old Standard TT, serif" font-style="italic" font-weight="700" font-size="6">pp</text></svg>';
})();
const MAP = `<svg viewBox="0 0 228 30" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0 21 C 40 17, 70 25, 120 20 S 200 15, 252 19 L252 30 L0 30Z" fill="#e4d8a8"/>
  <path d="M0 0 L252 0 L252 6 C 200 9, 150 4, 100 7 S 30 9, 0 6Z" fill="#e4d8a8"/>
  <path d="M58 7 C 66 12, 70 15, 80 20" stroke="#22385a" stroke-width=".9" stroke-dasharray="2 2" fill="none"/>
  <text x="40" y="4.6" font-family="Work Sans, sans-serif" font-size="4" fill="#22385a" letter-spacing=".6">WEIR QUAY</text>
  <text x="72" y="27" font-family="Work Sans, sans-serif" font-size="4" fill="#22385a" letter-spacing=".6">MILL LANDING</text></svg>`;

/* Each pile: the slips from top to bottom, and the notes shown beside it full size.
   A slip is [kind, width, markup, pivot x, pivot y, tear, left sliver]. Scattered, every slip has swung round its
   own pivot; squared up, each is slid down until only its last line clears the one above. */
const TRY = ['Try', 'Read down the edges. Press Replay to scatter the pile and square it up again.'];
const PILES = [
  { seed: 7, top: -2.2, swing: 46, jitter: [4, 1.2], at: [150, 62],
    notes: { title: 'The Evening Ledger', meta: 'Weir Lane · the last edition',
      lead: 'The town paper prints for the last time tonight. Someone cut the end off everything on the desk: the front page, a magazine left in the office, a novel, a manual, the receipt for a late tea.',
      parts: [['The papers', 'Newsprint, torn by hand. Coated magazine stock, cut with scissors. A book page, browned at the edge. A handbook on green card, torn at its perforation. A till receipt gone yellow.'], TRY] },
    slips: [
      ['news', 268, news(0, 'big', 'After 112 years, the<br>presses stop tonight', 1, 'r', 20), .5, .12, 't1'],
      ['mag', 256, `<div class="print"><div class="col">${FILL.slice(0, 58).join(' ')}</div><div class="mh">A small town where<br>the clock tower stays lit</div></div>`, .42, .58],
      ['book', 250, '<div class="print"><div class="rh"><span>THE HOUSE ON WEIR LANE</span><span>211</span></div><div class="tx">and left the hall lamp burning, as before,<br>for nobody.</div></div>', .62, .2],
      ['man', 252, '<div class="print"><div class="hd">7 · CARE AND USE</div><div class="tx">This appliance is not intended for any use<br>in particular.</div></div>', .33, .62],
      ['news', 296, news(4, '', 'Divers inspect the old bridge<br>and the river', 1, 'l', 24), .56, .24, 't3', 24],
      ['rec', 168, '<div class="print"><div class="tx">THE BRIDGE TEA ROOM\n2 TEA             1.80\n1 TOAST            .60\nTOTAL             2.40\nWE CLOSE AT 9. THE FERRY<span class="last">GOES ON</span></div></div>', .45, .5],
    ] },
  { seed: 9, top: 2.4, swing: 50, jitter: [5, 1.4], at: [140, 70],
    notes: { title: 'The Last Ferry', meta: 'Weir Quay · 21.40',
      lead: 'The ferry across the Weir makes its last crossing of the night. Left in a coat pocket: the timetable, a ticket, a postcard never posted, the leaflet from the landing, a page of tides.',
      parts: [['The papers', 'A timetable card, cut straight with one corner still round. A thick ticket, torn so its pale core shows. A postcard, ripped across in one go. A leaflet torn along its fold. A page of tides on India paper, thin enough to read through.'], TRY] },
    slips: [
      ['tt', 214, `<div class="print"><div class="bar"><span>WEIR FERRY · WINTER SAILINGS</span><span>MON–SAT</span></div>
        <table><tr><td>18.40</td><td>to Mill Landing</td><td>18.55</td></tr><tr><td>20.10</td><td>to Mill Landing</td><td>20.25</td></tr></table>
        <div class="lastrow">Last crossing 21.40</div></div>`, .5, .3],
      ['tk', 200, `<div class="print"><div class="co"><span>WEIR FERRY CO.</span><b>Nº 04417</b></div>
        <div class="sm">SINGLE · ADULT · FORTY PENCE<br>Valid on the day of issue only,</div><div class="last">weather permitting</div></div>`, .4, .5, 'ticket'],
      ['pc', 262, `<div class="print"><div class="div"></div><div class="hd">POST CARD</div>
        <div class="hw">The light here is good and the tea<br>is always cold. Back on Friday.<br><span class="last">Wish you were</span></div></div>`, .6, .4, 'postcard'],
      ['lf', 228, `<div><div class="map">${MAP}</div><div class="tx">Tea room, mill and toilets are<br><b>on the other side</b></div></div><div class="crease"></div>`, .35, .55, 'fold'],
      ['al', 244, `<div class="print"><div class="hd"><span>TIDES · WEIR MOUTH</span><span>NOVEMBER</span></div>
        <table>${TIDES.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>
        <div class="nt">Heights are given in feet above the lowest level</div><div class="last">of the water.</div></div>`, .55, .35, 'fibre'],
    ] },
  { seed: 4, top: -2.6, swing: 50, jitter: [5, 1.4], at: [140, 70],
    notes: { title: 'Mill Street Bakery', meta: 'Mill Street · under new ownership',
      lead: 'The bakery has been sold, and the oven goes with it. From the back room: a recipe card in pencil, a flour sack, the notice from the door, a bag, a sheet of baking paper.',
      parts: [['The papers', 'A ruled index card, snipped off with scissors. Heavy kraft from a flour sack, torn deep. Thin bond paper, typed on a tired ribbon. A crumpled paper bag. Unbleached baking paper, which snaps rather than tears.'], TRY] },
    slips: [
      ['rc', 232, '<div class="print"><div class="ttl">Mrs Hale’s white loaf</div>1½ lb flour, salt, a little sugar, yeast<br>Knead well, cover with a cloth.<br>Leave overnight in a warm place.</div>', .5, .3],
      ['fs', 214, '<div class="print"><div class="mill">WEIR MILL</div><div class="sm">STRONG WHITE · 32 KG<br>STORE COOL AND DRY</div><div class="last">BEST BEFORE</div></div>', .4, .5, 'kraft'],
      ['nt', 246, '<div class="print">To our customers,<br>Mill Street Bakery is under new<br>ownership from<br><span class="last">the end of the month.</span></div>', .6, .4, 'bond'],
      ['bg', 220, '<div class="print"><div class="nm">MILL STREET BAKERY</div><div class="sm">baked here since 1911</div><div class="last">thank you</div></div>', .35, .55, 'bag'],
      ['gp', 230, '<div class="print"><div class="sm">FRESH EVERY MORNING · PLEASE</div><div class="last">come again</div></div>', .55, .35, 'snap'],
    ] },
  { seed: 6, top: -2.6, swing: 50, jitter: [5, 1.4], at: [140, 70],
    notes: { title: 'A Letter Not Sent', meta: 'Weir Lane · the fourteenth',
      lead: 'Someone is leaving on the fourteenth. In the envelope, never sealed: a library label, a page of airmail, a scrap of a score, a telegram and one more strip of its tape.',
      parts: [['The papers', 'The date label from the back of a library book. Airmail paper gone grey, folded in three. A torn bit of printed score. A telegram form with its strip pasted on. One more cut of the same strip.'], TRY] },
    slips: [
      ['lb', 212, '<div class="print"><div class="sm">be charged for each week or part of a week overdue.<br>Books must not be lent to another reader.</div><div class="last">Please return by</div><div class="stamp">23 OCT</div></div>', .5, .3, 'label'],
      ['am', 236, '<div class="print"><div class="cut">and the trunk went on ahead. They say the boat is qu</div><div class="cut">small, but steady, and the Mary Hale sails on</div><span class="last">the fourteenth.</span></div><div class="crease" style="top:18px"></div>', .4, .5, 'onion'],
      ['ms', 220, `<div class="print">${STAFF}<div class="last">slowly, and a little quieter</div></div>`, .6, .4, 'music'],
      ['tg', 226, '<div class="print"><div class="fm">ED IN AT WEIR QUAY 21.10 &nbsp; RECEIVED 21.32 &nbsp; WORDS 9</div><span class="tape">I WILL WRITE WHEN I ARRIVE</span></div>', .35, .55, 'form'],
      ['st', 78, '<div class="print">VE &nbsp;STOP</div>', .55, .45],
    ] },
];

/* a small repeatable random, the one the piles were first laid out with */
const mulberry = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

const BOX = { w: 380, h: 280 };   /* every pile sits in a box this size, in its own units */
const LINE = 29;                  /* how much of each slip shows below the one above, squared up */

const MARKUP = `${DEFS}<div class="desk" part="desk"><div class="stage">${PILES.map((p, i) => `<section class="pile p${i + 1}" aria-label="${p.notes.title}"><div class="in">${
  p.slips.map(([kind, w, html, , , t], j) => `<div class="slip ${kind}" style="width:${w}px;z-index:${10 - j}${t ? `;filter:url(#${t}) drop-shadow(0 .5px .6px rgba(40,30,10,.3))` : ''}"><div class="sheet">${html}</div></div>`).join('')
}</div></section>`).join('')}</div></div>`;

/* where the piles lie on the desk, two by two: centre, rotation, scale */
const LAYOUTS = {
  wide:   { w: 1000, h: 600, at: [[290, 170, 2, .96], [710, 170, -2.5, .96], [290, 430, -1.5, .96], [710, 430, 2.5, .96]] },
  narrow: { w: 760,  h: 620, at: [[192, 158, 4, .98], [568, 168, -6, .98], [196, 462, 3, .98], [566, 452, -8, .98]] },
};

/* ---------- laying out a pile ---------- */

/* the receipt's two ends are the saw of the tear bar; the receipt carries one stroke of blue pencil */
function finishReceipt(slip) {
  const sheet = slip.firstChild, w = sheet.offsetWidth, h = sheet.offsetHeight + 9, saw = mulberry(5), st = 3.4, pts = [];
  sheet.style.height = h + 'px';
  for (let k = 0, x = 0; x <= w + st; k++, x += st) pts.push(`${Math.min(x, w).toFixed(1)}px ${(k % 2 ? 0 : 2.6 + saw() * 1.2).toFixed(1)}px`);
  for (let k = 0, x = w; x >= -st; k++, x -= st) pts.push(`${Math.max(x, 0).toFixed(1)}px ${(h - (k % 2 ? 0 : 2.6 + saw() * 1.2)).toFixed(1)}px`);
  sheet.style.clipPath = `polygon(${pts.join(',')})`;
  /* pressed at once, thinning as the hand lifts off, a little past the words */
  const L = 52, up = [], dn = [];
  for (let k = 0; k <= 40; k++) {
    const t = k / 40, x = 1 + t * (L - 2);
    const y = 6.2 - 1.6 * t - 1.4 * t * t * t + Math.sin(t * 7.3) * .18;
    const half = (.45 + 2.5 * Math.min(1, t * 9) * Math.pow(1 - t, .5)) / 2;
    up.push(`${x.toFixed(2)},${(y - half).toFixed(2)}`); dn.unshift(`${x.toFixed(2)},${(y + half).toFixed(2)}`);
  }
  slip.insertAdjacentHTML('beforeend', `<svg class="bp" width="${L}" height="10" viewBox="0 0 ${L} 10" aria-hidden="true"><defs><linearGradient id="press"><stop offset="0" stop-color="#2d58b4"/><stop offset=".6" stop-color="#2d58b4" stop-opacity=".9"/><stop offset="1" stop-color="#2d58b4" stop-opacity=".45"/></linearGradient></defs><polygon filter="url(#pencil)" fill="url(#press)" points="${up.concat(dn).join(' ')}"/></svg>`);
}

/* both arrangements of one pile, as a transform per slip, centred in the pile's box */
function arrange(pile, spec) {
  const els = [...pile.querySelectorAll('.slip')];
  const size = els.map(el => [el.offsetWidth, el.offsetHeight]);
  const pivot = spec.slips.map(([, , , hx, hy], i) => [hx * size[i][0], hy * size[i][1]]);
  els.forEach((el, i) => { el.style.transformOrigin = `${pivot[i][0]}px ${pivot[i][1]}px`; });

  const loose = mulberry(spec.seed), tidy = mulberry(12);
  const scattered = els.map((_, i) => [spec.at[0] - pivot[i][0], spec.at[1] - pivot[i][1], i ? (loose() - .5) * spec.swing : spec.top]);
  let bottom = 0;
  const squared = els.map((_, i) => {
    const h = size[i][1], t = i === 0 ? 0 : bottom + LINE - h; bottom = t + h;
    return [-(spec.slips[i][6] || 0) + (tidy() - .5) * spec.jitter[0], t, (tidy() - .5) * spec.jitter[1]];
  });
  /* centre each arrangement: the corners of every slip, turned about its pivot */
  const centre = pos => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    pos.forEach(([x, y, a], i) => {
      const [w, h] = size[i], [px, py] = pivot[i], c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
      for (const [u, v] of [[0, 0], [w, 0], [0, h], [w, h]]) {
        const X = x + px + (u - px) * c - (v - py) * s, Y = y + py + (u - px) * s + (v - py) * c;
        x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y);
      }
    });
    const dx = (BOX.w - (x0 + x1)) / 2, dy = (BOX.h - (y0 + y1)) / 2;
    return pos.map(([x, y, a]) => [x + dx, y + dy, a]);
  };
  return { els, scattered: centre(scattered), squared: centre(squared) };
}
/* a slip's place part of the way from scattered (0) to squared up (1) */
const between = ([x0, y0, a0], [x1, y1, a1], k) => `translate(${(x0 + (x1 - x0) * k).toFixed(1)}px, ${(y0 + (y1 - y0) * k).toFixed(1)}px) rotate(${(a0 + (a1 - a0) * k).toFixed(2)}deg)`;

/* ---------- running ---------- */

const MS = 900, STEP = 110;   /* one slip's slide, and the gap before the next starts */

function run(root, host) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desk = root.querySelector('.desk'), stage = root.querySelector('.stage');
  const piles = [...root.querySelectorAll('.pile')];
  finishReceipt(piles[0].querySelector('.rec'));
  const plans = piles.map((el, i) => arrange(el, PILES[i]));

  /* set a pile part of the way from scattered (0) to squared up (1), at once or sliding slip by slip
     from the bottom of the pile up */
  const set = (i, k, slide, ms = MS, step = STEP) => {
    const { els, scattered, squared } = plans[i], n = els.length;
    piles[i].classList.toggle('tidy', k === 1);
    els.forEach((el, j) => {
      el.style.transition = slide ? `transform ${ms}ms cubic-bezier(.3,.7,.2,1) ${(n - 1 - j) * step}ms` : 'none';
      el.style.transform = between(scattered[j], squared[j], k);
    });
  };
  const scatter = i => set(i, 0, false);
  /* from wherever the pile is now, or from scattered when it is played again */
  const squareUp = (i, again = false) => {
    if (reduce.matches) return set(i, 1, false);
    if (!again) return set(i, 1, true);
    scatter(i);
    void piles[i].offsetWidth;
    requestAnimationFrame(() => set(i, 1, true));
  };

  let zoom = null;
  const shown = new Set();
  const opened = el => {
    const i = piles.indexOf(el);
    if (zoom && zoom.isOpen(el)) { if (!shown.has(i)) { shown.add(i); squareUp(i); } }
    else { shown.delete(i); scatter(i); }
  };
  zoom = zoomable(root, piles, {
    after: opened,
    replay: el => squareUp(piles.indexOf(el), true),
    label: el => el.getAttribute('aria-label'),
    notes: el => PILES[piles.indexOf(el)].notes,
    notesFont: '"Old Standard TT", serif',
    /* opened on a wide screen, a pile stays about the size of the notes beside it; on a phone it takes the width */
    most: () => (innerWidth <= 720 ? Infinity : Math.min(innerWidth * .29 / 300, innerHeight * .46 / 240)),
  });

  /* two by two either way; the taller narrow desk only on a phone, so a plate on a short laptop screen still fits */
  fitBoard(host, desk, stage, width => LAYOUTS[width < 400 ? 'narrow' : 'wide'], L => piles.forEach((el, i) => {
    const [x, y, r, s] = L.at[i];
    el.style.setProperty('--x', x); el.style.setProperty('--y', y); el.style.setProperty('--r', r + 'deg'); el.style.setProperty('--s', s);
  }));
  piles.forEach((_, i) => scatter(i));

  /* on the desk, a pile under the cursor squares itself up, and falls loose again when the cursor leaves */
  const canHover = matchMedia('(hover: hover)');
  piles.forEach((el, i) => {
    el.addEventListener('pointerenter', e => {
      if (e.pointerType === 'touch' || !canHover.matches || reduce.matches || (zoom && zoom.isOpen(el))) return;
      set(i, 1, true, 700, 70);
    });
    el.addEventListener('pointerleave', () => {
      if (reduce.matches || (zoom && zoom.isOpen(el))) return;
      set(i, 0, true, 650, 40);
    });
  });
}

definePiece('press-cuttings', { style: STYLE, font: FONT, markup: MARKUP, hide: '.desk', faces: FACES, run });

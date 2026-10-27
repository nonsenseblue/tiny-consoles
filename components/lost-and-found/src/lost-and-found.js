/**
 * <lost-and-found> · tiny-consoles
 * Four sheets from the register of an imagined lost property office, left on a desk:
 * the index, one file, the ledger and a claim slip. One sheet at a time comes to the top,
 * what was written into it types itself in, the highlighter goes across, and the stamp comes down.
 *
 * Usage:
 *   <script type="module" src="components/lost-and-found/src/lost-and-found.js"></script>
 *   <lost-and-found></lost-and-found>
 *
 * Styles: lost-and-found.css, next to this file (loaded automatically).
 * Design notes: ../DESIGN.md.
 * No dependencies. Respects prefers-reduced-motion.
 * Code: MIT · Visual design: CC BY 4.0 · nonsenseblue
 */

const STYLE = new URL('./lost-and-found.css', import.meta.url).href + new URL(import.meta.url).search;
const FONT = 'https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Inter:wght@500&display=swap';

const MARKUP = `<div class="desk" part="desk"><div class="stage">
<section class="sheet"><div class="card folder" data-pal="vermilion">
  <div class="holes"><b></b><b></b><b></b></div>
  <div class="tabs fold stock"><span class="on">INDEX</span><span>FILE</span><span>LEDGER</span><span>RELEASED</span></div>
  <div class="top"><span class="lab">Office of things left behind / Index of files</span><span class="lab">Series 26 &nbsp; / &nbsp; P. 01 / 12</span></div>
  <div class="head"><svg class="dots" data-text="INDEX" data-r="2.5" data-gap="1.6"></svg>
    <div class="sub"><span class="lab">Files</span><span class="v">08 of 31</span></div>
    <div class="sub right"><span class="lab">Updated</span><span class="v">27.10.2026 09:40</span></div></div>
  <div class="filters"><span class="on">ALL 31</span><span>TEXTILE 09</span><span>PAPER 07</span><span>METAL 06</span><span>SOUND 02</span><span>OTHER 07</span></div>
  <table class="idx"><thead><tr><th>NO.</th><th>FIG.</th><th>ITEM / NOTE</th><th>FOUND</th><th style="text-align:right;padding-right:0">STATUS</th></tr></thead><tbody class="rows"></tbody></table>
  <p class="fine">INDEX IS REWRITTEN EACH MORNING. A RELEASED FILE STAYS IN THE INDEX FOR SEVEN DAYS, MARKED, THEN MOVES TO THE BACK OF THE BOOK.</p>
  <div class="foot"><span class="lab">Tiny consoles / 05</span><span class="lab">Search [/] &nbsp; Ledger &nbsp; Return</span></div>
</div></section>
<section class="sheet"><div class="card folder" data-pal="indigo">
    <div class="holes"><b></b><b></b><b></b></div>
    <div class="tabs fold stock"><span>INDEX</span><span class="on">FILE</span><span>LEDGER</span><span>RELEASED</span></div>
    <div class="top"><span class="lab">Office of things left behind / Register of found property</span><span class="lab">File 0417-B-2610 &nbsp; / &nbsp; P. 04 / 12</span></div>
    <div class="head"><svg class="dots" data-text="0417" data-r="2.5"></svg>
      <div class="sub"><span class="lab">Number</span><svg class="dots" data-text="BRASS KEY" data-r="1.15" data-gap="1.6"></svg></div>
      <div class="sub right"><span class="lab">Received</span><span class="v">26.10.2026 18:52</span></div></div>
    <div class="form">
      <div><span class="lab">Category</span><span class="v">Keys</span></div>
      <div><span class="lab">Colour</span><span class="v">Brass, dull</span></div>
      <div><span class="lab">Material</span><span class="v">Metal</span></div>
      <div class="photo"><span class="lab">Fig. 1 / actual size</span><canvas data-kind="key" width="112" height="84"></canvas></div>
      <div><span class="lab">Found</span><span class="v">2026.10.26</span></div>
      <div><span class="lab">Time</span><span class="v">approx. 18:40</span></div>
      <div><span class="lab">Where</span><span class="v">Bench, east gate</span></div>
      <div><span class="lab">Length</span><span class="v">58 mm</span></div>
      <div><span class="lab">Weight</span><span class="v">9 g</span></div>
      <div><span class="lab">Condition</span><span class="v">Worn smooth</span></div>
      <div><span class="lab">Received by</span><span class="v">Counter 2</span></div>
      <div><span class="lab">Drawer</span><span class="v">B / 14</span></div>
      <div><span class="lab">Held until</span><span class="v">2027.01.24</span></div>
      <div><span class="lab">Status</span><span class="v">Unclaimed</span></div>
      <div class="s3 xx"><span class="lab">Filed under</span><div class="chips"><span>METAL</span><span>SMALL</span><span>STATION</span><span>EAST GATE</span></div></div>
      <div class="s4"><span class="lab">Remarks</span><span class="v">Left on the bench by the ticket gate. <mark>Nothing on the ring to say whose.</mark> Still warm when it came in.</span></div>
    </div>
    <div class="sec"><span class="lab">Movements</span><span class="lab">3 entries</span></div>
    <table class="log">
      <tr><td>2026.10.26</td><td>18:52</td><td>Received at the counter</td><td>C2</td></tr>
      <tr><td>2026.10.26</td><td>19:05</td><td>Filed, drawer B / 14</td><td>C2</td></tr>
      <tr><td>2026.11.02</td><td>10:20</td><td>Checked, no enquiry</td><td>A1</td></tr>
      <tr><td>----.--.--</td><td>--:--</td><td>Claimed</td><td></td></tr>
    </table>
    <div class="sec"><span class="lab">Cross reference</span><span class="lab">Same bench</span></div>
    <div class="xref"><span>0398 glove, left</span><span>0402 ticket stub</span><span class="on">0417 key</span><span>0431 scarf</span></div>
    <div class="sec"><span class="lab">Enquiries</span><span class="lab">1 of 1</span></div>
    <table class="log">
      <tr><td>2026.10.29</td><td>Tel.</td><td>Silver key, two teeth, red tag</td><td>No</td></tr>
      <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
      <tr><td>&nbsp;</td><td></td><td></td><td></td></tr>
    </table>
    <div class="sign"><div><span class="lab">Received</span><i>C2</i></div><div><span class="lab">Filed</span><i>C2</i></div><div><span class="lab">Released</span><i></i></div></div>
    <div class="stamp"><span class="big">UNCLAIMED</span><span class="small">26 · OCT · 2026</span></div>
    <p class="fine">REGISTER OF THINGS LEFT BEHIND / SERIES 26 / FORM LP-4. KEPT NINETY DAYS, THEN RELEASED. ENTRIES ARE NOT ALTERED, ONLY ADDED TO.<br>THIS SHEET CONTINUES IN THE LEDGER. NO DUPLICATE.</p>
    <div class="foot"><span class="lab">Tiny consoles / 05</span><span class="lab">Search [/] &nbsp; Ledger &nbsp; Return</span></div>
  
</div></section>
<section class="sheet"><div class="card folder" data-pal="yellow">
  <div class="holes"><b></b><b></b><b></b></div>
  <div class="tabs fold stock"><span>INDEX</span><span>FILE</span><span class="on">LEDGER</span><span>RELEASED</span></div>
  <div class="top"><span class="lab">Office of things left behind / Ledger, book 3</span><span class="lab">October 2026 &nbsp; / &nbsp; P. 07 / 12</span></div>
  <div class="head"><svg class="dots" data-text="LEDGER" data-r="2.5" data-gap="1.6"></svg>
    <div class="sub"><span class="lab">Written by</span><span class="v">Counter 1, 2</span></div>
    <div class="sub right"><span class="lab">Page</span><span class="v">41 / 120</span></div></div>
  <table class="book"><thead><tr><th>TIME</th><th>NO.</th><th>ITEM</th><th>WHERE</th><th>DRAWER</th><th>BY</th><th>OUT</th></tr></thead><tbody class="bookrows"></tbody></table>
  <div class="tally">
    <div><span class="lab">In this month</span><span class="v">31</span></div>
    <div><span class="lab">Released</span><span class="v">09</span></div>
    <div><span class="lab">Held</span><span class="v">22</span></div>
    <div><span class="lab">Oldest held</span><span class="v">0352</span></div>
  </div>
  <div class="stamp" style="right:40px;bottom:46px;transform:rotate(6deg)"><span class="big">CHECKED</span><span class="small">27 · OCT · 2026</span></div>
  <p class="fine">LEDGER ENTRIES ARE NEVER ERASED. A MISTAKE IS STRUCK THROUGH ONCE AND WRITTEN AGAIN BELOW.</p>
  <div class="foot"><span class="lab">Tiny consoles / 05</span><span class="lab">Search [/] &nbsp; Index &nbsp; Return</span></div>
</div></section>
<section class="sheet"><div class="card folder" data-pal="navy">
  <div class="holes"><b></b><b></b><b></b></div>
  <div class="tabs fold stock"><span>INDEX</span><span>FILE</span><span>LEDGER</span><span class="on">RELEASED</span></div>
  <div class="top"><span class="lab">Office of things left behind / Released</span><span class="lab">Series 26 &nbsp; / &nbsp; P. 11 / 12</span></div>
  <div class="head"><svg class="dots" data-text="RELEASED" data-r="2.5" data-gap="1.6"></svg>
    <div class="sub right"><span class="lab">This month</span><span class="v">09 returned</span></div></div>
  <div class="rel">
    <div class="row"><span>0431</span><span>Scarf, wool, grey</span><span style="text-align:right">27.10 14:10</span></div>
    <div class="row"><span>0402</span><span>Ticket stub, platform 3</span><span style="text-align:right">24.10 08:02</span></div>
    <div class="row"><span>0388</span><span>Reading glasses, case</span><span style="text-align:right">19.10 17:45</span></div>
    <div class="row"><span>0379</span><span>Child's drawing, folded</span><span style="text-align:right">15.10 11:30</span></div>
    <div class="row"><span>0366</span><span>Thermos, half full</span><span style="text-align:right">09.10 07:58</span></div>
  </div>
  <div class="slip"><span class="tape l"></span>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid var(--ink);padding-bottom:6px">
      <svg class="dots" data-text="0431" data-r="2.3"></svg>
      <span class="lab" style="text-align:right">Claim slip<br><br>Copy for owner</span></div>
    <div class="ln" style="margin-top:6px"><span>Item</span><span>Scarf, wool, grey</span></div>
    <div class="ln"><span>Found</span><span>2026.10.25, east gate</span></div>
    <div class="ln"><span>Described as</span><span>Long, grey, a small burn near one end</span></div>
    <div class="ln"><span>Matches</span><span>Yes, all three</span></div>
    <div class="ln"><span>Released</span><span>2026.10.27 14:10</span></div>
    <div class="ln"><span>Released by</span><span>Counter 2</span></div>
    <div class="sig"><div><svg width="100" height="18"><path d="M2 14 C10 2, 16 2, 18 12 S 28 16, 34 6 S 48 4, 50 12 S 62 14, 70 8 S 86 6, 96 10" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></div><span class="lab">Received, with thanks</span></div>
    <div class="perf"></div>
    <div style="display:flex;justify-content:space-between"><span class="lab">Keep this slip</span><span class="lab">LP-7 / 0431</span></div>
    <div class="stamp" style="--stamp:#ff5a36"><span class="big">RELEASED</span><span class="small">27 · OCT · 2026</span></div>
  </div>
  <p class="fine">A THING IS RELEASED ONLY TO SOMEONE WHO CAN DESCRIBE IT. NO PROOF OF NAME IS ASKED FOR, OR KEPT.</p>
  <div class="foot"><span class="lab">Tiny consoles / 05</span><span class="lab">Search [/] &nbsp; Index &nbsp; Return</span></div>
</div></section>
</div></div>`;

/* where each sheet lies: design units, rotation in degrees. Wide desks spread them in a row, narrow ones in two rows */
const LAYOUTS = {
  wide:   { w: 2140, h: 880,  at: [[24, 46, -2.4], [532, 14, 1.1], [1040, 60, -1], [1548, 30, 2]] },
  narrow: { w: 1180, h: 1680, at: [[24, 40, -2], [600, 80, 1.6], [40, 880, 1.2], [596, 860, -1.8]] },
};

const CHAR = 26, GAP = 70;   /* ms per character, ms between one entry and the next */
const HOLD = 1400;           /* ms between one sheet and the next */
const REST = 14000;          /* ms the finished desk stays before it is written again */

/* our own 5x7 dot font */
const F = {
'0':['01110','10001','10011','10101','11001','10001','01110'],'1':['00100','01100','00100','00100','00100','00100','01110'],
'2':['01110','10001','00001','00010','00100','01000','11111'],'3':['11110','00001','00001','01110','00001','00001','11110'],
'4':['00010','00110','01010','10010','11111','00010','00010'],'5':['11111','10000','11110','00001','00001','10001','01110'],
'6':['00110','01000','10000','11110','10001','10001','01110'],'7':['11111','00001','00010','00100','01000','01000','01000'],
'8':['01110','10001','10001','01110','10001','10001','01110'],'9':['01110','10001','10001','01111','00001','00010','01100'],
A:['01110','10001','10001','11111','10001','10001','10001'],B:['11110','10001','10001','11110','10001','10001','11110'],
C:['01110','10001','10000','10000','10000','10001','01110'],D:['11100','10010','10001','10001','10001','10010','11100'],
E:['11111','10000','10000','11110','10000','10000','11111'],F:['11111','10000','10000','11110','10000','10000','10000'],
G:['01110','10001','10000','10111','10001','10001','01111'],H:['10001','10001','10001','11111','10001','10001','10001'],
I:['01110','00100','00100','00100','00100','00100','01110'],J:['00111','00010','00010','00010','00010','10010','01100'],
K:['10001','10010','10100','11000','10100','10010','10001'],L:['10000','10000','10000','10000','10000','10000','11111'],
M:['10001','11011','10101','10101','10001','10001','10001'],N:['10001','10001','11001','10101','10011','10001','10001'],
O:['01110','10001','10001','10001','10001','10001','01110'],P:['11110','10001','10001','11110','10000','10000','10000'],
Q:['01110','10001','10001','10001','10101','10010','01101'],R:['11110','10001','10001','11110','10100','10010','10001'],
S:['01111','10000','10000','01110','00001','00001','11110'],T:['11111','00100','00100','00100','00100','00100','00100'],
U:['10001','10001','10001','10001','10001','10001','01110'],V:['10001','10001','10001','10001','10001','01010','00100'],
W:['10001','10001','10001','10101','10101','10101','01010'],X:['10001','10001','01010','00100','01010','10001','10001'],
Y:['10001','10001','01010','00100','00100','00100','00100'],Z:['11111','00001','00010','00100','01000','10000','11111'],
' ':['00000','00000','00000','00000','00000','00000','00000'],',':['00000','00000','00000','00000','00110','00100','01000'],
'-':['00000','00000','00000','11111','00000','00000','00000'],'/':['00001','00010','00010','00100','01000','01000','10000'],
'.':['00000','00000','00000','00000','00000','01100','01100']};
function dots(svg) {
  const t = svg.dataset.text, r = +svg.dataset.r, step = r * 2.25, gap = +(svg.dataset.gap || 1.2);
  let x = 0, out = '';
  for (const ch of t) { const g = F[ch] || F[' ']; const w = ch === ',' || ch === '.' ? 3 : 5;
    const off = ch === ',' || ch === '.' ? -1 : 0;
    g.forEach((row, j) => [...row].forEach((b, i) => { if (b === '1') out += `<circle cx="${x + (i + off) * step + r}" cy="${j * step + r}" r="${r}"/>`; }));
    x += (w + gap) * step; }
  svg.setAttribute('width', x - gap * step); svg.setAttribute('height', 7 * step - (step - 2 * r));
  svg.innerHTML = out;
}

/* small drawings of found things, lit softly, then ordered-dithered like a photocopy */
const OBJ = {
  key(g, w, h) {
    const cy = h * .46;
    g.save(); g.translate(w / 2, h / 2); g.rotate(Math.PI - 0.6); g.scale(.86 * w / 112, -.86 * w / 112); g.translate(-54, -cy);
    g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.arc(30, cy + 4, 17, 0, 7); g.fill(); g.fillRect(44, cy - 1, 56, 10);
    let gr = g.createLinearGradient(0, cy - 18, 0, cy + 18); gr.addColorStop(0, '#9c9c9c'); gr.addColorStop(.5, '#4a4a4a'); gr.addColorStop(1, '#1a1a1a');
    g.fillStyle = gr; g.beginPath(); g.arc(27, cy, 17, 0, 7); g.fill(); g.fillRect(40, cy - 4.5, 58, 9);
    g.beginPath(); g.moveTo(72, cy + 4); g.lineTo(72, cy + 13); g.lineTo(77, cy + 10); g.lineTo(81, cy + 15); g.lineTo(86, cy + 10); g.lineTo(90, cy + 14); g.lineTo(98, cy + 4); g.fill();
    g.fillStyle = '#e8e8e8'; g.beginPath(); g.arc(21, cy, 5, 0, 7); g.fill();
    g.lineWidth = 2.6; g.strokeStyle = '#333'; g.beginPath(); g.ellipse(14, cy + 6, 13, 19, -.5, 0, 7); g.stroke();
    g.restore();
  },
  glove(g, w, h) {
    g.save(); g.translate(w / 2, h / 2); g.rotate(-.35); g.scale(w / 100, w / 100);
    g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.roundRect(-20, -30, 44, 66, 20); g.fill();
    let gr = g.createLinearGradient(-25, -35, 25, 35); gr.addColorStop(0, '#8a8a8a'); gr.addColorStop(1, '#262626');
    g.fillStyle = gr; g.beginPath(); g.roundRect(-24, -34, 44, 62, 20); g.fill();
    g.beginPath(); g.ellipse(-26, 2, 9, 17, -.5, 0, 7); g.fill();
    g.fillStyle = '#c8c8c8'; g.fillRect(-22, 24, 40, 14);
    g.fillStyle = '#555'; for (let i = 0; i < 6; i++) g.fillRect(-20 + i * 7, 25, 2.5, 12);
    g.restore();
  },
  ticket(g, w, h) {
    g.save(); g.translate(w / 2, h / 2); g.rotate(.22); g.scale(w / 100, w / 100);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-34, -16, 72, 38);
    g.fillStyle = '#f2f2f2'; g.fillRect(-38, -20, 72, 38);
    g.fillStyle = '#222'; g.fillRect(-32, -14, 30, 4); g.fillRect(-32, -6, 20, 3); g.fillRect(-32, 0, 26, 3); g.fillRect(-32, 8, 14, 5);
    g.fillStyle = '#7a7a7a'; for (let y = -18; y < 18; y += 4) g.fillRect(14, y, 1.5, 2);
    g.fillStyle = '#333'; g.font = 'bold 9px monospace'; g.fillText('B14', 18, 4);
    g.restore();
  },
  book(g, w, h) {
    g.save(); g.translate(w / 2, h / 2); g.rotate(-.18); g.scale(w / 100, w / 100);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-22, -30, 50, 68);
    g.fillStyle = '#e6e6e6'; g.fillRect(-24, -32, 50, 66);
    let gr = g.createLinearGradient(-26, 0, 24, 0); gr.addColorStop(0, '#1e1e1e'); gr.addColorStop(1, '#5a5a5a');
    g.fillStyle = gr; g.fillRect(-27, -35, 48, 66);
    g.fillStyle = '#d0d0d0'; g.fillRect(-18, -24, 30, 3); g.fillRect(-18, -18, 22, 2);
    g.fillStyle = '#111'; g.fillRect(-27, -35, 5, 66);
    g.restore();
  },
  umbrella(g, w, h) {
    g.save(); g.translate(w / 2, h / 2); g.rotate(.7); g.scale(w / 120, w / 120);
    let gr = g.createLinearGradient(-14, 0, 14, 0); gr.addColorStop(0, '#6a6a6a'); gr.addColorStop(.4, '#2a2a2a'); gr.addColorStop(1, '#0e0e0e');
    g.fillStyle = gr; g.beginPath(); g.moveTo(0, -46); g.bezierCurveTo(12, -20, 15, 10, 11, 26); g.lineTo(-11, 26); g.bezierCurveTo(-15, 10, -12, -20, 0, -46); g.fill();
    g.fillStyle = '#999'; g.fillRect(-1.2, -56, 2.4, 11);
    g.fillStyle = '#222'; g.fillRect(-2.5, 25, 5, 16);
    g.lineWidth = 5; g.strokeStyle = '#2a2a2a'; g.beginPath(); g.arc(-7, 41, 7, 0, Math.PI); g.stroke();
    g.restore();
  },
  earring(g, w, h) {
    g.save(); g.translate(w / 2, h / 2); g.scale(w / 100, w / 100);
    for (const [x, y, r] of [[-12, -4, 17], [14, 8, 13]]) {
      g.lineWidth = 5; g.strokeStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.arc(x + 3, y + 4, r, 0, 7); g.stroke();
      g.strokeStyle = '#2c2c2c'; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
      g.lineWidth = 1.6; g.strokeStyle = '#bdbdbd'; g.beginPath(); g.arc(x, y, r - 1, 3.6, 4.6); g.stroke();
    }
    g.restore();
  },
  scarf(g, w, h) {
    /* folded flat, striped, with a fringe */
    g.save(); g.translate(w / 2, h / 2); g.rotate(-.25); g.scale(w / 100, w / 100);
    g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(-24, -34, 52, 60);
    g.fillStyle = '#5a5a5a'; g.fillRect(-28, -38, 52, 60);
    g.fillStyle = '#2a2a2a'; for (let i = 0; i < 4; i++) g.fillRect(-28, -30 + i * 14, 52, 5);
    g.strokeStyle = '#3a3a3a'; g.lineWidth = 1.6; for (let x = -26; x <= 22; x += 4) { g.beginPath(); g.moveTo(x, 22); g.lineTo(x + 1, 34); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(-28, -38, 6, 60);
    g.restore();
  },
  cassette(g, w, h) {
    g.save(); g.translate(w / 2, h / 2); g.rotate(-.12); g.scale(w / 100, w / 100);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.roundRect(-36, -20, 76, 48, 3); g.fill();
    g.fillStyle = '#3a3a3a'; g.beginPath(); g.roundRect(-40, -24, 76, 48, 3); g.fill();
    g.fillStyle = '#e4e4e4'; g.fillRect(-34, -19, 64, 24);
    g.fillStyle = '#222'; g.fillRect(-20, -12, 36, 10);
    g.fillStyle = '#ddd'; g.beginPath(); g.arc(-12, -7, 4, 0, 7); g.arc(8, -7, 4, 0, 7); g.fill();
    g.fillStyle = '#555'; g.beginPath(); g.moveTo(-24, 24); g.lineTo(-18, 12); g.lineTo(14, 12); g.lineTo(20, 24); g.fill();
    g.restore();
  },
};
function photo(cv, ink, bg, kind = 'key') {
  const w = cv.width, h = cv.height, c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#f4f4f4'); gr.addColorStop(1, '#c4c4c4');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  OBJ[kind](g, w, h);
  const d = g.getImageData(0, 0, w, h).data, o = cv.getContext('2d'), M = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  o.fillStyle = bg; o.fillRect(0, 0, w, h); o.fillStyle = ink;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const v = d[(y * w + x) * 4] / 255; if (v < (M[(y & 3) * 4 + (x & 3)] + .5) / 16) o.fillRect(x, y, 1, 1); }
}
const PAL = {
  vermilion: { paper:'#dedbd3', ink:'#1c1c1a', soft:'#6d6a63', rule:'rgba(28,28,26,.35)', accent:'#ff4b2b', 'on-accent':'#fff', stamp:'#ff4b2b', 'photo-bg':'#dedbd3' },
  indigo: { paper:'#cfd2d3', ink:'#1a1e24', soft:'#5d6670', rule:'rgba(26,30,36,.32)', accent:'#2a3b9c', 'on-accent':'#fff', stamp:'#2a3b9c', 'photo-bg':'#cfd2d3' },
  yellow: { paper:'#c8cacb', ink:'#151515', soft:'#5f6264', rule:'rgba(21,21,21,.32)', accent:'#151515', 'on-accent':'#e8f23a', stamp:'#151515', 'photo-bg':'#c8cacb' },
  navy: { paper:'#24306e', ink:'#e8e8e2', soft:'#a3abd0', rule:'rgba(232,232,226,.28)', accent:'#e8e8e2', 'on-accent':'#24306e', stamp:'#ff6a4a', 'stamp-blend':'normal', 'photo-bg':'#24306e', grain:'.45' },
};
function paint(el, pal) { for (const [k, v] of Object.entries(pal)) el.style.setProperty('--' + k, v); }

/* a highlighter stroke: ragged edges, ends that are not cut straight, streaks from the felt tip */
const MARK = { vermilion: 'rgba(255,92,60,.5)', indigo: 'rgba(80,100,210,.38)', navy: 'rgba(255,106,74,.62)', yellow: 'rgba(232,242,58,.95)' };
function marker(color, seed = 3) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='40' viewBox='0 0 400 40' preserveAspectRatio='none'>
<filter id='m' x='-4%' y='-30%' width='108%' height='160%'>
<feTurbulence type='fractalNoise' baseFrequency='0.03 0.5' numOctaves='2' seed='${seed}' result='n'/>
<feDisplacementMap in='SourceGraphic' in2='n' scale='7' xChannelSelector='R' yChannelSelector='G' result='d'/>
<feTurbulence type='fractalNoise' baseFrequency='0.004 0.42' numOctaves='2' seed='${seed + 4}' result='s'/>
<feColorMatrix in='s' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 2.2 -0.55' result='sa'/>
<feComposite in='d' in2='sa' operator='in'/>
</filter>
<path d='M7 9 Q 120 5 393 7 L 396 31 Q 230 35 5 33 Q 1 21 7 9 Z' fill='${color}' filter='url(#m)'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

function fill(root) {
  const FILES = [
    ['0398', 'glove', 'Glove, left', 'Knitted, grey. Thumb worn through.', ['TEXTILE'], '25.10', 'in'],
    ['0402', 'ticket', 'Ticket stub', 'Platform 3, punched once.', ['PAPER'], '25.10', 'out'],
    ['0409', 'book', 'Paperback', 'Corner folded at page 112.', ['PAPER'], '26.10', 'in'],
    ['0411', 'umbrella', 'Umbrella, folded', 'One rib bent. Still damp.', ['TEXTILE', 'METAL'], '26.10', 'in'],
    ['0417', 'key', 'Brass key', 'Nothing on the ring to say whose.', ['METAL'], '26.10', 'in', true],
    ['0423', 'earring', 'Earrings, a pair', 'Found together, in a tissue.', ['METAL'], '26.10', 'in'],
    ['0431', 'scarf', 'Scarf, wool', 'A small burn near one end.', ['TEXTILE'], '25.10', 'out'],
    ['0436', 'cassette', 'Cassette tape', 'Label says only "B side".', ['SOUND'], '27.10', 'in'],
  ];
  const ROWS = FILES.map(([no, kind, name, note, tags, d, st, hl]) => `
    <tr class="${hl ? 'hl' : ''}"><td class="no"><svg class="dots" data-text="${no}" data-r="1.25"></svg></td>
    <td class="fig"><canvas data-kind="${kind}" width="66" height="66"></canvas></td>
    <td><b><span>${name}</span></b><span class="n">${note}</span><div class="chips">${tags.map(t => `<span>${t}</span>`).join('')}</div></td>
    <td class="d">${d}.2026</td>
    <td class="st"><span class="mini ${st}">${st === 'out' ? 'RELEASED' : 'HELD'}</span></td></tr>`).join('');
  root.querySelectorAll('.tabs.fold').forEach(row => {
    const tabs = [...row.children], on = tabs.findIndex(t => t.classList.contains('on'));
    tabs.forEach((t, i) => t.style.setProperty('--depth', Math.abs(i - on)));
  });
  root.querySelectorAll('.rows').forEach(t => t.innerHTML = ROWS);

  const BOOK = [
    ['day', '25 OCT 2026 / SAT'],
    ['08:14', '0396', 'Water bottle', 'Platform 1', 'C / 02', 'C1', ''],
    ['09:30', '0397', 'Library card', 'Ticket hall', 'A / 07', 'C1', '25.10'],
    ['11:02', '0398', 'Glove, left', 'Bench, east gate', 'B / 03', 'C2', ''],
    ['13:47', '0399', 'Hat, <span class="x">red</span>', 'Platform 3', 'B / 04', 'C2', ''],
    ['13:48', '0399', 'Hat, orange', 'Platform 3', 'B / 04', 'C2', ''],
    ['17:20', '0402', 'Ticket stub', 'Platform 3', 'A / 08', 'C1', '24.10', 'hl'],
    ['day', '26 OCT 2026 / SUN'],
    ['10:05', '0409', 'Paperback', 'Waiting room', 'A / 09', 'C1', ''],
    ['12:40', '0411', 'Umbrella', 'Last carriage', 'D / 01', 'C2', ''],
    ['18:52', '0417', 'Brass key', 'Bench, east gate', 'B / 14', 'C2', '', 'hl'],
    ['19:30', '0423', 'Earrings, pair', 'Washroom', 'S / 02', 'C2', ''],
    ['day', '27 OCT 2026 / MON'],
    ['07:41', '0431', 'Scarf, wool', 'East gate', 'B / 15', 'C1', '27.10'],
    ['08:55', '0436', 'Cassette tape', 'Platform 2', 'A / 10', 'C1', ''],
    ['09:12', '0437', 'Mitten, child', 'Stairs', 'B / 16', 'C1', ''],
    ['09:40', '0438', 'Notebook, blue', 'Waiting room', 'A / 11', 'C2', ''],
    ['10:03', '0439', 'Earphone, right', 'Platform 1', 'S / 03', 'C2', ''],
    ['10:26', '0440', 'Paper bag, bread', 'Bench, west gate', 'F / 01', 'C1', '10.40'],
    ['blank'], ['blank'], ['blank'], ['blank'], ['blank'], ['blank'],
  ];
  const BOOKROWS = BOOK.map(r => r[0] === 'day'
    ? `<tr class="day"><td colspan="7"><span>${r[1]}</span></td></tr>`
    : r[0] === 'blank' ? `<tr>${'<td>&nbsp;</td>'.repeat(7)}</tr>`
    : `<tr class="${r[7] || ''}">${r.slice(0, 7).map(c => `<td>${c || '-'}</td>`).join('')}</tr>`).join('');
  root.querySelectorAll('.bookrows').forEach(t => t.innerHTML = BOOKROWS);
  for (const card of root.querySelectorAll('.card')) {
    const pal = PAL[card.dataset.pal]; paint(card, pal); card.style.setProperty('--marker', marker(MARK[card.dataset.pal], 3));
    card.querySelectorAll('.dots').forEach(dots);
    card.querySelectorAll('canvas[data-kind]').forEach(cv => photo(cv, pal.ink, pal['photo-bg'], cv.dataset.kind));
  }
}

/* ---------- motion ---------- */

/* everything written into the forms, in reading order */
const TYPED = '.v, .log td, .book tr:not(.day) td, .xref span, .idx b span, .idx .n, .idx td.d, .rel .row span, .slip .ln span:last-child';
const wait = ms => new Promise(r => setTimeout(r, ms));

function textNodes(el) {
  const out = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) if (w.currentNode.nodeValue.trim()) out.push(w.currentNode);
  return out;
}

function prepare(card) {
  const jobs = [];
  card.querySelectorAll(TYPED).forEach(el => {
    if (el.closest('.slip') && !el.matches('.slip .ln span:last-child')) return;
    /* each piece of text keeps its full place on the page; the part not yet typed is there but invisible */
    const nodes = textNodes(el).map(n => {
      const text = n.nodeValue, wrap = document.createElement('span'), shown = document.createTextNode(''), rest = document.createElement('span');
      rest.className = 'unt'; rest.textContent = text;
      wrap.append(shown, rest); n.replaceWith(wrap);
      return { shown, rest: rest.firstChild, text };
    });
    if (nodes.length) jobs.push({ el, nodes, len: nodes.reduce((a, b) => a + b.text.length, 0) });
  });
  const sig = card.querySelector('.sig path');
  if (sig) { const L = sig.getTotalLength(); sig.style.strokeDasharray = L; sig.dataset.len = L; }
  return {
    card, jobs, sig,
    marks: [...card.querySelectorAll('.v mark, .xref .on, .idx tr.hl b > span, .book tr.hl')],
    minis: [...card.querySelectorAll('.mini')],
    stamps: [...card.querySelectorAll('.stamp')],
    figs: [...card.querySelectorAll('canvas[data-kind]')],
    dots: [...card.querySelectorAll('.dots circle')],
  };
}

function blank(s) {
  s.jobs.forEach(j => j.nodes.forEach(x => { x.shown.nodeValue = ''; x.rest.nodeValue = x.text; }));
  s.marks.forEach(m => m.classList.remove('drawn'));
  [...s.minis, ...s.stamps].forEach(m => m.classList.remove('down'));
  s.figs.forEach(f => f.classList.remove('shown'));
  s.dots.forEach(c => { c.style.transition = 'none'; c.style.opacity = 0; });
  if (s.sig) { s.sig.style.transition = 'none'; s.sig.style.strokeDashoffset = s.sig.dataset.len; }
}

function done(s) {
  s.jobs.forEach(j => j.nodes.forEach(x => { x.shown.nodeValue = x.text; x.rest.nodeValue = ''; }));
  s.marks.forEach(m => m.classList.add('drawn'));
  [...s.minis, ...s.stamps].forEach(m => m.classList.add('down'));
  s.figs.forEach(f => f.classList.add('shown'));
  s.dots.forEach(c => (c.style.opacity = 1));
  if (s.sig) s.sig.style.strokeDashoffset = 0;
}

/* write one sheet: the dot numbers light up, the entries type in, then the marker, the signature and the stamps */
async function write(s, alive) {
  s.dots.forEach(c => {
    const w = +c.ownerSVGElement.getAttribute('width') || 1;
    c.style.transition = 'opacity .14s';
    c.style.transitionDelay = `${(c.cx.baseVal.value / w) * 520 + Math.random() * 80}ms`;
    c.style.opacity = 1;
  });
  await wait(480);
  let end = 0;
  s.jobs.forEach((j, k) => { j.start = k * GAP; end = Math.max(end, j.start + j.len * CHAR); });
  s.figs.forEach(f => {
    const row = f.closest('tr') || f.closest('.form');
    const job = s.jobs.find(j => row && row.contains(j.el));
    setTimeout(() => f.classList.add('shown'), job ? job.start : 0);
  });
  await new Promise(resolve => {
    const t0 = performance.now();
    const tick = now => {
      if (!alive()) return resolve();
      const t = now - t0;
      for (const j of s.jobs) {
        let n = Math.max(0, Math.floor((t - j.start) / CHAR));
        for (const x of j.nodes) { const k = Math.min(n, x.text.length); if (x.shown.nodeValue.length !== k) { x.shown.nodeValue = x.text.slice(0, k); x.rest.nodeValue = x.text.slice(k); } n -= k; }
      }
      if (t < end) requestAnimationFrame(tick); else resolve();
    };
    requestAnimationFrame(tick);
  });
  await wait(260);
  for (const m of s.marks) { m.classList.add('drawn'); await wait(320); }
  if (s.sig) { s.sig.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.5,0,.3,1)'; s.sig.style.strokeDashoffset = 0; await wait(900); }
  await wait(380);
  for (const m of s.minis) { m.classList.add('down'); await wait(110); }
  for (const m of s.stamps) {
    m.classList.add('down');
    s.card.classList.remove('thud'); void s.card.offsetWidth; s.card.classList.add('thud');
  }
}

function run(root, host) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desk = root.querySelector('.desk'), stage = root.querySelector('.stage');
  const sheets = [...root.querySelectorAll('.sheet')];
  fill(root);

  /* lay the sheets on the desk and scale the desk to the space it has */
  let layout = '';
  const place = () => {
    const width = host.getBoundingClientRect().width;
    if (!width) return;
    const name = width < 620 ? 'narrow' : 'wide', L = LAYOUTS[name];
    if (name !== layout) {
      layout = name;
      desk.style.setProperty('--w', L.w); desk.style.setProperty('--h', L.h);
      sheets.forEach((el, i) => { const [x, y, r] = L.at[i]; el.style.setProperty('--x', x); el.style.setProperty('--y', y); el.style.setProperty('--r', r + 'deg'); el.style.setProperty('--z', i + 1); });
    }
    stage.style.setProperty('--k', width / L.w);
  };
  new ResizeObserver(place).observe(host);
  place();

  /* the tabs bring their own sheet to the top */
  root.addEventListener('click', e => {
    const tab = e.target.closest('.tabs span'); if (!tab) return;
    const i = ['INDEX', 'FILE', 'LEDGER', 'RELEASED'].indexOf(tab.textContent.trim());
    if (i >= 0) { sheets.forEach(s => s.classList.remove('top')); sheets[i].classList.add('top'); }
  });

  const states = sheets.map(el => prepare(el.querySelector('.card')));
  if (reduce.matches) { states.forEach(done); return; }

  /* only write while the desk is on screen */
  let visible = false, gen = 0;
  const seen = () => new Promise(r => { const check = () => visible ? r() : setTimeout(check, 300); check(); });
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(desk);

  (async () => {
    for (;;) {
      const my = ++gen, alive = () => my === gen;
      states.forEach(blank);
      sheets.forEach(s => s.classList.remove('top'));
      for (let i = 0; i < states.length; i++) {
        await seen();
        sheets.forEach(s => s.classList.remove('top')); sheets[i].classList.add('top');
        await write(states[i], alive);
        await wait(HOLD);
      }
      sheets.forEach(s => s.classList.remove('top'));
      await wait(REST);
    }
  })();
}

class LostAndFound extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    /* the typewriter face lives in the document so the shadow root can use it */
    if (!document.querySelector(`link[href="${FONT}"]`)) document.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${FONT}">`);
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<link rel="stylesheet" href="${STYLE}">${MARKUP}`;
    const desk = root.querySelector('.desk');
    desk.style.visibility = 'hidden';
    const link = root.querySelector('link');
    const start = () => {
      const fonts = document.fonts ? Promise.all([document.fonts.load('10px "Courier Prime"'), document.fonts.load('700 10px "Courier Prime"'), document.fonts.load('500 10px Inter')]).catch(() => {}) : Promise.resolve();
      fonts.then(() => { desk.style.visibility = ''; run(root, this); });
    };
    link.addEventListener('load', start, { once: true });
    link.addEventListener('error', start, { once: true });
  }
}

if (!customElements.get('lost-and-found')) customElements.define('lost-and-found', LostAndFound);

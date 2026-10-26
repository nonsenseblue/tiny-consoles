/* tiny-consoles · gallery page
 * Reads ../pieces.json and renders one section per piece from the templates in index.html.
 * To add a piece: put the component in components/, its stylesheet in styles/,
 * and add one entry to pieces.json.
 */

const ROOT = new URL('../', import.meta.url);
const COMPONENTS = new URL('components/', ROOT).href;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const embedCode = tag =>
  `<script type="module" src="${COMPONENTS}${tag}.js"></script>\n<${tag}></${tag}>`;
const firstSentence = text => (text.match(/^.*?[.!?](\s|$)/) || [text])[0].trim();

function renderIndexItem(piece, num) {
  const item = document.getElementById('index-item').content.firstElementChild.cloneNode(true);
  item.href = `#${piece.tag}`;
  item.querySelector('.n').textContent = num;
  item.querySelector('b').textContent = piece.tag;
  item.querySelector('.about').textContent = firstSentence(piece.text);
  item.querySelector('.made').textContent = piece.chips.join(', ');
  return item;
}

function renderPiece(piece, num) {
  const section = document.getElementById('piece').content.firstElementChild.cloneNode(true);
  section.id = piece.tag;

  section.querySelector('.num').textContent = `Plate ${num}`;
  section.querySelector('h2').textContent = piece.tag;
  section.querySelector('.plate p').textContent = piece.text;
  section.querySelector('.chips').append(...piece.chips.map(text => {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
  }));
  section.querySelector('.stage').append(document.createElement(piece.tag));

  const fig = section.querySelector('.fig');
  const label = document.createElement('b');
  label.textContent = `Fig. ${num}`;
  fig.append(label, ` · <${piece.tag}>, running live.`, document.createElement('br'), piece.hint || '');

  const comment = document.createElement('span');
  comment.className = 'c';
  comment.textContent = `<!-- ${piece.tag} -->`;
  section.querySelector('pre').append(comment, '\n' + embedCode(piece.tag));

  section.querySelector('button').dataset.copy = piece.tag;
  return section;
}

async function copyEmbed(button) {
  try {
    await navigator.clipboard.writeText(embedCode(button.dataset.copy));
    button.textContent = 'Copied';
  } catch {
    button.textContent = 'Select';
  }
  setTimeout(() => { button.textContent = 'Copy'; }, 1600);
}

/* ---------- the field behind the title: traced contours, swept in like a scan ---------- */
function field() {
  const canvas = document.getElementById('field');
  if (!canvas) return;
  const seeded = s => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const makeNoise = seed => {
    const r = seeded(seed), P = new Uint8Array(512), p = [...Array(256).keys()];
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) P[i] = p[i & 255];
    const fade = t => t * t * (3 - 2 * t), v = (x, y) => P[P[x & 255] + (y & 255)] / 255;
    const n = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), u = fade(x - xi), w = fade(y - yi);
      const a = v(xi, yi), b = v(xi + 1, yi), c = v(xi, yi + 1), d = v(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
    };
    return (x, y, oct = 4) => { let s = 0, amp = 0.5, f = 1, t = 0; for (let i = 0; i < oct; i++) { s += amp * n(x * f, y * f); t += amp; amp *= 0.5; f *= 2.03; } return s / t; };
  };

  let segs = [], raf = 0;
  const build = () => {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    const w = r.width, h = r.height, cell = 3;
    const n = makeNoise(17), gaps = makeNoise(41), rnd = seeded(3);
    const s = Math.max(w, h);
    /* terrain that rises toward the upper right, leaving the title's corner calm */
    const f = (x, y) => n(x / s * 3.4, y / s * 3.4, 5) + 0.18 * (x / w) - 0.14 * (y / h);
    /* lines thin out toward the bottom so the title and the intro sit on quiet paper */
    const calm = (x, y) => Math.min(1, Math.max(0, (1 - y / h - 0.3) / 0.3));
    const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1, F = new Float32Array(cols * rows);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) F[j * cols + i] = f(i * cell, j * cell);
    segs = [];
    for (let L = 0.3; L < 0.86; L += 0.036) {
      for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
        const a = F[j * cols + i], b = F[j * cols + i + 1], c = F[(j + 1) * cols + i + 1], d = F[(j + 1) * cols + i];
        const k = (a > L) | ((b > L) << 1) | ((c > L) << 2) | ((d > L) << 3);
        if (k === 0 || k === 15) continue;
        const x = i * cell, y = j * cell;
        const T = [x + cell * (L - a) / (b - a), y], R = [x + cell, y + cell * (L - b) / (c - b)],
              B = [x + cell * (L - d) / (c - d), y + cell], Lf = [x, y + cell * (L - a) / (d - a)];
        const pairs = {1:[[Lf,T]],2:[[T,R]],3:[[Lf,R]],4:[[R,B]],5:[[Lf,T],[R,B]],6:[[T,B]],7:[[Lf,B]],
                       8:[[B,Lf]],9:[[B,T]],10:[[T,R],[B,Lf]],11:[[B,R]],12:[[R,Lf]],13:[[R,T]],14:[[T,Lf]]}[k];
        for (const [p, q] of pairs) {
          const keep = calm(p[0], p[1]);
          if (gaps(p[0] * 0.035, p[1] * 0.035, 2) > 0.66 || rnd() > keep * 0.94) continue;
          segs.push([p[0], p[1], q[0], q[1]]);
        }
      }
    }
    return { w, h, dpr };
  };

  const paint = (geo, upto) => {
    const ctx = canvas.getContext('2d');
    ctx.setTransform(geo.dpr, 0, 0, geo.dpr, 0, 0);
    ctx.clearRect(0, 0, geo.w, geo.h);
    ctx.strokeStyle = 'rgba(27,26,25,.62)'; ctx.lineWidth = 0.75; ctx.lineCap = 'round';
    ctx.beginPath();
    for (const [x1, y1, x2, y2] of segs) {
      if (x1 > upto) continue;
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    }
    ctx.stroke();
    /* the scan head */
    if (upto < geo.w) {
      ctx.fillStyle = 'rgba(27,26,25,.18)';
      ctx.fillRect(upto, 0, 1, geo.h);
    }
  };

  const start = () => {
    cancelAnimationFrame(raf);
    const geo = build();
    if (reduce) return paint(geo, geo.w);
    const t0 = performance.now(), dur = 3600;
    const step = now => {
      const t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
      paint(geo, e * geo.w + (t === 1 ? 1 : 0));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };
  start();
  let width = innerWidth, timer;
  addEventListener('resize', () => {
    if (innerWidth === width) return;            /* ignore mobile toolbar height changes */
    width = innerWidth;
    clearTimeout(timer);
    timer = setTimeout(() => { const geo = build(); paint(geo, geo.w); }, 200);
  });
}

const pieces = await (await fetch(new URL('pieces.json', ROOT))).json();
const index = document.getElementById('index');
const main = document.getElementById('pieces');

pieces.forEach((piece, i) => {
  const num = String(i + 1).padStart(2, '0');
  index.append(renderIndexItem(piece, num));
  main.append(renderPiece(piece, num));
  import(`${COMPONENTS}${piece.tag}.js`);
});

/* plate, figure and caption come up one after another as each piece scrolls in */
const reveal = [...main.querySelectorAll('.plate, .stage, .foot')];
reveal.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  io.unobserve(e.target);
}), { rootMargin: '0px 0px -12% 0px' });
reveal.forEach(el => io.observe(el));

main.addEventListener('click', e => {
  const button = e.target.closest('button[data-copy]');
  if (button) copyEmbed(button);
});

(document.fonts ? document.fonts.ready : Promise.resolve()).then(field);

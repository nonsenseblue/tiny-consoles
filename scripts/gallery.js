/* tiny-consoles · gallery page
 * Reads ../pieces.json and builds an index page plus one page per piece from the templates in index.html.
 * The pages sit in a ring: index → newest → … → 01 → index.
 * To add a piece: put the component in components/, its stylesheet in styles/,
 * a small still in assets/thumbs/<tag>.webp, and add one entry to pieces.json.
 */

const ROOT = new URL('../', import.meta.url);
const COMPONENTS = new URL('components/', ROOT).href;
const THUMBS = new URL('assets/thumbs/', ROOT).href;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const embedCode = tag =>
  `<script type="module" src="${COMPONENTS}${tag}.js"></script>\n<${tag}></${tag}>`;
const firstSentence = text => (text.match(/^.*?[.!?](\s|$)/) || [text])[0].trim();

function renderIndexItem(piece, num) {
  const item = document.getElementById('index-item').content.firstElementChild.cloneNode(true);
  item.href = `#${piece.tag}`;
  item.dataset.go = piece.tag;
  item.querySelector('img').src = `${THUMBS}${piece.tag}.webp`;
  item.querySelector('.n').textContent = num;
  item.querySelector('b').textContent = piece.tag;
  item.querySelector('.about').textContent = firstSentence(piece.text);
  item.querySelector('.made').textContent = piece.chips.join(', ');
  return item;
}

function renderPiece(piece, num) {
  const section = document.getElementById('piece').content.firstElementChild.cloneNode(true);
  section.dataset.key = piece.tag;
  section.setAttribute('aria-label', piece.tag);

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

  section.querySelector('.use button').dataset.copy = piece.tag;
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

/* ---------- pager ---------- */
function pager(pages, labels) {
  const where = document.getElementById('where');
  /* the label box is as wide as the longest page name, so the arrows never move */
  const fit = () => {
    where.style.minWidth = '0px';
    const keep = where.textContent;
    let max = 0;
    for (const l of labels) { where.textContent = l; max = Math.max(max, where.getBoundingClientRect().width); }
    where.textContent = keep;
    where.style.minWidth = `${Math.ceil(max)}px`;
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
  const n = pages.length;
  let cur = 0, offsets = pages.map(() => 0);

  /* place every page by its ring distance from the current one */
  const layout = (animate = true) => {
    pages.forEach((page, i) => {
      let d = ((i - cur) % n + n) % n;
      if (d > n / 2) d -= n;
      /* a page that wraps from one side to the other moves while out of sight */
      page.classList.toggle('still', !animate || Math.abs(d - offsets[i]) > 1);
      page.style.setProperty('--at', d);
      page.classList.toggle('current', d === 0);
      if (Math.abs(d) <= 1) page.classList.remove('away');
      offsets[i] = d;
    });
    clearTimeout(layout.t);
    where.textContent = labels[cur];
    layout.t = setTimeout(() => pages.forEach((p, i) => p.classList.toggle('away', offsets[i] !== 0)), animate ? 850 : 0);
  };

  const go = (i, animate = true) => {
    cur = ((i % n) + n) % n;
    layout(animate);
    const key = pages[cur].dataset.key;
    history.replaceState(null, '', key === 'index' ? location.pathname : `#${key}`);
  };
  const step = s => go(cur + s);
  const goKey = key => { const i = pages.findIndex(p => p.dataset.key === key); if (i >= 0) go(i); };

  /* buttons and links */
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-step]');
    if (s) { step(Number(s.dataset.step)); return; }
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); goKey(g.dataset.go); }
  });
  addEventListener('keydown', e => {
    if (e.target.closest('input, textarea, pre')) return;
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  /* trackpad: a sideways swipe turns one page */
  let acc = 0, locked = false;
  addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 1.2) return;
    e.preventDefault();
    if (locked) return;
    acc += e.deltaX;
    if (Math.abs(acc) > 50) {
      step(acc > 0 ? 1 : -1);
      acc = 0; locked = true;
      setTimeout(() => { locked = false; }, 850);
    }
  }, { passive: false });

  /* touch: the pages follow the finger */
  const area = document.getElementById('pager');
  let sx = 0, sy = 0, dx = 0, mode = null, t0 = 0;
  area.addEventListener('touchstart', e => {
    const t = e.touches[0]; sx = t.clientX; sy = t.clientY; dx = 0; mode = null; t0 = performance.now();
  }, { passive: true });
  area.addEventListener('touchmove', e => {
    const t = e.touches[0], mx = t.clientX - sx, my = t.clientY - sy;
    if (!mode && Math.hypot(mx, my) > 10) mode = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
    if (mode !== 'x') return;
    e.preventDefault();
    dx = mx;
    pages.forEach(p => { p.classList.add('still'); p.classList.remove('away'); p.style.setProperty('--drag', `${dx}px`); });
  }, { passive: false });
  area.addEventListener('touchend', () => {
    if (mode !== 'x') return;
    const fast = Math.abs(dx) / (performance.now() - t0) > 0.4;
    pages.forEach(p => p.style.setProperty('--drag', '0px'));
    if (Math.abs(dx) > innerWidth * 0.22 || (fast && Math.abs(dx) > 30)) step(dx < 0 ? 1 : -1);
    else layout();
  });

  addEventListener('hashchange', () => goKey(location.hash.slice(1) || 'index'));
  const start = location.hash.slice(1);
  go(Math.max(0, pages.findIndex(p => p.dataset.key === (start || 'index'))), false);
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
    /* the field reaches just into the top of the title, wherever the title lands */
    const h1 = document.querySelector('.home h1'), page = canvas.parentElement;
    const top = h1.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop;
    canvas.style.height = `${Math.round(top + h1.offsetHeight * 0.3)}px`;
    const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    const w = r.width, h = r.height, cell = 3;
    const n = makeNoise(17), gaps = makeNoise(41), rnd = seeded(3);
    const s = Math.max(w, h * 1.6);
    const f = (x, y) => n(x / s * 3.4, y / s * 3.4, 5) + 0.18 * (x / w) - 0.14 * (y / h);
    /* lines thin out toward the bottom so the title sits on quiet paper */
    const calm = (x, y) => Math.min(1, Math.max(0, (1 - y / h) / 0.45));
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
          if (gaps(p[0] * 0.035, p[1] * 0.035, 2) > 0.66 || rnd() > calm(p[0], p[1]) * 0.94) continue;
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
    ctx.strokeStyle = 'rgba(27,26,25,.6)'; ctx.lineWidth = 0.75; ctx.lineCap = 'round';
    ctx.beginPath();
    for (const [x1, y1, x2, y2] of segs) {
      if (x1 > upto) continue;
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    }
    ctx.stroke();
    if (upto < geo.w) { ctx.fillStyle = 'rgba(27,26,25,.18)'; ctx.fillRect(upto, 0, 1, geo.h); }
  };

  const sweep = () => {
    cancelAnimationFrame(raf);
    const geo = build();
    if (reduce) return paint(geo, geo.w);
    const t0 = performance.now(), dur = 3600;
    const frame = now => {
      const t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
      paint(geo, e * geo.w + (t === 1 ? 1 : 0));
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  };
  sweep();
  let width = innerWidth, timer;
  addEventListener('resize', () => {
    if (innerWidth === width) return;
    width = innerWidth;
    clearTimeout(timer);
    timer = setTimeout(() => { const geo = build(); paint(geo, geo.w); }, 200);
  });
}

/* ---------- build ---------- */
const pieces = await (await fetch(new URL('pieces.json', ROOT))).json();
const index = document.getElementById('index');
const area = document.getElementById('pager');
const home = area.querySelector('.home');

const built = pieces.map((piece, i) => {
  const num = String(i + 1).padStart(2, '0');
  index.append(renderIndexItem(piece, num));
  const page = renderPiece(piece, num);
  area.append(page);
  import(`${COMPONENTS}${piece.tag}.js`);
  return { page, label: `${num} · ${piece.tag}` };
});

/* ring order: index, then newest first, back round to 01 */
const ring = [{ page: home, label: 'Index' }, ...built.slice().reverse()];
pager(ring.map(r => r.page), ring.map(r => r.label));

area.addEventListener('click', e => {
  const button = e.target.closest('button[data-copy]');
  if (button) copyEmbed(button);
});

(document.fonts ? document.fonts.ready : Promise.resolve()).then(field);

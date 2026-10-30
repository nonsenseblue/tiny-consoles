/* tiny-consoles · gallery page
 * Reads ../pieces.json and ../home.json and builds the index, a page listing every piece, and one page per piece.
 * The index shows the pinned pieces (home.json "pinned", in that order) and a link to All works,
 * the full list grouped by home.json "groups".
 * The pages sit in a ring: index → newest → … → 01 → index. All works is not in the ring; Explore more opens it over the pages.
 * To add a piece: make a folder components/<tag>/ with DESIGN.md, src/<tag>.js, src/<tag>.css
 * and assets/thumb.webp, then add one entry to pieces.json.
 *
 * pages.js   the index entries and the piece pages
 * pager.js   moving between pages
 * field.js   the contour lines behind the title
 * cursor.js  the lens cursor
 * menu.js    the page list behind the menu button on phones
 * swell.js   the dot field above All works
 */

const ROOT = new URL('../', import.meta.url);
/* remembered before the pager settles the address, so a link straight to #all still opens it */
const STARTED_AT = location.hash;
/* the deploy stamps ?v=<commit> on this script; every other file is loaded with the same stamp */
const V = new URL(import.meta.url).search;
const COMPONENTS = new URL('components/', ROOT).href;
const load = name => import(new URL(`${name}.js${V}`, import.meta.url).href);

const json = name => fetch(new URL(`${name}.json${V}`, ROOT)).then(r => r.json());
const [{ setup }, { pager }, { field }, { cursor }, { menu }, { swell }, pieces, shelves] = await Promise.all([
  load('pages'), load('pager'), load('field'), load('cursor'), load('menu'), load('swell'),
  json('pieces'), json('home').catch(() => ({})),
]);
const { renderIndexItem, renderPiece, copyEmbed } = setup({ components: COMPONENTS, version: V });

const area = document.getElementById('pager');
const home = area.querySelector('.home');
const all = area.querySelector('.all');

const nums = new Map(pieces.map((piece, i) => [piece.tag, String(i + 1).padStart(2, '0')]));
const newest = pieces[pieces.length - 1]?.tag;
const entry = piece => renderIndexItem(piece, nums.get(piece.tag), piece.tag === newest);

const built = pieces.map(piece => {
  const num = nums.get(piece.tag);
  const page = renderPiece(piece, num);
  area.append(page);
  import(`${COMPONENTS}${piece.tag}/src/${piece.tag}.js${V}`);
  return { page, label: `${num} · ${piece.tag.replace(/-/g, ' ')}` };
});

/* the index: pinned first, then the newest pieces that are not pinned */
const byTag = new Map(pieces.map(piece => [piece.tag, piece]));
const pinned = (shelves.pinned || []).map(tag => byTag.get(tag)).filter(Boolean);
document.getElementById('pinned').append(...pinned.map(entry));
document.getElementById('shelf-pinned').hidden = !pinned.length;
document.getElementById('count-pinned').textContent = String(pinned.length).padStart(2, '0');

/* the full list, grouped as home.json says (newest first in each group); anything not listed goes under Other */
const listed = new Set((shelves.groups || []).flatMap(group => group.tags));
const groups = [...(shelves.groups || []), { name: 'Other', tags: pieces.map(p => p.tag).filter(tag => !listed.has(tag)) }]
  .map(group => ({ name: group.name, items: pieces.slice().reverse().filter(p => group.tags.includes(p.tag)) }))
  .filter(group => group.items.length);
const icon = document.querySelector('#shelf-pinned h3 svg');
document.getElementById('all').append(...groups.map(group => {
  const shelf = document.createElement('section');
  shelf.className = 'shelf';
  shelf.id = `group-${group.name.toLowerCase().replace(/\s+/g, '-')}`;
  const h3 = document.createElement('h3');
  const name = document.createElement('span'), count = document.createElement('em');
  name.textContent = group.name; count.textContent = String(group.items.length).padStart(2, '0');
  h3.append(icon.cloneNode(true), name, count);
  const nav = document.createElement('nav');
  nav.className = 'index grid'; nav.setAttribute('aria-label', group.name);
  nav.append(...group.items.map(entry));
  shelf.append(h3, nav);
  return shelf;
}));

/* ring order: index, then newest first, back round to 01; All works sits apart and opens over the pages */
const ring = [{ page: home, label: 'Index' }, ...built.slice().reverse()];
pager(ring.map(r => r.page), ring.map(r => r.label));
/* the phone menu keeps it short: the index, All works, and only the pinned pieces */
const inMenu = ring.filter((r, i) => i === 0 || (shelves.pinned || []).includes(r.page.dataset.key));
menu(inMenu.map(r => r.page), inMenu.map(r => r.label), () => all.classList.contains('open'));

/* the head of All works: a jump link per group, and the dot field above it */
document.getElementById('jump').append(...groups.map(group => {
  const li = document.createElement('li'), a = document.createElement('a');
  a.href = `#group-${group.name.toLowerCase().replace(/\s+/g, '-')}`; a.textContent = group.name;
  a.addEventListener('click', e => { e.preventDefault(); all.querySelector(a.hash).scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  li.append(a); return li;
}));
const playSwell = swell(document.getElementById('swell'));

/* All works: opened only from Explore more (or #all), laid over the pages; any other way of moving closes it */
const where = document.getElementById('where');
let before = '';
const openAll = () => {
  if (all.classList.contains('open')) return;
  before = where.textContent; where.textContent = 'All works';
  all.scrollTop = 0; all.classList.add('open'); all.inert = false;
  requestAnimationFrame(playSwell);
  history.replaceState(null, '', '#all');
};
const closeAll = (restore = false) => {
  if (!all.classList.contains('open')) return;
  all.classList.remove('open'); all.inert = true;
  if (restore) { where.textContent = before; history.replaceState(null, '', location.pathname); }
};
all.inert = true;
document.addEventListener('click', e => {
  const link = e.target.closest('[data-go], [data-step]');
  if (!link) return;
  if (link.dataset.go === 'all') { e.preventDefault(); e.stopPropagation(); openAll(); }
  else closeAll();
}, true);
addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(true); });
addEventListener('hashchange', () => { if (location.hash === '#all') openAll(); else closeAll(); });
/* its own scrolling and swipes stay inside it, so the pages behind never turn */
['wheel', 'touchstart', 'touchmove', 'touchend'].forEach(type => all.addEventListener(type, e => e.stopPropagation(), { passive: true }));
if (STARTED_AT === '#all') openAll();

area.addEventListener('click', e => {
  const button = e.target.closest('button[data-copy]');
  if (button) copyEmbed(button);
});

(document.fonts ? document.fonts.ready : Promise.resolve()).then(field);
cursor();

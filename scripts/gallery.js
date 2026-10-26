/* tiny-consoles · gallery page
 * Reads ../pieces.json and builds an index page plus one page per piece from the templates in index.html.
 * The pages sit in a ring: index → newest → … → 01 → index.
 * To add a piece: make a folder components/<tag>/ with DESIGN.md, src/<tag>.js, src/<tag>.css
 * and assets/thumb.webp, then add one entry to pieces.json.
 *
 * pages.js   the index entries and the piece pages
 * pager.js   moving between pages
 * field.js   the contour lines behind the title
 * cursor.js  the lens cursor
 */

const ROOT = new URL('../', import.meta.url);
/* the deploy stamps ?v=<commit> on this script; every other file is loaded with the same stamp */
const V = new URL(import.meta.url).search;
const COMPONENTS = new URL('components/', ROOT).href;
const load = name => import(new URL(`${name}.js${V}`, import.meta.url).href);

const [{ setup }, { pager }, { field }, { cursor }, pieces] = await Promise.all([
  load('pages'), load('pager'), load('field'), load('cursor'),
  fetch(new URL(`pieces.json${V}`, ROOT)).then(r => r.json()),
]);
const { renderIndexItem, renderPiece, copyEmbed } = setup({ components: COMPONENTS, version: V });

const index = document.getElementById('index');
const area = document.getElementById('pager');
const home = area.querySelector('.home');

const built = pieces.map((piece, i) => {
  const num = String(i + 1).padStart(2, '0');
  index.append(renderIndexItem(piece, num));
  const page = renderPiece(piece, num);
  area.append(page);
  import(`${COMPONENTS}${piece.tag}/src/${piece.tag}.js${V}`);
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
cursor();

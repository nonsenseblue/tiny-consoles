/* tiny-consoles · gallery page
 * Reads ../pieces.json and renders one section per piece from the templates in index.html.
 * To add a piece: put the component in components/, its stylesheet in styles/,
 * and add one entry to pieces.json.
 */

const ROOT = new URL('../', import.meta.url);
const COMPONENTS = new URL('components/', ROOT).href;

const embedCode = tag =>
  `<script type="module" src="${COMPONENTS}${tag}.js"></script>\n<${tag}></${tag}>`;

function renderIndexItem(piece, num) {
  const item = document.getElementById('index-item').content.firstElementChild.cloneNode(true);
  item.href = `#${piece.tag}`;
  item.querySelector('span').textContent = num;
  item.querySelector('b').textContent = piece.tag;
  return item;
}

function renderPiece(piece, num) {
  const section = document.getElementById('piece').content.firstElementChild.cloneNode(true);
  section.id = piece.tag;
  section.classList.toggle('dark', Boolean(piece.dark));
  section.style.setProperty('--bg', piece.bg);
  section.style.setProperty('--fg', piece.fg);

  section.querySelector('.num').textContent = num;
  section.querySelector('h2').textContent = `<${piece.tag}>`;
  section.querySelector('.meta p').textContent = piece.text;
  section.querySelector('.chips').append(...piece.chips.map(text => {
    const chip = document.createElement('span');
    chip.textContent = text;
    return chip;
  }));
  section.querySelector('.stage').append(document.createElement(piece.tag));

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

const pieces = await (await fetch(new URL('pieces.json', ROOT))).json();
const index = document.getElementById('index');
const main = document.getElementById('pieces');

pieces.forEach((piece, i) => {
  const num = String(i + 1).padStart(2, '0');
  index.append(renderIndexItem(piece, num));
  main.append(renderPiece(piece, num));
  import(`${COMPONENTS}${piece.tag}.js`);
});

main.addEventListener('click', e => {
  const button = e.target.closest('button[data-copy]');
  if (button) copyEmbed(button);
});

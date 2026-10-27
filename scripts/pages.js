/* tiny-consoles · pages
 * Builds the two kinds of page from the templates in index.html:
 * one entry in the index, and one page per piece with its plate, stage, caption and embed code.
 */

export function setup({ components, version }) {
  /* every piece lives in its own folder: components/<tag>/ with src/ for code and assets/ for images */
  const folder = tag => `${components}${tag}/`;
  const embedCode = tag =>
    `<script type="module" src="${folder(tag)}src/${tag}.js"></script>\n<${tag}></${tag}>`;
  const firstSentence = text => (text.match(/^.*?[.!?](\s|$)/) || [text])[0].trim();

  function renderIndexItem(piece, num) {
    const item = document.getElementById('index-item').content.firstElementChild.cloneNode(true);
    item.href = `#${piece.tag}`;
    item.dataset.go = piece.tag;
    item.querySelector('img').src = `${folder(piece.tag)}assets/thumb.webp${version}`;
    item.querySelector('.n').textContent = num;
    item.querySelector('b').textContent = piece.tag;
    item.querySelector('.about').textContent = piece.about || firstSentence(piece.text);   /* a short line for the index; the plate keeps the full text */
    item.querySelector('.made').textContent = piece.chips.join(', ');
    return item;
  }

  function renderPiece(piece, num) {
    const section = document.getElementById('piece').content.firstElementChild.cloneNode(true);
    section.dataset.key = piece.tag;
    section.setAttribute('aria-label', piece.tag);

    /* one line: "Plate 01 /" in ink, the piece name after it in grey */
    const lead = document.createElement('span');
    lead.className = 'lead';
    lead.textContent = `Plate ${num} /`;
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = piece.tag;
    section.querySelector('h2').append(lead, ' ', name);
    section.querySelector('.plate p').textContent = piece.text;
    section.querySelector('.chips').append(...piece.chips.map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
    const stage = section.querySelector('.stage');
    stage.append(document.createElement(piece.tag));
    /* wide pieces can say how tall they are for their width, so they still fit on one screen */
    if (piece.ratio) stage.style.setProperty('--ratio', piece.ratio);
    if (piece.max) stage.style.setProperty('--max', `${piece.max}px`);

    const fig = section.querySelector('.fig');
    const label = document.createElement('b');
    label.textContent = `Fig. ${num}`;
    fig.append(label, ` · <${piece.tag}>, running live.`, document.createElement('br'), piece.hint || '');

    section.querySelector('pre').textContent = embedCode(piece.tag);

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

  return { renderIndexItem, renderPiece, copyEmbed };
}

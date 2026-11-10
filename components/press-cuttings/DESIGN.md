---
version: alpha
name: Press Cuttings
description: Four small piles of torn and cut paper from the last night of a town paper; opened, each squares itself up and the last line of every slip, read down the edge, makes one sentence.
---

# Press Cuttings

## Overview

The night the town paper prints for the last time, someone goes round an invented river town, Weir, and tears the end off whatever is to hand. Four small piles end up on one desk: one from the paper's office, one from the ferry, one from the bakery that has just been sold, one from a letter that was never sent.

Every pile mixes papers of its own kind, and every paper comes apart its own way: newsprint torn by hand, magazine stock cut with scissors, a ticket torn so its pale core shows, baking paper that snaps, a strip of telegram tape cut through the word before. The papers carry what they would really carry: a headline, a timetable, a recipe, a library label.

On the desk the piles lie scattered, each slip swung round on its own. Open one and it squares itself up, slip after slip, until each shows only its last line under the one above. Read down the edge, those lines make one sentence that no single paper printed.

| Pile | Read down the edge |
|---|---|
| The Evening Ledger | After 112 years, the presses stop tonight / the clock tower stays lit / for nobody. / in particular. / and the river / GOES ON |
| The Last Ferry | Last crossing 21.40 / weather permitting / Wish you were / on the other side / of the water. |
| Mill Street Bakery | Leave overnight in a warm place. / BEST BEFORE / the end of the month. / thank you / come again |
| A Letter Not Sent | Please return by / the fourteenth. / slowly, and a little quieter / I WILL WRITE WHEN I ARRIVE / VE STOP |

The notes beside an opened pile say where it comes from and what the papers are. They do not spell the sentence out; it is left to be read off the paper.

## Influences

| Source | What Press Cuttings takes from it |
|---|---|
| Paper collage, from the first newspaper pasted into a painting to Kurt Schwitters' tickets and wrappers | Printed paper that has really been torn or cut, the tear left to show. |
| Found poetry, and Tom Phillips' *A Humument*, a novel painted over until a few words on each page make new lines | Words found in printed matter rather than written; here the slips are laid so the lines show, instead of painting the rest out. |
| Sorting things into kinds as the work itself | The idea of taking printed matter apart and putting like with like came from a reference screenshot of a web page sorted into heaps. Our town, papers, words, colours and type are our own. |
| British press cuttings and the papers of a small town | Old style newspaper type, telegram strips, library date labels, till receipts, baking paper. Weir, its streets, shops and people are invented. |

## Colors

No board colour of its own: the piles lie on the gallery's paper. Each paper has its own stock and one or two inks; nothing is pure white.

| Pile | Papers and their colours |
|---|---|
| Evening Ledger | Newsprint `#eae3d0`, ink `#1a1917` · magazine `#e2e1db` · book page `#f3ebd5` browned at the edge · handbook card `#d6e2cd`, ink `#21403c` · receipt `#efeadc` yellowing, print `#5a5160` · one stroke of blue pencil `#2d58b4` |
| Last Ferry | Timetable card `#ebe3cd`, navy `#2a3d5c` and red `#a23a2c` · ticket board `#e5ab90`, number `#8c1d14` · postcard `#e9dfc8`, pen `#24304e` · leaflet `#e4d8a8`, river `#a9c2bd` · India paper `#e8dec4` |
| Mill Street Bakery | Index card `#ece5d2`, blue rules, one red line, pencil `#4a4744` · kraft `#b78f61`, stencil `#7d2a1e` · bond `#e2d7bd` · bag `#d9cbb0`, ink `#8a3b25` · baking paper `#ceb284`, ink `#3f5a3f` |
| A Letter Not Sent | Library label `#e0d3b1`, stamp pad violet `#5c3e80` · airmail `#c8cfcc`, pen `#1f2a52` · music paper `#e4d9be` · telegram form `#d9caa6`, print `#8c4030` · tape `#e8dfc9` |

<details><summary>Tokens</summary>

```yaml
colors:
  newsprint: "#eae3d0"
  news-ink: "#1a1917"
  magazine: "#e2e1db"
  book: "#f3ebd5"
  handbook: "#d6e2cd"
  receipt: "#efeadc"
  blue-pencil: "#2d58b4"
  timetable: "#ebe3cd"
  timetable-navy: "#2a3d5c"
  timetable-red: "#a23a2c"
  ticket: "#e5ab90"
  postcard: "#e9dfc8"
  leaflet: "#e4d8a8"
  india-paper: "#e8dec4"
  index-card: "#ece5d2"
  kraft: "#b78f61"
  bond: "#e2d7bd"
  bag: "#d9cbb0"
  baking-paper: "#ceb284"
  library-label: "#e0d3b1"
  stamp-violet: "#5c3e80"
  airmail: "#c8cfcc"
  music-paper: "#e4d9be"
  telegram-form: "#d9caa6"
  tape: "#e8dfc9"
```

</details>

## Typography

Each paper is set the way that paper was set.

| Paper | Family | Use |
|---|---|---|
| Newsprint, book page, ticket, tides, bag, labels, score | Old Standard TT 400, 400 italic, 700 | Headlines, body, small print |
| Magazine | Bodoni Moda 500 italic | The pull quote |
| Handbook | Jost 500, 700 | Instructions and section head |
| Receipt | Courier Prime 400 | Till print |
| Timetable | Barlow Condensed 500, 600 | Times and the last crossing |
| Leaflet, postcard heading | Work Sans 400, 500 | Tourist leaflet, the printed POST CARD |
| Postcard | Homemade Apple | Pen |
| Recipe card | Reenie Beanie | Soft pencil |
| Shop notice, library stamp | Special Elite | Typewriter, rubber stamp |
| Flour sack | Stardos Stencil 400, 700 | Stencil |
| Airmail | La Belle Aurore | Pen |
| Telegram tape | Cutive Mono | Teleprinter |

The notes beside an opened pile use Old Standard TT for the title, the gallery's sans for the rest.

<details><summary>Tokens</summary>

```yaml
typography:
  headline:
    fontFamily: Old Standard TT
    fontWeight: 700
    fontSize: 17px to 27px
  pull-quote:
    fontFamily: Bodoni Moda
    fontStyle: italic
    fontSize: 18.5px
  last-line:
    note: every slip's last line is set a size larger than the rest of it, so the sentence can be read down the edge
```

</details>

## Layout

Each pile sits in a 380 × 280 box of its own. Scattered, every slip has swung round its own pivot by up to about 25 degrees either way, the top one only by two or three. Squared up, every slip is slid down until 29 units of it clear the one above, so each shows exactly its last line; the slips keep a slight lean and are not quite aligned.

The piles sit two by two, each turned a degree or two: on a wide screen the desk is 1000 × 600, narrower than 400px, on a phone, it is 760 × 620.

<details><summary>Tokens</summary>

```yaml
spacing:
  pile: 380px x 280px
  line-showing: 29px
  board-wide: 1000px x 600px
  board-narrow: 760px x 620px
  narrow-breakpoint: 400px
```

</details>

## Elevation & Depth

Paper on paper: each slip casts one close soft shadow. The magazine is stiffer and casts a deeper one to one side. Thin papers, newsprint, India paper, airmail and baking paper, let what lies under them show through; squared up they are a little more opaque, so the sentence reads cleanly.

## Shapes

No two papers share an edge. Newsprint tears with a slow wobble and fine fray and a pale broken rim; the magazine and timetable are cut straight; the book page has a soft deckle; the handbook keeps the round bites of its perforation; the receipt has the saw of the tear bar at both ends; the ticket and postcard show their core; the leaflet tears almost straight along its fold; India paper pulls out in long fibres; kraft tears deep; baking paper snaps in little steps; the telegram tape is cut on a slant.

## Components

### The desk

Four piles, lying finished and scattered. Under the cursor a pile squares itself up, slip by slip, so its sentence can be read on the desk; it falls loose again when the cursor leaves. Nothing moves on its own.

### Full size

Click a pile and it opens over the dimmed page, with notes beside it on a wide screen and under it on a phone. It squares itself up: from the bottom of the pile to the top, each slip slides and turns into place, about a tenth of a second after the one under it. Replay scatters it and squares it up again; Prev and Next go to the other piles; closing puts it back scattered. With reduced motion an opened pile is shown squared at once.

## Do's and Don'ts

- Do let every paper come apart its own way, and carry only what that paper would carry.
- Do write every line ourselves. Weir and everything in it is invented.
- Do keep the sentence off the notes; it is read off the paper.
- Don't add decorations that mean nothing: pins, holes, stains, patterns.
- Don't use pure white or flat blocks of colour for paper.

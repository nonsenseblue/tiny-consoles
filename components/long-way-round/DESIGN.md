---
version: alpha
name: Long Way Round
description: Three posters for an imagined New Zealand drinks house that sends its drinks and wine out like post; open any one and its brand book comes up, twelve landscape pages turned one at a time.
---

# Long Way Round

## Overview

Long Way Round is a drinks house that does not exist: six fruit drinks in cans and bottles, three wines, and the paper things that travel with them. The name means taking the long road, and the story is that every bottle arrives like a letter sent from far away.

On the board hang three posters, one flat colour each, gold, bottle green and cherry, with one large hand-drawn fruit on linen-textured paper and a black foot that runs a dotted line from New Zealand to your table. Click any one and the brand book opens over the page, one landscape A4 page at a time: cover, story, logo, the six drawings, the wines, the drinks in cans and in bottles, the wine box, the packaging, the small things that come with it, the table, and a green back cover. Dots under the page turn it, and a small arrow plays the page again.

Every page is built the way the label is built: the wordmark and number at the head between dotted rules, one large name, one picture in the middle over a loose patch of dotted colour, and the facts along the foot in three columns.

## Influences

| Source | What Long Way Round takes from it |
|---|---|
| Postage stamps and their perforated edges | The stamp-cut label, the stamp seal on the mailer, the fridge magnet. |
| Letterpress on thick uncoated stock | One black ink, slightly heavy, on cream board; no gloss, no foil gradients. |
| Halftone screens in cheap colour printing | The single patch of dotted colour behind every drawing and photograph, never a flat fill. |
| Product photography on stone and linen | Soft daylight, one object per photograph, never a studio white. |

The drinks, the drawings, the words and the photographs are all our own.

## Colors

One paper, one ink, one gold, one green, and six fruit colours that only ever appear as dots.

| Role | Hex | Use |
|---|---|---|
| Paper | `#F0EEE8` | Every page |
| Ink | `#1D1C1A` | Type, rules, drawings |
| Capsule gold | `#C9A04E` | The sun on the cover, the dotted patch behind the sun and the logo page |
| Bottle green | `#4F6A2E` | The back cover, one of the logo page's grounds |
| Apple | `#D77566` | Dots only |
| Feijoa | `#86A96F` | Dots only |
| White grape | `#D6B862` | Dots only |
| Cherry | `#8E3B46` | Dots only |
| Pear | `#B7BF6A` | Dots only |
| Strawberry | `#E09A96` | Dots only |

<details><summary>Tokens</summary>

```yaml
colors:
  paper: "#F0EEE8"
  ink: "#1D1C1A"
  muted: "#8A867D"
  gold: "#C9A04E"
  green: "#4F6A2E"
  apple: "#D77566"
  feijoa: "#86A96F"
  white-grape: "#D6B862"
  cherry: "#8E3B46"
  pear: "#B7BF6A"
  strawberry: "#E09A96"
```

</details>

## Typography

| Style | Family | Size on the page | Use |
|---|---|---|---|
| Wordmark | Jost 500, tracking −3.5% | 24 to 150px | long way round, the o replaced by a hand-drawn spiral sun; often set in three lines |
| Headline | Cormorant Garamond 400, a few letters in italic | 40 to 96px | Page titles, drink names |
| Body | Cormorant Garamond 400 | 15.5px, 1.55 line height | The short paragraphs |
| Small | IBM Plex Mono 400 | 11px | Numbers, field names, the foot of every page |

The pages are drawn at 1123 × 794.

<details><summary>Tokens</summary>

```yaml
typography:
  wordmark:
    fontFamily: Jost
    fontWeight: 500
    letterSpacing: -0.035em
  headline:
    fontFamily: Cormorant Garamond
    fontWeight: 400
  body:
    fontFamily: Cormorant Garamond
    fontSize: 15.5px
    lineHeight: 1.55
  small:
    fontFamily: IBM Plex Mono
    fontSize: 11px
```

</details>

## Layout

Every page is 1123 × 794 with a 64px margin. The head sits at the top between the wordmark and a dotted rule; the foot is a dotted rule over three columns, 470, 290 and 235 wide, split by short dotted uprights. Pictures sit between the two, never across the rules.

The page is scaled as one object to the width it is given. The dots and the replay arrow sit centred under it.

<details><summary>Tokens</summary>

```yaml
spacing:
  page: 1123px x 794px
  margin: 64px
  foot-columns: [470px, 290px, 235px]
  tile-gap: 10px
```

</details>

## Elevation & Depth

The page casts one soft shadow on the gallery paper. Nothing inside it is raised: photographs sit flat, and the dotted patch peeks out from behind them as if printed a little out of register. On pointer devices the photographs and the dotted patches drift a few pixels against each other as the pointer moves.

## Shapes

Photographs are cut to soft irregular shapes, never arches, never perfect circles, or set in a tight grid of rounded tiles on the small things and table pages. The dotted patches are irregular too, each a little different. The only straight-edged things are the page, the rules and the tiles.

## Components

### The posters

The three posters rise one after another once the board is on screen, and each fruit draws itself in from the left. The dotted line in the foot keeps walking and the small sun turns slowly. Hovering a poster lifts it a little and draws its fruit again.

### Opening the book

Any poster opens the book in a dialog over a dimmed, blurred page, at its first page. A round Close sits top right; Esc or a click outside also closes it.

### Turning

Twelve dots under the open book, one per page; the current one is light, the rest are dim. The arrow after them plays the current page again. Inside the book the arrow keys turn its pages and do not reach the gallery.

### A page setting itself

When a page opens, the rules print across from the left, the headline rises, the photographs and patches come in, single-line drawings draw themselves, and the foot types in letter by letter. The cover's sun draws its spiral and then its rays. The first page waits until the piece is on screen.

### Answering the pointer

The sun on the cover and the back turns toward the pointer and spins once when tapped. On the logo page the three small swatches in the foot change the ground between cream, black and bottle green. On the drawings page and the wine box, hovering a drawing makes it draw itself again. On the packaging page, tapping a small box swaps it with the large one.

### Reduced motion

With `prefers-reduced-motion`, the posters and every page show finished; nothing rises, draws, types or drifts. The dots still turn the pages.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Keep one picture idea per page | Crowd a page with every photograph |
| Show colour only as dots | Use flat fills of the fruit colours |
| Cut photographs to soft irregular shapes | Use arches or perfect circles |
| Keep the label's three-column foot on every page | Add swatch rows or stray labels |

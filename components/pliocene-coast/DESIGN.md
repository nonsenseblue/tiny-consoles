---
version: alpha
name: Pliocene Coast
description: A torn paper collage of what the Galactic Railroad might have left in the ground; bone chips that crumble into powder when touched, feathers falling onto a river.
---

# Pliocene Coast

## Overview

Not a picture of *Night on the Galactic Railroad*, but what the journey might have left behind in the ground, dug up without knowing what it was for. Torn and cut paper, laid over each other into one collage: a sand of stars, bone chips, a dark hole with a piece of amber at its floor, a railway that winds out from one point and breaks off, strata, a small fossil section, feathers falling, and a river along the bottom.

Nothing is labelled and no line of the book appears. The places are only hinted at by shape:

| In the collage | In the book |
|---|---|
| Bone chips and the strata strip | The Pliocene Coast, where a professor digs out the bones of an ancient ox |
| The sand of light dots, top left | The crystal sand of that coast, and the Milky Way as countless small lights |
| The big dark rings | The Coal Sack, the black hole in the sky near where Campanella is gone |
| The amber at its floor | The scorpion's fire, a body burning to light the dark |
| The railway that breaks off | The journey that cannot be finished |
| Small torn triangles by the line | The triangle markers lit along the track |
| Five dots on the middle sheet | The Northern Cross |
| A long blue grey river along the bottom, slit with ripples | The river Campanella goes into |
| The broken arcs on the river under the rings | The dark hole and its amber, reflected and cut up by the water |
| White feathers falling on the right, one afloat on the river | The birds the bird catcher gathers from the sky |
| The concentric scrap, lower right | A walnut fossil found on the shore |

When it comes into view everything moves at once for eight seconds and settles. After that nothing moves on its own; only what the pointer touches changes, and what it changes stays.

## Influences

| Source | What Pliocene Coast takes from it |
|---|---|
| Miyazawa Kenji, *Night on the Galactic Railroad* | The places above, used as shapes only. No text from the book. |
| Cut and torn paper collage | Shapes cut from papers that already carry a texture, laid over each other with only the paper's thickness for a shadow. |
| Screen print and cyanotype mood boards | Large single shapes, few colours, uneven ink, radial and concentric repetition. Our palette is our own: charcoal, blue grey and bone instead of blue and white. |

## Colors

Almost black and dusty blue greys, bone white, a paper cream. Amber is the only warm colour and appears in one place.

| Role | Value |
|---|---|
| Ground sheets | `#1a1c1f`, `#202327`, `#151617` |
| Blue greys | `#2b3138`, `#38424c`, `#4c5763`, `#5a6672` |
| Bone | `#e2dac9` |
| Paper | `#dcd4c3` |
| Amber, outside to inside | `#7e4512`, `#a8621c`, `#cf8a2c`, `#e9b25a`, `#f6dca0` |

<details><summary>Tokens</summary>

```yaml
colors:
  ground: "#1a1c1f"
  groundSecond: "#202327"
  ink: "#151617"
  greyDeep: "#2b3138"
  greyMid: "#38424c"
  grey: "#4c5763"
  greyLight: "#5a6672"
  bone: "#e2dac9"
  paper: "#dcd4c3"
  amberEdge: "#7e4512"
  amber: "#cf8a2c"
  amberLight: "#f6dca0"
```

</details>

## Typography

The collage has no text. The notes in the full size view set the title, Nokto de la Galaksia Fervojo, in EB Garamond 500, and the rest in the gallery's Inter. The title is in Esperanto, as everything written on screen is in the 1985 film.

## Layout

One collage drawn at 1560 × 820 and scaled to the width it is given. The outline is not a rectangle: two dark sheets step down from left to right on the page's own paper, the strata strip stands above them, a third dark sheet with the feathers sits on the right, the rings sit across the bottom, and a thin river strip runs under everything along the foot, its top edge torn uneven.

<details><summary>Tokens</summary>

```yaml
spacing:
  board: 1560px x 820px
  ratio: 0.53
```

</details>

## Elevation & Depth

Every piece of paper has a close shadow the size of its thickness (0.6px across, 1.4px down, 1.1px blur). No other depth.

## Shapes

Torn edges everywhere, never a clean cut. Ink on paper is printed: slightly displaced and with small gaps. Amber is a rounded pebble painted in layers, with bubbles, a crack, a dark speck and a hand drawn outline. Feathers are long and pointed with one nick in the vane, and a tapering quill that runs past the base. No sticker shapes, no icons.

## Components

### The paper layer

All still paper is baked into `assets/collage.webp` (3120 × 1640, transparent around the outline) so the page shows it at once. The moving parts are drawn over it from `assets/live.svg`, at the same coordinates.

### Coming into view

Eight seconds, all at once: the railway winds out from its first point and stops past the break, the smallest bone chip crumbles to nothing and the next one starts to, the powder falls and settles on the rim of the dark rings, the sand sinks a few pixels, the light inside the amber shifts and comes back. Then it rests.

### Touch

Leave the pointer on a bone chip and it wears away into powder that falls and heaps up on the rim; take the pointer away and it stops where it is. Nothing grows back. Near the amber, its inner light moves a pixel or two with the pointer. Nothing runs while the piece is still, or off screen.

With reduced motion the railway is shown whole, and nothing moves.

### Full size

Clicking the collage opens it over a dimmed page with no rectangle behind its torn edge, and notes beside it (under it on a phone) on the book, the 1985 film, and what each part of the collage stands for; the notes are our own words. It keeps working there: bone chips still crumble under the pointer. Replay puts everything back as it was before it came into view (chips whole, no powder, no railway) and plays the eight seconds again. There is only one piece, so there is no Prev or Next. Esc, Close or a click outside closes it.

## Do's and Don'ts

- Do keep it one collage of cut paper; don't add cards, grids or labels.
- Don't write any text on it, from the book or our own.
- Do keep amber to the one piece.
- Don't let anything loop; change only what was touched, and keep it changed.
- Don't draw literal things from the book (trains, birds, apples): hint by shape only.
- Don't stick small pieces flat on the open river; they read as stickers.

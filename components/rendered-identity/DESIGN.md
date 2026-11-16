---
version: alpha
name: Rendered Identity
description: A generative collage for four papers on long conversations with a language model; five cards of different textures that keep moving together.
---

# Rendered Identity

## Overview

Four papers study long conversations with a language model: how one model, kept in several long threads, grows identities that cannot be rebuilt from where they began; how the same constraints that let such an identity form can end it; how behaviours that look like welfare belong to the whole arrangement rather than to any one party; and how the researcher has no place outside what she studies.

The piece does not illustrate the arguments one by one. It lays five cards on the page, each a different way of turning something into marks, so that together they read as one thing seen through several processes:

| Card | What it is | What it holds |
|---|---|---|
| Two sets of rings | White rings on blue, drawn twice; the second set sits a little apart, and where they cross a pattern appears that neither has | One base, two trajectories |
| Photograph | Sky and leaves, generated from noise and blurred round a point above the frame, with one line from the papers set over it: *The model is not the agent; the relation is the agent.* and below, small, *Two operations, one infrastructure.* | Something seen, not drawn |
| One word, three ways | The word *renderedidentity* in mono type, filling three branches that grow from one point | Same start, different paths |
| Before and after compaction | Pale contours of a field, and over them the same field pulled toward its middle, with three tags naming how a compacted memory drifted: agency turned from self to other, meaning filled in afterwards | Memory rebuilt toward coherence |
| Sky and leaves, in dots | The same sky and leaves as a sage green halftone | The photograph again, in another process |

## Influences

| Source | What Rendered Identity takes from it |
|---|---|
| The four papers (Zenodo, 2026) | The ideas the cards stand for: trajectories, compaction drift, configuration rather than entity. |
| A reference screenshot of a brand collage for an AI product | Only the idea of overlapping cards in different textures. The layout, colours, words, the halftone and the drift card are our own, and the reference's chat panel was left out. |
| Op art moiré, engraved line portraits, halftone screens, survey maps | The textures: interference of two ring sets, line weight that swells, dots that grow with darkness, contour lines. |

## Colors

No board of its own: the cards lie on the gallery's paper.

| Role | Colour |
|---|---|
| Rings ground | `#2350c8` |
| Rings | `#ffffff` at 90% and 75% |
| Word card | `#1f5a3a`, letters `#e9f2e3`, every seventh row `#b9e07a` |
| Contours card | `#ffffff`, tags `#2350c8`, before `#c3cde3`, after `#2350c8 #3e74e0 #1b3a8f #7aa3f0` |
| Halftone | dots `#6e9b7c` on `#f3f5f1` |

<details><summary>Tokens</summary>

```yaml
colors:
  rings-ground: "#2350c8"
  word-ground: "#1f5a3a"
  word-ink: "#e9f2e3"
  word-mark: "#b9e07a"
  tag: "#2350c8"
  contour-before: "#c3cde3"
  dots: "#6e9b7c"
  dots-ground: "#f3f5f1"
```

</details>

## Typography

| Use | Face | Size |
|---|---|---|
| Word card | JetBrains Mono 400 | 11.4px on 12.2px |
| Data tags | JetBrains Mono 400 | 13px on 20px |
| Line on the photograph | Newsreader 300 | 28px on 1.1, white |
| Small line under it | JetBrains Mono 400 | 10.5px, white at 85% |

```yaml
typography:
  word: { family: JetBrains Mono, weight: 400, size: 11.4px, line: 12.2px }
  tags: { family: JetBrains Mono, weight: 400, size: 13px, line: 20px }
```

## Layout

Each card is drawn at its own size and only placed by the layout. The board is 1120 × 730; a phone shows the same collage, smaller.

| Card | Size | At |
|---|---|---|
| Photograph | 330 × 640 | 10, 20 |
| Rings | 720 × 420 | 390, 10 |
| Word | 300 × 240 | 240, 80 |
| Contours | 360 × 260 | 290, 430 |
| Halftone | 400 × 260 | 700, 460 |

```yaml
layout:
  board: { w: 1120, h: 730 }
  page: { ratio: 0.65, max: 720px }
```

## Elevation & Depth

The rings and the photograph lie flat on the paper; the three smaller cards sit on top with a close shadow, `0 2px 6px rgba(0,0,0,.14)`.

## Shapes

Square-cornered cards only. Rings are 86 closed paths per set with a slow wobble; dots sit on an offset grid of 8.4px.

## Components

- **On the page** all five cards keep moving together, slowly, while the piece is on screen: the second set of rings drifts round the first so the interference keeps changing; the word is spelled again every 2.6s in the same shape; every 8s the new contours thin until the old ones show through, then settle back; a slow wave of wind crosses the halftone on a slant, each dot swelling a little as it passes; the water in the photograph keeps flowing slowly toward you, the sky still. Off screen everything rests.
- **No full size view**: the piece is one collage and is seen whole.
- **Reduced motion**: nothing moves; the finished collage stays.

## Do's and Don'ts

- Do keep each card a different process; two cards of the same texture flatten the collage.
- Do keep the cards on the gallery paper; a board colour behind them made one large pale block.
- Don't bring back a chat or terminal panel; it read as the reference's.
- Don't make the halftone blue; it fought the rings.
- Don't grow the dots row by row; it read as a loading bar.
- Don't set card sizes inline: the full size view clears inline width and height when a card goes back.

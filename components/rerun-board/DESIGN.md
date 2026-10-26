---
version: alpha
name: Rerun
description: An identity board for an imagined institute that runs the same small life again and again, built from rounded cells that grow, clear and grow back almost the same.
---

# Rerun

## Overview

Rerun is an invented institute. It takes one cell, gives it one rule and one seed, and lets it grow for eight minutes. Then it clears everything and runs it again. Every run is registered, numbered and almost identical to the last.

The board shows the institute's identity as one object in five tiles: a record card front and back, a poster, the mark, and an attempt label. It borrows the Swiss layout of Soundings, a strict grid and small labels, and fills it with saturated colour and living pixels. The tone is calm and slightly absurd: a clean, official system that keeps measuring something it can never quite repeat.

## Influences

| Source | What Rerun takes from it |
|---|---|
| *Gattaca* (1997) | A world where life is registered at birth and judged by its sequence. The record card, the subject number and the word *Valid* come from that cold, orderly mood. |
| *Source Code* (2011) | The same eight minutes, lived again and again. The countdown, the run number and the attempt counter that never ends. |
| Conway's Game of Life | Cells on a grid that grow by simple local rules. The colonies here are its soft, rounded cousins. |
| Liquid pixel identities | Brand systems built from one rounded module that fuses with its neighbours. Rerun keeps the method and none of the look: its own colours, layout and words. |
| Swiss Style | The grid drawn on the record card, flush-left labels, small uppercase keys, and type that hangs from lines. |

## Colors

Vermilion and wine carry the board. A pale paper and a soft pink give it room to breathe.

| Role | Colour | Use |
|---|---|---|
| Vermilion | `#ff4b2b` | The poster, the colonies on the light tiles, the *Valid* status |
| Wine | `#3a0b10` | Type, the colony on the poster, the mark, the attempt label |
| Paper | `#f4efe6` | The record card, front and back |
| Pink | `#ffd2c6` | Behind the mark; type on the wine label |
| Muted | `#c98b80` | Secondary type on wine, the infinity sign |
| Soft | `#8a5a52` | Labels and keys on light tiles |
| Hairline | Wine at 16% | Grid lines on the record card |

<details><summary>Tokens</summary>

```yaml
colors:
  primary: "#ff4b2b"
  secondary: "#3a0b10"
  neutral: "#f4efe6"
  pink: "#ffd2c6"
  muted: "#c98b80"
  soft: "#8a5a52"
  hairline: "#3a0b1029"
```

</details>

## Typography

Two families. A serif for names and numbers that should feel human, a plain sans for everything the system says. Sizes scale with the board's width; values below are at a 1080px board, with the fixed phone sizes in brackets.

| Style | Family | Size | Use |
|---|---|---|---|
| Headline | Instrument Serif | 3.6% of the board (38px) | "Small things, run again." |
| Attempt | Instrument Serif | 5.2% (52px) | "013 / ∞" |
| Wordmark | Instrument Serif | 2.3% (20px) | "Rerun" |
| Subject | Instrument Serif | 2.4% (22px) | "No. 013" |
| Body | Inter, tabular figures | 0.82% (10px) | Captions, clock, sequence |
| Key | Inter, uppercase, 0.06em | 0.64% (8px) | SUBJECT, LOOP, STATUS, ATTEMPT |

<details><summary>Tokens</summary>

```yaml
typography:
  headline:
    fontFamily: Instrument Serif
    fontSize: 38px
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: -0.01em
  attempt:
    fontFamily: Instrument Serif
    fontSize: 52px
    fontWeight: 400
    lineHeight: 1
  wordmark:
    fontFamily: Instrument Serif
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: '"tnum" 1'
  key:
    fontFamily: Inter
    fontSize: 8px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0.06em
```

</details>

## Layout

| Column | Top | Bottom |
|---|---|---|
| Left | Record card front, 1.64 : 1 | Record card back, 1.64 : 1 |
| Middle | Poster, the full height of both cards | |
| Right | Mark | Attempt label |

The board is about 2.4 times as wide as it is tall. Below 560px it becomes one column, each tile at its own shape. On the record card back, two horizontal and three vertical hairlines are drawn and every line of text starts on one of them. Colonies never grow under text: every caption has a clear zone around it.

<details><summary>Tokens</summary>

```yaml
spacing:
  board-gap: 1%
  tile-inset: 7%
  card-ratio: 1.64
  narrow-breakpoint: 560px
```

</details>

## Elevation & Depth

Flat. No shadows and no rounded tiles. Depth comes only from the cells: full-grown cells fuse into a body, cells at the frontier stay small and separate, like a colony seen under glass.

## Shapes

Tiles have square corners. Every cell is a rounded square with a 30% corner radius, drawn at 78% of its grid step. Neighbours that are both full grown join through a neck 60% of their width, so each cell still reads on its own. The mark is the same rule at rest: one large cell, its four nearest neighbours, and four smaller cells on the diagonals.

<details><summary>Tokens</summary>

```yaml
rounded:
  tile: 0px
  cell: 30%
```

</details>

## Components

### Colony

A grid of cells over a noise field. Cells nearer the origin corner want to grow more, and each cell is reached at a time set by its distance from that corner. Full-grown cells breathe very slightly. Under the cursor, nearby cells sprout and then fade back over about eight seconds.

### Run

The poster's clock shows eight minutes but runs in one. At zero, every colony shrinks away, the board stays empty for a moment, and the next run begins. The run, subject and attempt numbers all advance together. Each run adds a faint, run-specific variation to the same field, so the new colony is almost, never exactly, the last one.

### Record card

Front: the wordmark, "Same rule. Same seed.", and a small vermilion colony. Back: the drawn grid, the mark, the subject number, a short sequence, the loop length and a status.

### Attempt label

Wine, with the attempt number large in serif over an infinity sign, and a vermilion colony growing in from the upper right.

With reduced motion, the board is drawn once, fully grown, and the clock stays at 08:00.

<details><summary>Tokens</summary>

```yaml
components:
  poster:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.secondary}"
    typography: "{typography.headline}"
    rounded: "{rounded.tile}"
  record-card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.wordmark}"
    rounded: "{rounded.tile}"
  mark:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.secondary}"
  attempt-label:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.neutral}"
    typography: "{typography.attempt}"
```

</details>

## Do's and Don'ts

- Do keep to vermilion, wine, paper and pink.
- Do let the system speak in numbers, sequences and statuses, never in personal details.
- Do keep every caption clear of cells.
- Don't use photographs, gradients or shadows.
- Don't let cells fuse into flat blocks; a neck should always show where one cell meets the next.
- Don't borrow another brand's colours, layout or slogans. Rerun is fictional; its mark, names and lines are its own.

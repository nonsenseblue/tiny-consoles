---
version: alpha
name: Claim Check
description: A repair ticket, a laundry slip and two tags, left at the counters in one week and gathered into a small stack; open one and it is filled in again until the day is circled by hand.
---

# Claim Check

## Overview

The slips you are handed when you leave something to be mended or cleaned, and need to come back for. Four of them, from four invented shops, gathered into one small stack: a repair ticket for a pocket watch, a laundry slip with its carbon copy and a stub to tear off, and two tags, one for a knife to be sharpened and one for trousers to be taken up.

Each is a printed form with something written into it. The form is printed: small capitals, fine rules, ink that did not quite take everywhere. What is written is typewriter, or carbon. On every slip one day is circled by hand, the day to come back.

The stack lies finished. Open one full size and it is filled in again, field by field, and the circle is drawn last.

## Influences

| Source | What Claim Check takes from it |
|---|---|
| The invitation Song for the Mute sent for its first concept store (Sydney, 2022), printed as a repair and cleaning docket | The idea of a form that is mostly ruled boxes, written in with a typewriter, with one day circled by hand. Our shops, fields, words, palette and type are our own. |
| Shop tags, sold by number | The tags keep to a real size, the No. 3 tag, about 9.5 × 4.8 cm, and the other slips are sized against it. |
| Duplicate books with carbon paper | The laundry slip is the copy underneath: everything on it written in violet, a little blurred, and a perforation above the stub. |

## Colors

Each slip has its own paper, one ink and one accent.

| Slip | Paper | Ink | Accent |
|---|---|---|---|
| Repair ticket | Card `#ecebe5` | `#1b1a19`, rules `#2a2926` | Moss green stamp `#47652f`; the circle in pen `#24221f` |
| Laundry slip | Thin pink copy paper `#efdcd5` | `#3a2326` | Carbon violet `#4b3f8c` for everything written and the circle |
| Tags | Grey tag stock `#dcdfe0` | `#20262a` | Orange crayon `#d0661f` for the circle |

The stack lies straight on the gallery's own paper. There is no table under it.

<details><summary>Tokens</summary>

```yaml
colors:
  card: "#ecebe5"
  copy-paper: "#efdcd5"
  tag-stock: "#dcdfe0"
  ink: "#1b1a19"
  slip-ink: "#3a2326"
  tag-ink: "#20262a"
  stamp: "#47652f"
  pen: "#24221f"
  carbon: "#4b3f8c"
  crayon: "#d0661f"
```

</details>

## Typography

Two voices: what was printed, and what was written.

| Style | Family | Size on a slip | Use |
|---|---|---|---|
| Written | Cutive Mono 400 | 12.5px | Everything filled in |
| Number | Cutive Mono 400 | 22 to 64px | Ticket and tag numbers, the stub's 47 |
| Label | Archivo 500, capitals | 7px, +12% tracking | Field names, days, column heads |
| Shop | Archivo 600, capitals | 9 to 15px, wide tracking | Shop names |
| Fine print | Archivo 400, capitals | 6 to 6.5px | Conditions at the foot |

Sizes are at each slip's own design size: ticket 600 × 342, slip 330 × 430, tag 300 × 140.

<details><summary>Tokens</summary>

```yaml
typography:
  written:
    fontFamily: Cutive Mono
    fontSize: 12.5px
  label:
    fontFamily: Archivo
    fontWeight: 500
    fontSize: 7px
    letterSpacing: 0.12em
    textTransform: uppercase
```

</details>

## Layout

The slips keep to real proportions against each other: the tag about 9.5 cm, the ticket about 15 cm, the slip about 10 by 13. In the stack the laundry slip lies over the left of the ticket, leaving its number showing, and the two tags fan over the ticket's lower right.

The board is 1640 × 690 on a wide screen, with the stack drawn larger in the middle of it. Narrower than 620px the board is cut close to the stack, 690 × 476, so the slips stay readable on a phone. Either way the board is scaled as one object to the width it is given.

<details><summary>Tokens</summary>

```yaml
spacing:
  board-wide: 1640px x 690px
  board-narrow: 690px x 476px
  narrow-breakpoint: 620px
  ticket: 600px x 342px
  slip: 330px x 430px
  tag: 300px x 140px
```

</details>

## Elevation & Depth

Paper lying on paper: each slip casts one close, soft shadow, and nothing else. The tags are punched right through, so the page shows through the hole, and a paper washer is glued round it.

Every paper has a tooth, a fine matte texture lit from the top left with a few dark specks, coarser on the tag stock than on the card, finest on the thin copy paper.

## Shapes

The ticket and slip are plain rectangles. The tags have both left corners cut off. The laundry slip has a line of perforation between the shop's copy and the stub. The hand drawn circles are never round: a little tilted, flatter on one side, and the line runs on past where it started.

## Components

### Writing

On the ticket and the tags, the number comes first, then every field types in, one character at a time, in reading order, while the space it will take is already held. On the laundry slip, each field comes up through the carbon, from blurred to as sharp as carbon gets.

### Circling

The day is circled last, in one stroke: pen on the ticket, carbon on the slip, crayon on the tags. On the ticket the stamp comes down after the circle, with a short knock.

### The stack

All of it lies finished. Click the ticket, the slip or the two tags, which lie together and open together, and it opens and is filled in again from the start. Everything opens at one real scale, the one at which the laundry slip fits the screen, so the tags stay small against the ticket as they are in the hand. Prev and Next go to the others, each filled in as it opens; Replay starts it again; closing puts it back finished. A slip lifts a little when the cursor is over it, and its day is circled again, in one stroke; the ticket is stamped again too. With reduced motion, an opened slip is shown finished.

## Do's and Don'ts

- Do keep printed things in the sans and written things in the typewriter face.
- Do give each slip one paper, one ink and one accent.
- Do keep the slips to real sizes against each other.
- Don't let a circle be round or closed neatly.
- Don't put real names, addresses or numbers on a slip. The shops and the people are invented.
- Don't borrow another site's palette, type or wording.

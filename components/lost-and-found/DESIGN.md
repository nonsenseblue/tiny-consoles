---
version: alpha
name: Lost and Found
description: Four sheets from the register of an imagined lost property office, left on a desk, that write and stamp themselves one by one.
---

# Lost and Found

## Overview

An imagined lost property office at a small station keeps a register: an index of everything it holds, one file per item, a ledger written in order of arrival, and a claim slip for whatever goes home. The piece lays four of those sheets on a desk, slightly askew and overlapping, as if the binder had just been opened.

Each sheet is a printed form with something written into it. Opened full size, the form is there from the start; what was written arrives as if typed, then a highlighter goes over what matters and a stamp comes down. The tone is quiet and a little tender: an office that writes everything down carefully and asks for no names.

## Influences

| Source | What Lost and Found takes from it |
|---|---|
| Dossier-style personal sites | Building a page as a binder: punched holes, file tabs, labelled boxes and small official print. Lost and Found keeps the idea and none of the look: its own colours, type, layout and words. |
| Lost property registers and carbon forms | Numbered entries, a drawer and a holding date for each thing, a ledger where mistakes are struck through once and written again, a claim slip with a tear line. |
| Dot-matrix printers and LED boards | The large numbers and titles, drawn in round dots from a 5 × 7 grid. They share the dot of the gallery's own mark. |
| Typewritten records | A monospaced face for everything written in, set slightly heavier than the printed labels around it. |

## Colors

Each sheet has its own paper, in the way offices file different forms on different colours. Every sheet uses its paper, one ink and one accent, and nothing more.

| Sheet | Paper | Ink | Accent |
|---|---|---|---|
| Index | Warm grey `#dedbd3` | `#1c1c1a` | Vermilion `#ff4b2b` for the open filter, the key row and *Released* |
| File | Cool grey `#cfd2d3` | `#1a1e24` | Indigo `#2a3b9c` for the stamp and highlighter |
| Ledger | Grey `#c8cacb` | `#151515` | Fluorescent yellow `#e8f23a` highlighter |
| Released | Indigo `#24306e` | `#e8e8e2` | Vermilion `#ff6a4a` stamp on a white slip `#f1efe9` |

Tabs are the sheet's own paper, a shade darker for each tab further back. On the indigo sheet they are white with indigo text.

<details><summary>Tokens</summary>

```yaml
colors:
  index-paper: "#dedbd3"
  file-paper: "#cfd2d3"
  ledger-paper: "#c8cacb"
  released-paper: "#24306e"
  slip: "#f1efe9"
  vermilion: "#ff4b2b"
  indigo: "#2a3b9c"
  fluorescent: "#e8f23a"
  ink: "#1c1c1a"
```

</details>

## Typography

Three voices. The dot type for numbers and titles, a typewriter face for whatever was written into the form, and a small sans in capitals for the printed labels.

| Style | Family | Size on a sheet | Use |
|---|---|---|---|
| Dot title | Own 5 × 7 dot grid | Dots 5px across | INDEX, LEDGER, file numbers |
| Entry | Courier Prime 400 | 10.5px | Everything written into the forms |
| Entry, strong | Courier Prime 700 | 11px | Item names in the index, stamps |
| Label | Inter 500, capitals | 6.5px, +12% tracking | Box labels, column heads, tabs |
| Fine print | Courier Prime 400, capitals | 7px | The office's rules at the foot of a sheet |

Sizes are at the sheet's design size, 560 × 760. The whole desk scales as one object.

<details><summary>Tokens</summary>

```yaml
typography:
  entry:
    fontFamily: Courier Prime
    fontSize: 10.5px
    lineHeight: 1.3
  label:
    fontFamily: Inter
    fontWeight: 500
    fontSize: 6.5px
    letterSpacing: 0.12em
  fine:
    fontFamily: Courier Prime
    fontSize: 7px
    letterSpacing: 0.03em
```

</details>

## Layout

On a wide desk the four sheets lie in a row, each turned a degree or two and overlapping the next by a little. On a desk narrower than 620px they lie in two rows of two. The desk is drawn at a fixed design size, 2140 × 880 wide or 1180 × 1680 narrow, and scaled to the width it is given.

Inside a sheet, a left margin holds three punched holes. Everything else hangs from rules: a full-weight rule under the header, hairlines between boxes, dashed lines where a form is meant to be written on.

<details><summary>Tokens</summary>

```yaml
spacing:
  sheet: 560px x 760px
  sheet-margin-left: 58px
  sheet-margin: 26px
  narrow-breakpoint: 620px
```

</details>

## Elevation & Depth

Paper on a desk: each sheet casts one soft shadow, and the sheet being written is lifted to the top. The tabs have a faint highlight along their top edge and a darker foot where the sheet in front presses on them. The claim slip is held down by one strip of torn paper tape.

## Shapes

Sheets have barely rounded corners. Tabs are trapezoids with sloped sides that overlap their neighbours. Stamps are rounded rectangles with a worn, uneven print. The claim slip has a torn, zigzag foot.

## Components

### Writing

The dot numbers light up from left to right. Then every entry types in, one character at a time, in reading order, while the space it will take is already held so nothing on the sheet moves. Pictures are scanned in from the top as their row is written.

### Marking

When a sheet is written, the highlighter goes across the lines that matter, left to right, with ragged edges and streaks from the felt tip. On the slip, the signature draws itself.

### Stamping

Small status stamps come down first, then the large stamp, with a short knock that shakes the sheet by a pixel.

### The desk

The four sheets lie finished on the desk. Click one and it opens full size and is written again from the start: numbers, entries, highlighter, signature and stamps. Prev and Next go to the other sheets, each written as it opens; closing puts it back finished. A sheet lifts when the cursor is over it, and its tabs bring it to the top. With reduced motion, an opened sheet is shown finished.

## Do's and Don'ts

- Do give each sheet one paper, one ink and one accent.
- Do keep everything written in the typewriter face and everything printed in the small sans.
- Do let a mistake be struck through and written again, never erased.
- Don't put names, addresses or any personal details on a sheet. The office asks only for a description of the thing.
- Don't add more colours to a sheet, or gradients beyond the paper's grain.
- Don't borrow another site's palette, type or wording. The office, its forms and its words are invented.

---
version: alpha
name: Day for Night
description: Four sheets of French New Wave paperwork whose English subtitles and production notes do not quite agree with the French.
---

# Day for Night

## Overview

Four sheets from the cutting room of an imagined New Wave production: a subtitle file, a contact sheet, a page of script and a shooting note. The French on the surface is what was said. Something looks through each sheet, a lens, a playhead, a viewfinder or a dark note, and finds an English line that is close but wrong: the sea becomes a river, the end becomes a freeze frame, today's news becomes tomorrow's.

The tone is dry and a little playful, the way those films joke about what is staged and what is real. The layout is modern editorial type; the material, the faces and the grain belong to the late fifties and sixties. Each sheet opens full size on a click.

## Influences

| Source | What Day for Night takes from it |
|---|---|
| Truffaut, *Les Quatre Cents Coups* and *La Nuit américaine* | The run to the sea and the final freeze for the subtitle file; night shot in daylight under a blue filter for the shooting note. All lines are our own, none are quoted from the films. |
| Godard, *À bout de souffle* | Running on the Champs-Élysées, hand-held camera and jump cuts for the contact sheet; a newspaper seller and her lines for the script page. The reel is titled *À bout de course*, one word off the film. |
| Type experiments with a tiled title and a dark code panel (a reference she shared) | A title repeated across the page under a dark panel. Our panel holds a shooting note, not code, and the palette and text are our own. |
| Subtitle files, contact sheets, scripts and call sheets | Timecodes and cue numbers, numbered frames with a grease-pencil choice, centred dialogue with directions in italics, typed notes. |
| Godard's title cards in Antique Olive | The feeling of sixties French lettering. Antique Olive itself is not free, so the labels use Jost instead. |

## Colors

Each sheet has its paper, one ink and one bright accent, and no two sheets share an accent.

| Sheet | Paper | Ink | Accent |
|---|---|---|---|
| Subtitle file | `#fafaf8` | `#111111` | Orange `#ff5a1f`, the playing cue and the lens text |
| Contact sheet | `#0f0f0f` | `#e9e8e3` frames | Yellow highlighter `#f5d02a` |
| Script page | `#efeeec` | `#111111` | Blue viewfinder `#1d4cff` |
| Shooting note | `#fafaf8` | `#111111`, panel `#121212` | Green `#20c46b` |

A grain layer sits over every sheet, blended soft-light, and flickers a little like a projector.

<details><summary>Tokens</summary>

```yaml
colors:
  paper: "#fafaf8"
  contact: "#0f0f0f"
  script: "#efeeec"
  panel: "#121212"
  lens: "#0c0c0c"
  orange: "#ff5a1f"
  yellow: "#f5d02a"
  blue: "#1d4cff"
  green: "#20c46b"
```

</details>

## Typography

Three faces, each with one job.

| Style | Family | Size on a sheet | Use |
|---|---|---|---|
| Line | EB Garamond 400 | 40px / 24px / 22px | Subtitles, dialogue, frames, the tiled title |
| Direction | EB Garamond italic | 17px | Stage directions |
| Typed | Courier Prime 400 | 9.5 to 16px | Timecodes, notes, the English that shows through |
| Label | Jost 500, capitals | 12px, +14% tracking | Character names |

Sizes are at the sheet's design size, 520 × 520.

<details><summary>Tokens</summary>

```yaml
typography:
  line:
    fontFamily: EB Garamond
    fontSize: 24px
  typed:
    fontFamily: Courier Prime
    fontSize: 12px
    lineHeight: 1.6
  label:
    fontFamily: Jost
    fontWeight: 500
    fontSize: 12px
    letterSpacing: 0.14em
```

</details>

## Layout

Four square sheets in two rows of two, drawn at 1068 × 1068 and scaled to the width they are given. The same grid is used on phones; any sheet opens full size on a click.

<details><summary>Tokens</summary>

```yaml
spacing:
  sheet: 520px x 520px
  gap: 28px
  board: 1068px x 1068px
```

</details>

## Elevation & Depth

Paper lying on the page: one close soft shadow under each sheet, lifted by 6px on hover. Opened full size, the sheet sits over a dimmed, slightly blurred page.

## Shapes

Square sheets with straight corners. The lens is a circle, the viewfinder four corner brackets, the note a plain dark rectangle with a small green square at its corner.

## Components

### Subtitle file

A black lens drifts over the lines, or follows the pointer, and shows the English subtitles in orange. A pale band steps from cue to cue as if the file were playing.

### Contact sheet

A playhead runs along the nine frames; the frame it reads shows its own English. Once it has passed the take, the highlighter goes over "// garder". Under the pointer, the frame beneath it shows its English.

### Script page

The viewfinder settles on one line at a time and shows the subtitle under it, or goes to the line nearest the pointer.

### Shooting note

The dark note slides slowly over the tiled title, or is carried by the pointer, staying on the page. A green cursor blinks after "// garder."

### Full size

Clicking a sheet opens it over the page; the arrow keys go through the four, Esc or a click outside closes it. With reduced motion, every sheet shows one finished state and nothing moves.

## Do's and Don'ts

- Do keep one accent per sheet and never repeat it on another.
- Do keep the French true and let only what looks through it be wrong.
- Do write every line ourselves; don't quote dialogue from the films.
- Don't add personal details, names of real crew or anything that reads as a real document.
- Don't add colours, gradients or more faces beyond the three.

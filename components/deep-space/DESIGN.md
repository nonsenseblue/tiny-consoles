---
version: alpha
name: Deep Space
description: Six tiny 1-bit screens, each a space scene live-dithered through an 8x8 Bayer matrix, with spring parallax under the cursor.
---

# Deep Space

## Overview

Six square screens that look like they belong to a small, old, well-loved machine. Every scene is computed as a soft greyscale image and then forced into two colours, on or off, through an ordered dither. The result is grainy and exact at the same time: pixels you can count, arranged into suns, stars and planets.

The tone is playful but restrained. One ink, one void, monospaced captions, nothing else. The scenes move slowly and constantly, like a screensaver, and lean a little toward the cursor, as if the screen had depth behind the glass.

## Influences

| Source | What Deep Space takes from it |
|---|---|
| One-bit screens | Two colours and nothing between, like the first Macintosh and early handheld devices. Tone comes from pattern, not from grey. |
| Ordered dithering | The 8x8 Bayer matrix, a classic way to fake shades with on and off pixels. Its regular cross-hatch is the texture of the whole piece. |
| One-bit games | Games that chose dithering as a style rather than a limit, *Return of the Obra Dinn* being the best known. |
| Terminals and sci-fi interfaces | Uppercase monospace captions, numbered screens and a blinking cursor, as if a machine were printing its log. |
| Screensavers | Scenes that loop slowly and endlessly, meant to be looked at in passing. |

## Colors

Two colours only. Every pixel is one or the other, there are no greys on screen; the impression of grey comes from the dither pattern.

| Role | Colour | Use |
|---|---|---|
| Ink | `#f2efe6` | Lit pixels, captions and titles, a warm off-white like an old phosphor |
| Void | `#0e0e0e` | Unlit pixels and the screen itself, a soft black rather than pure black |
| Bezel | `#f2efe6` at 22% | A 0.5px inner hairline that marks the edge of each screen |

<details><summary>Tokens</summary>

```yaml
colors:
  primary: "#f2efe6"
  neutral: "#0e0e0e"
  hairline: "#f2efe638"
```

</details>

## Typography

A system monospace (DejaVu Sans Mono, falling back to ui-monospace, SF Mono, Menlo, Consolas). All captions are uppercase.

| Style | Size | Weight | Tracking | Notes |
|---|---|---|---|---|
| Scene title | 6.4% of the screen width | 700 | 0.06em | Two short lines, each on its own void block, a blinking cursor after the last line |
| Index | 3.6% of the screen width | 400 | 0.08em | Top left, "01/06", also on a void block |

Text sits on small void rectangles so it always reads clearly over busy dithering, like characters printed by the machine itself. Pixel sizes below are taken at a 340px screen.

<details><summary>Tokens</summary>

```yaml
typography:
  scene-title:
    fontFamily: DejaVu Sans Mono
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.06em
  index:
    fontFamily: DejaVu Sans Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0.08em
```

</details>

## Layout

A wall of three columns and two rows, at most 1080px wide, with a gap that scales between 12px and 28px. It reflows by its own width: three columns, then two below 400px, then one below 380px. Screens are square. Titles are centred, the index sits in the top left corner.

<details><summary>Tokens</summary>

```yaml
spacing:
  gap-min: 12px
  gap-max: 28px
  wall-max: 1080px
  dither-pixel: 3px
```

</details>

## Elevation & Depth

The screens are flat objects with no shadow. All depth is inside the picture: under the cursor, each scene shifts its own layers by a few percent, foreground more than background, following a spring (stiffness 70, damping ratio 0.86). The screen itself never moves.

## Shapes

Screens have a 20px radius and a 0.5px inner hairline in ink at 22%. One dither pixel is 3 CSS pixels, so the pixel grid stays coarse and readable at any size, and the canvas is scaled up with `pixelated` rendering so edges stay hard.

<details><summary>Tokens</summary>

```yaml
rounded:
  screen: 20px
```

</details>

## Components

### Screen

A square canvas, an index, a two-line title. The canvas is the whole picture; there are no images.

### Scenes

| No. | Title | What moves |
|---|---|---|
| 01 | Two Suns at Dusk | Two suns sink slowly over a rippled horizon, stars fade in toward the top |
| 02 | Jump to Lightspeed | Streaks race outward from the centre at different speeds |
| 03 | Through the Asteroid Belt | Lit, lumpy rocks drift across a slowly scrolling star field |
| 04 | Cold Outpost | Snow falls over two ridges and a lone hut, whose mast light blinks |
| 05 | A Ringed World | A banded, side-lit planet sits inside a tilted ring that passes behind and in front of it |
| 06 | Signal Received | A radar sweep circles over range rings and a crosshair, and blips flare as it passes |

### Dither

Each scene is a function that returns a brightness between 0 and 1 for every pixel. That value is compared with an 8x8 Bayer threshold matrix: above the threshold the pixel is ink, below it is void. Values under 0.04 are always void, so dark areas stay clean instead of sparkling.

### Motion

- **Frame rate:** the picture redraws at 30 fps, which reads as a screen rather than as smooth animation. The springs still run at full frame rate.
- **Parallax:** each screen follows the cursor with its own spring and eases back to centre when the cursor leaves.
- **Cursor:** the last title line ends in an underscore that blinks every 1.1s.

With reduced motion, every scene is drawn once at rest, parallax is off and the cursor stops blinking.

<details><summary>Tokens</summary>

```yaml
components:
  screen:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.scene-title}"
    rounded: "{rounded.screen}"
  screen-index:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.index}"
```

</details>

## Do's and Don'ts

- Do keep exactly two colours. If a scene needs more tone, add it to the brightness function and let the dither express it.
- Do keep one dither pixel at 3 CSS pixels or more, so the grid stays visible.
- Do put text on void blocks so it never fights the dithering.
- Don't smooth, blur or anti-alias the canvas.
- Don't add colour, glow or gradients on top of the screens.
- Don't move or tilt the screen itself; only the scene inside it moves.

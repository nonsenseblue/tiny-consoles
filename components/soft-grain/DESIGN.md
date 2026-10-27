---
version: alpha
name: Soft Grain
description: Six record sleeves for an imagined label, each grainy gradient cut into its own shape, with fine white lines that draw themselves in and ripple slowly.
---

# Soft Grain

## Overview

Slow Weather Records is an imagined label that records places in weather: a greenhouse at first light, a beach hut, a harbour from below, a cedar forest after rain, a rooftop at night, a railway yard in the rain. Soft Grain is its first six sleeves.

Each sleeve is warm paper with one cover cut into it. The cover is a soft weather of colour: a vertical gradient, four blurred colour blobs drifting underneath, film grain on top, and a pattern of fine white lines running through it. The cut follows the title, so Slow Light in Bloom is a flower and Rust Weather is rain running down iron. Around it, the paper carries only a title in a soft italic serif and one line of small print.

The feeling to aim for is quiet and tactile: printed matter more than screen, a sleeve you would want to hold. All six breathe together while idle, and the one under the cursor follows it.

## Influences

| Source | What Soft Grain takes from it |
|---|---|
| Independent and ambient record labels | A series of sleeves that share paper, type and small print, and change only the picture. The catalogue number is small print, never a headline. |
| Grainy gradients | The soft, noisy colour fields common in web and editorial design in the 2020s, kept to one hue family per cover. |
| Film grain and risograph print | Grain as a material, on the colour and on the paper, so both feel printed. |
| Guilloché and watermark patterns | Fine, repeated white line work like the security patterns on banknotes: rays, rings, lenses. |
| Topographic maps | The contour rings on Moss and Mist, and the idea that lines can describe a surface. |
| Paper cut-outs | Shapes cut freely out of colour and laid on paper: a petal, an arch, a patch of moss. |

## Colors

Each cover uses one family of adjacent hues, never contrasting ones. A family has a pale top, a dark bottom and four blob colours stepping from light to dark.

| Role | Colour | Use |
|---|---|---|
| White | `#ffffff` | Every line in the patterns, the only colour shared by all six covers |
| Sleeve paper | `#ebe8e1` | The sleeve around each cover, and the small sticker on Under Deep Water |
| Ink | `#1b1a19` | Titles |
| Small print | `#6e6a63` | The label name and catalogue number |
| Shade | `#040a12` | A cool near-black at low opacity, darkening the side of a cover away from the light |

| Cover | Top | Bottom | Blobs, light to dark | Pattern |
|---|---|---|---|---|
| Slow Light in Bloom | `#efe4f3` | `#d6884c` | `#c98bd6` `#ee9fbf` `#f1a86f` `#e6b247` | Rays |
| Dust and Driftwood | `#d3dbe2` | `#4b3628` | `#9fb0c0` `#8e8b87` `#76563f` `#3e2a1d` | Dot grid |
| Under Deep Water | `#dbe6ef` | `#0e2747` | `#adc5d9` `#6d93ba` `#2c5a8c` `#122f57` | Waves |
| Moss and Mist | `#d8e4e8` | `#1d382f` | `#a8c4cc` `#7ca7a2` `#3f6e5f` `#21423a` | Contour rings |
| Lavender Midnight | `#e8e1f5` | `#20183d` | `#c6b6ea` `#9b86d3` `#5c479b` `#2c205a` | Lens arcs |
| Rust Weather | `#e1e5e8` | `#6b2819` | `#bfc8ce` `#c99c8b` `#ab5639` `#7b2d1c` | None |

Titles sit on the paper, never on the colour, so a cover can be as light or dark as its weather needs.


<details><summary>Tokens</summary>

```yaml
colors:
  primary: '#ffffff'
  neutral: '#ebe8e1'
  ink: '#1b1a19'
  small-print: '#6e6a63'
  shade: '#040a12'
  hairline: '#00000029'
  bloom-top: '#efe4f3'
  bloom-bottom: '#d6884c'
  bloom-1: '#c98bd6'
  bloom-2: '#ee9fbf'
  bloom-3: '#f1a86f'
  bloom-4: '#e6b247'
  driftwood-top: '#d3dbe2'
  driftwood-bottom: '#4b3628'
  driftwood-1: '#9fb0c0'
  driftwood-2: '#8e8b87'
  driftwood-3: '#76563f'
  driftwood-4: '#3e2a1d'
  deepwater-top: '#dbe6ef'
  deepwater-bottom: '#0e2747'
  deepwater-1: '#adc5d9'
  deepwater-2: '#6d93ba'
  deepwater-3: '#2c5a8c'
  deepwater-4: '#122f57'
  moss-top: '#d8e4e8'
  moss-bottom: '#1d382f'
  moss-1: '#a8c4cc'
  moss-2: '#7ca7a2'
  moss-3: '#3f6e5f'
  moss-4: '#21423a'
  lavender-top: '#e8e1f5'
  lavender-bottom: '#20183d'
  lavender-1: '#c6b6ea'
  lavender-2: '#9b86d3'
  lavender-3: '#5c479b'
  lavender-4: '#2c205a'
  rust-top: '#e1e5e8'
  rust-bottom: '#6b2819'
  rust-1: '#bfc8ce'
  rust-2: '#c99c8b'
  rust-3: '#ab5639'
  rust-4: '#7b2d1c'
```

</details>

## Typography

Two voices. The title is a soft italic serif, light and slightly condensed, with gentle curves but nothing ornamental. The small print is a plain sans in tracked capitals, quiet and grey.

| Style | Family | Size at a 360px sleeve | Use |
|---|---|---|---|
| Title | Fraunces italic 300 | 21px, line height 1.05, -0.01em | The record's name, one or two lines |
| Small print | Inter 400, capitals | 6.5px, +12% tracking | Label name and catalogue number |

<details><summary>Tokens</summary>

```yaml
typography:
  title:
    fontFamily: Fraunces
    fontStyle: italic
    fontWeight: 300
    fontSize: 21px
    lineHeight: 1.05
    letterSpacing: -0.01em
  small-print:
    fontFamily: Inter
    fontSize: 6.5px
    letterSpacing: 0.12em
```

</details>

## Layout

A wall of three columns and two rows, at most 1080px wide; two columns below 400px. Every sleeve is laid out at 360 by 360 units and scaled as one object to its cell, so the type and the cut keep their relationship at any size.

There is no fixed grid inside a sleeve. The cover takes the shape and position its weather suggests, and the title and small print go where the paper is free, kept 16 units from the edge.

| Sleeve | Cut | Title | Small print |
|---|---|---|---|
| Slow Light in Bloom | An eight-petal flower opening from the top right, partly off the sleeve | Lower left | Below the title |
| Dust and Driftwood | A tall arch standing on the bottom edge | Upper left | Lower left |
| Under Deep Water | The whole sleeve, full bleed | On a small paper sticker, lower left | On the sticker |
| Moss and Mist | A lopsided patch spilling off the left edge | Upper right | Lower right |
| Lavender Midnight | A round record | Lower left | Upper right |
| Rust Weather | Six bars of uneven length hanging from the top, rounded at the foot | Lower left | Below the title |

<details><summary>Tokens</summary>

```yaml
spacing:
  sleeve: 360px
  inset: 16px
  gap-min: 12px
  gap-max: 28px
  wall-max: 1080px
```

</details>

## Elevation & Depth

Each sleeve casts one soft shadow on the page, like card on a table. Inside the cover, depth comes from layers, back to front:

1. Gradient
2. Blobs, drifting on 20 to 28 second loops and pulled a little toward the cursor
3. Line pattern
4. Shade, multiplied, darker away from the light
5. Cursor glow, screen-blended, small and soft
6. Grain, overlay blend at 32%

Lines carry their own depth: inner and upper lines sit further back and are dimmer, outer and lower lines come forward and are brighter. The sticker on Under Deep Water sits on top with a close, small shadow.

## Shapes

Sleeves are square with sharp corners. Covers are cut, not framed: no border, no rounding beyond the shape itself. Lines are 1px and keep that width at any size (non-scaling stroke), with round caps.

## Components

### Sleeve

Paper with grain, one cut cover, a title and one line of small print. Nothing else goes on a sleeve.

### Cover

One gradient, four blobs, one pattern, grain. Five patterns, drawn in a 100 by 100 space and slightly oversized so they bleed off the edge: 64 rays, a dot grid, 13 waves, 17 wobbling contour rings, and lens arcs. Rust Weather has no pattern; its cut is the drawing. The lines run right into the middle, except on Under Deep Water, where the centre stays clear and misty.

### Motion

- **Draw in:** each line draws from one end over 2.8s, staggered across the pattern over about 2.2s. Dots fade in instead.
- **Breathe:** each line's brightness dips from 100% to 65% and back over 9s, offset along the pattern so the dip travels.
- **Drift:** once the lines are drawn, an unseen point wanders slowly over each cover on its own path, so all six ripple together without ever matching.
- **Ripple:** every line has its own spring (stiffness 70, damping ratio 0.86). A line starts moving 11ms per unit of distance from the point, and shifts at most 2.6 units, scaled by its depth. Under the cursor, the cursor takes over from the drift.
- **Glow:** a small white glow follows the cursor and fades in over 0.7s.

Drift pauses while the wall is off screen. With reduced motion, the blobs stop, lines appear already drawn, and drift, glow and ripple are off.

<details><summary>Tokens</summary>

```yaml
components:
  sleeve:
    backgroundColor: '{colors.neutral}'
    textColor: '{colors.ink}'
    typography: '{typography.title}'
  line-pattern:
    textColor: '{colors.primary}'
```

</details>

## Do's and Don'ts

- Do keep each cover inside one hue family.
- Do let the cut follow the record's name.
- Do keep the title on the paper, and keep everything else to one line of small print.
- Do keep the lines thin and white. If they are hard to see, raise the layer's opacity before making them thicker.
- Don't put a large number, a grid or extra labels on a sleeve. A record's catalogue number is small print.
- Don't line the six sleeves up into one template; they share paper and type, not layout.
- Don't blur the lines or the grain; the softness comes from the blobs alone.

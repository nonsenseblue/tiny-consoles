---
version: alpha
name: Soft Grain
description: Grainy gradient covers with fine white line patterns that draw themselves in and ripple outward from the cursor.
---

# Soft Grain

## Overview

Six square covers, each a soft weather of colour. A vertical gradient sets the light from above, four blurred colour blobs drift underneath it, film grain sits on top, and a pattern of fine white lines runs through the middle like a watermark. The title is plain white type, centred, two short lines.

The feeling to aim for is quiet and tactile: printed matter more than screen, a cover you would want to touch. Nothing is sharp except the lines, and even the lines breathe.

Motion is slow and local. On load each line draws itself in, one after another. While idle, a brightness wave travels along the pattern. On hover, the lines nearest the cursor move first and the movement spreads outward line by line, so the pattern unfolds instead of moving as one sheet.

## Influences

| Source | What Soft Grain takes from it |
|---|---|
| Grainy gradients | The soft, noisy colour fields common in web and editorial design in the 2020s. Here they are kept to one hue family per cover. |
| Film grain and risograph print | Grain as a material: it makes flat colour feel printed and touchable. |
| Guilloché and watermark patterns | Fine, repeated white line work like the security patterns on banknotes and certificates: rays, rings, lenses. |
| Topographic maps | The contour rings on Moss and Mist, and the idea that lines can describe a surface. |
| Book and record covers | A square format, a centred two-line title and nothing else: covers meant to be held and kept. |

## Colors

Each cover uses one family of adjacent hues, never contrasting ones. A family has a pale top, a dark bottom and four blob colours stepping from light to dark.

| Role | Colour | Use |
|---|---|---|
| White | `#ffffff` | Titles and every line in the patterns, the only colour shared by all six covers |
| Paper | `#f3f2ef` | The page around the wall |
| Shade | `#040a12` | A cool near-black at low opacity, darkening the side of a cover away from the light |

| Cover | Top | Bottom | Blobs, light to dark | Pattern |
|---|---|---|---|---|
| Slow Light in Bloom | `#efe4f3` | `#d6884c` | `#c98bd6` `#ee9fbf` `#f1a86f` `#e6b247` | Rays |
| Dust and Driftwood | `#d3dbe2` | `#4b3628` | `#9fb0c0` `#8e8b87` `#76563f` `#3e2a1d` | Dot grid |
| Under Deep Water | `#dbe6ef` | `#0e2747` | `#adc5d9` `#6d93ba` `#2c5a8c` `#122f57` | Waves |
| Moss and Mist | `#d8e4e8` | `#1d382f` | `#a8c4cc` `#7ca7a2` `#3f6e5f` `#21423a` | Contour rings |
| Lavender Midnight | `#e8e1f5` | `#20183d` | `#c6b6ea` `#9b86d3` `#5c479b` `#2c205a` | Lens arcs |
| Rust Weather | `#e1e5e8` | `#6b2819` | `#bfc8ce` `#c99c8b` `#ab5639` `#7b2d1c` | None |

The middle of every cover, where the white title sits, should be mid-toned or darker, so the title stays readable.


<details><summary>Tokens</summary>

```yaml
colors:
  primary: '#ffffff'
  neutral: '#f3f2ef'
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

Inter, regular weight, white, centred. The size is relative to the cover, 8% of its width, so it scales with the card; 27px is the value at a 340px cover. Line height 1.18, tracking slightly tight at -0.01em. Titles are two short lines, set as written, never uppercase.

A very soft shadow sits under the title and shifts against the cursor, which lifts the type off the surface without looking embossed.


<details><summary>Tokens</summary>

```yaml
typography:
  cover-title:
    fontFamily: Inter
    fontSize: 27px
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: -0.01em
```

</details>

## Layout

A wall of three columns and two rows, at most 1080px wide. The gap scales between 12px and 28px with the viewport. The wall reflows by its own width, not the page: three columns, then two below 400px, then one below 380px.

Covers are square. Inside a cover, the title is optically centred and the line pattern is centred on the same point, with a clear zone around the title.


<details><summary>Tokens</summary>

```yaml
spacing:
  gap-min: 12px
  gap-max: 28px
  wall-max: 1080px
```

</details>

## Elevation & Depth

Depth comes from layers inside the cover, not from shadows around it. From back to front:

1. Gradient
2. Blobs, drifting on 20 to 28 second loops and pulled a little toward the cursor
3. Line pattern
4. Shade, multiplied, darker away from the light
5. Cursor glow, screen-blended, small and soft
6. Grain, overlay blend at 32%
7. Title

Lines carry their own depth: inner and upper lines sit further back and are dimmer, outer and lower lines come forward and are brighter. Under the cursor, nearer lines move more.

## Shapes

Covers have a 20px radius and a 0.5px inner hairline at 16% black, which keeps the edge crisp against light pages. Lines are 1px and keep that width at any size (non-scaling stroke), with round caps. There are no other borders or outlines.


<details><summary>Tokens</summary>

```yaml
rounded:
  card: 20px
```

</details>

## Components

### Cover

The whole piece is made of covers. One gradient, four blobs, one pattern, grain, title. Covers do not move as objects: no lift, no tilt, no scaling on hover.

### Line patterns

Five patterns, all drawn in a 100 by 100 space and slightly oversized so they bleed off the edge: 64 rays, a 5-unit dot grid with dots growing toward the edge, 13 waves strongest in the middle, 17 wobbling contour rings, and lens arcs inside a circle. The whole layer sits at 85% opacity and is masked clear in the centre, fully clear within 12% of the radius and fully visible from 42%.

### Motion

- **Draw in:** each line draws from one end over 2.8s, staggered across the pattern over about 2.2s. Dots fade in instead.
- **Breathe:** each line's brightness dips from 100% to 65% and back over 9s, offset along the pattern so the dip travels.
- **Ripple:** every line has its own spring (stiffness 70, damping ratio 0.86). A line starts moving 11ms per unit of distance from the cursor, and shifts at most 2.6 units, scaled by its depth.
- **Glow:** a small white glow follows the cursor and fades in over 0.7s.

With reduced motion, the blobs stop, lines appear already drawn, and the glow and ripple are off.


<details><summary>Tokens</summary>

```yaml
components:
  cover:
    backgroundColor: '{colors.bloom-top}'
    textColor: '{colors.primary}'
    typography: '{typography.cover-title}'
    rounded: '{rounded.card}'
  line-pattern:
    textColor: '{colors.primary}'
```

</details>

## Do's and Don'ts

- Do keep each cover inside one hue family.
- Do keep the lines thin and white. If they are hard to see, raise the layer's opacity before making them thicker.
- Do let motion start near the cursor and spread. Nothing should move all at once.
- Don't add drop shadows, borders or hover lift to the covers.
- Don't put text other than the title on a cover.
- Don't use a large or bright cursor glow. It washes out the grain and hides the lines.
- Don't blur the lines or the grain; the softness comes from the blobs alone.

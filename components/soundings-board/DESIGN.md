---
version: alpha
name: Soundings
description: An identity board for an imagined coastal listening station, built from traced lines, a visible grid and a depth readout, all drawn in code.
---

# Soundings

## Overview

Soundings is an invented brand: a listening station on the coast of Hyuga-nada that measures the sea. The board shows its identity as one object in five tiles, a business card front and back, a depth readout, an engraved sea surface and a seafloor chart.

The style is Swiss and scientific: calm, objective, mostly greys, with a strict grid that is drawn rather than hidden. What keeps it from feeling cold is the material. Lines are traced and broken like an edge-detected scan, photographs are replaced by engraving and dither, and warm paper greys sit next to cool slate. Every image is generated, there are no photos or illustrations.

## Influences

| Source | What Soundings takes from it |
|---|---|
| Swiss Style, Zurich and Basel, 1950s and 60s | The strict grid, sans-serif type, flush-left text and generous space. Josef Müller-Brockmann's *Grid Systems in Graphic Design* is the closest reference: every element hangs from a line. |
| Hydrographic charts | Depth contours, sounding lines dropped from the surface, numbers written on their lines, scale bars. The brand's name is the surveyor's word for a depth measurement. |
| Early computer plotter art, 1960s | Line drawings made by rules and chance, as in the work of Georg Nees and Frieder Nake. Every line here comes from a noise field, contoured and broken by code. |
| Line engraving | Tone made only from lines of varying thickness, as on banknotes and old stamps. Used for the sea surface. |
| Scientific plots as graphics | Stacked lines lifted by a signal, the language made famous by the cover of *Unknown Pleasures* (1979), which reused a pulsar plot. |

## Colors

A narrow range of greys, warm on paper and cool on data, with one deep sea tone.

| Role | Colour | Use |
|---|---|---|
| Ink | `#2b2b2a` | Type, lines and the mark |
| Soft ink | `#77776f` | Labels, captions and metadata |
| Paper | `#f4f3ef` | The back of the business card |
| Mist | `#d7d8d4` | The front of the business card |
| Engraving paper | `#e3e1da` | Behind the engraved swell |
| Slate | `#b7bcc0` | The seafloor chart |
| Deep | `#1f2427` | The depth readout, which runs from `#5d6c73` at the surface to `#15191b` at the bottom |
| Hairline | Ink at 16% | Grid lines on the card |

<details><summary>Tokens</summary>

```yaml
colors:
  primary: "#2b2b2a"
  secondary: "#77776f"
  neutral: "#f4f3ef"
  mist: "#d7d8d4"
  engraving: "#e3e1da"
  slate: "#b7bcc0"
  deep: "#1f2427"
  deep-surface: "#5d6c73"
  deep-floor: "#15191b"
  hairline: "#2b2b2a29"
```

</details>

## Typography

Inter throughout, in two weights. Numbers use tabular figures. Type is sized from the board's width, so the board scales as one object; sizes below are at a 1080px board. When the board narrows to one column, sizes switch to the fixed values in brackets.

| Style | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| Name | 1.95% of the board (22px) | 500 | -0.025em | The person's name on the card back |
| Chart title | 1.7% (19px) | 500 | -0.02em | "Coastal Record 03" |
| Wordmark | 1.3% (15px) | 500 | -0.01em | "Soundings" on the card front |
| Readout word | 4.1% of the readout tile, smaller and dimmer with depth | 400 | 0 | Words in the depth readout |
| Body | 0.78% (9px) | 400 | 0 | Captions, card details, coordinates |
| Label | 0.62% (7.5px) | 400 | 0.04em, uppercase | ROLE, TEL, MAIL |

<details><summary>Tokens</summary>

```yaml
typography:
  name:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.025em
  chart-title:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.02em
  wordmark:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.01em
  body:
    fontFamily: Inter
    fontSize: 9px
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: '"tnum" 1'
  label:
    fontFamily: Inter
    fontSize: 7.5px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.04em
```

</details>

## Layout

Three equal columns with a gap of 1% of the board:

| Column | Top | Bottom |
|---|---|---|
| Left | Card front, 1.64 : 1 | Card back, 1.64 : 1 |
| Middle | Depth readout, the full height of both cards | |
| Right | Engraved swell | Seafloor chart |

The board is about 2.4 times as wide as it is tall. Below 560px it becomes one column: card front, card back, readout (0.8 : 1), swell (1.5 : 1), chart (1.2 : 1).

Inside the tiles, everything hangs from a few fixed positions. On the card back, four vertical and two horizontal hairlines are drawn, and every piece of text starts on one of them.

<details><summary>Tokens</summary>

```yaml
spacing:
  board-gap: 1%
  tile-inset: 6%
  card-ratio: 1.64
  narrow-breakpoint: 560px
```

</details>

## Elevation & Depth

Flat. No shadows, no rounded tiles, no layering between tiles. Depth only exists inside the readout, as a gradient from surface to floor, and as words that grow smaller and dimmer the deeper they sit.

## Shapes

Square corners everywhere. Lines are 0.7 to 0.8px. Hairlines are 1px. The mark is the only round shape: five columns of dots, 3, 5, 6, 4 and 2 deep, each dot a little smaller than the one above, like five soundings read downward.

<details><summary>Tokens</summary>

```yaml
rounded:
  none: 0px
```

</details>

## Components

### Card front

A seabed in section. One clean line for the sea surface, a traced and broken line for the seabed, sediment fragments below it that get denser toward the bottom right, and eight dotted drops from the surface to the bed with the depth written above each.

### Card back

The visible grid, the mark top left, the station line top right, the name large on the left, and three labelled details along the bottom.

### Depth readout

A depth scale from 0 to 200 m on the left, soft light shafts from the surface, and words placed by depth: busy and bright near the surface (swell, spray, tide), sparse and dim near the floor (bedrock, whale song, return). A dashed sounding line drops over 7 seconds and each word surfaces when the line reaches its depth.

### Engraved swell

The sea surface drawn only with horizontal lines, each line thicker where the water is dark and thinner where it catches light. Far water is compressed toward the horizon, near water is larger.

### Seafloor chart

Contours from above, broken into short runs like a traced scan, with a few depth numbers sitting on their lines, a title block, and a scale bar. The title corner and the scale corner are kept free of lines.

### Technique

All line work comes from one method: a noise field, contoured with marching squares, then broken into dashes by a second noise. Light shafts are painted small and scaled up, so they stay soft in every browser, including iOS.

With reduced motion, the sounding line and all words appear at once.

<details><summary>Tokens</summary>

```yaml
components:
  card-front:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.primary}"
    typography: "{typography.wordmark}"
    rounded: "{rounded.none}"
  card-back:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.name}"
    rounded: "{rounded.none}"
  readout:
    backgroundColor: "{colors.deep}"
    textColor: "#ffffff"
  swell:
    backgroundColor: "{colors.engraving}"
    textColor: "{colors.primary}"
  chart:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.primary}"
    typography: "{typography.chart-title}"
```

</details>

## Do's and Don'ts

- Do draw the grid. Hairlines are part of the design, not scaffolding.
- Do keep every image generated from lines, dots or dither.
- Do keep colour to greys and the one deep sea tone.
- Don't use photographs, gradients on the light tiles, or rounded corners.
- Don't centre things that could hang from a grid line.
- Don't copy another brand's mark or wording. Soundings is fictional, and its mark, names and phrases are its own.

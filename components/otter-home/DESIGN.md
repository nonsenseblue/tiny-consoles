---
version: alpha
name: Otter Home
description: A four-level house on a hillside by the sea, built in Blender, presented like a headset launch; open the product sheet and the interface comes up, with every render of the house a step inside.
---

# Otter Home

## Overview

A house that exists only as a Blender scene: four levels stepped into a slope above the sea, white walls, a dark mono-pitch roof, glass rails, timber where hands touch it, a pool on the lowest terrace. Every view of it is rendered in Cycles, forty-four in all.

On the page it is three sheets of a launch page on a pale grey board, the way a headset is announced. The large one carries small labels across the top, a headline set light and bold, a short paragraph and two screens of the interface, the main view behind and the start screen laid over it, with a frosted badge whose lettering turns slowly. Beside it, How it works shows the three steps, each a small screen, a name and two lines; What you see labels the parts of the interface with thin lines. All three sit on soft colour under a fine grain.

Open any sheet and the interface comes up over the page, always in its wide layout, scaled to the screen. On a phone held upright it turns a quarter so it fills the screen when the phone is turned. It opens on a start screen: Where would you like to begin, with Outside, Garden and Inside, then Enter. One wide window is bent round you like a curved screen. The floors hang on the left, the views of the chosen floor on the right, and close at hand a small desk holds the whole house seen from above, with a frame marking the part you are looking at. Step inside, or a click on the big window, fills the space with a render, and the pictures turn one after another.

## Influences

| Source | What Otter Home takes from it |
|---|---|
| Spatial interfaces in headsets | Frosted glass panels with a light rim, ornaments hung beside a window, a window bent round the viewer, a little parallax with depth. |
| Launch pages for headsets | The product sheet: tiny labels with notes in brackets, a headline mixing light and bold, a turning badge, soft colour fields. |
| Frosted glass and grainy print | Every ground is matte: colour under fine grain, never a smooth glow. |

The house, its renders, the interface and the words are all our own. No real product is shown.

## Colors

| Role | Hex | Use |
|---|---|---|
| Ground | `#EFEFEA` | Under the colour fields of the sheet |
| Moss | `#DFE8D2` | Colour field, top left |
| Sand | `#EFE3CF` | Colour field, top right |
| Sea mist | `#D6E2E4` | Colour field, low middle |
| Ink | `#1C1F1D` | Type on the sheet |
| Muted | `#6B706C` | Notes in brackets, small print |
| Chosen | `#D7E2DC` | What is chosen in the interface, the Step inside button, the frame on the desk; a soft mist green, never pure white |
| Chosen ink | `#1F2A26` | Type on the chosen colour |
| Glass | `rgba(128,132,130,.28)` + blur 30px | Every panel of the interface |

<details><summary>Tokens</summary>

```yaml
colors:
  ground: "#EFEFEA"
  moss: "#DFE8D2"
  sand: "#EFE3CF"
  sea-mist: "#D6E2E4"
  ink: "#1C1F1D"
  muted: "#6B706C"
  chosen: "#D7E2DC"
  chosen-ink: "#1F2A26"
```
</details>

## Typography

| Role | Face | Size at 1600 wide |
|---|---|---|
| Headline | Barlow 300 with 600 for the stressed words | 66px, line height 1.02 |
| Labels | Barlow 600, upper case, tracked .06em | 12px, notes in Barlow 400 |
| Badge lettering | Barlow 600, tracked .2em, set once round the circle | 10.5px |
| Interface | Inter 500 | 21px floors, 20px button, 15px panel titles |
| Captions in the full view | Inter 500, upper case | 11px |

<details><summary>Tokens</summary>

```yaml
typography:
  headline: { family: Barlow, weight: [300, 600], size: 66px }
  label: { family: Barlow, weight: 600, size: 12px, case: upper }
  interface: { family: Inter, weight: 500, size: 15-21px }
```
</details>

## Layout

The board is drawn at 1760 × 720 and the interface at 1600 × 900; both are scaled to fit.

| Part | Where |
|---|---|
| Board | 1760 × 720, pale grey, at most 820px wide on the page |
| Sheets | 1108 × 623 on the left; 532 × 299 twice on the right, 24px apart, 48px from the edges |
| Badge | 92px across, where the two screens meet |
| Interface: window | 940 × 400, centred, bent on a cylinder of radius 760 |
| Interface: floors and views | 260px wide each, 60px from the left and right edges, the same distance from the window |
| Interface: desk | 480px wide, under the window, tipped back 28 degrees |

## Elevation & Depth

The sheet has one shadow, under the interface picture. In the interface every panel is frosted glass with a light rim and a soft shadow, the side panels turned 22 degrees toward you, the desk tipped back. As the pointer moves, the backdrop, the window, the panels and the desk shift by different amounts, the nearest most.

## Shapes

Rounded everywhere: 24px for the picture on the sheet, 30px for panels, 36px for the desk, full pills for buttons. The badge is a circle with a thin ring in the ground's own colours and no fill.

## Components

- **Sheets.** Three on the page: the headline with two screens, How it works, What you see. Any one opens the interface.
- **Badge.** Frosted, a gradient ring, the words STEP INSIDE twice round it, turning once every 22 seconds while the board is on screen; under the pointer it grows a little and the arrow nudges toward the corner.
- **Start screen.** Outside, Garden or Inside (1F); Enter goes into the interface there.
- **Interface view.** A dialog over a dimmed, blurred page, always wide, scaled to fit; a round Close at the top right. Escape closes it.
- **Floors.** Outside, Garden, 3F, 2F, 1F, B1. Choosing one fills the views and shows its first picture.
- **Views.** Every render of the chosen floor in two columns, scrolling inside the panel.
- **Desk.** The house from above, a frame moving to the floor you are on.
- **Stepping inside.** Step inside, or a click on the big window, grows the chosen render to fill the space inside the interface, with glass round buttons either side for the previous and next picture, a glass Back at the top left and a caption below. The arrow keys and a swipe turn the pictures; Escape steps back to the interface, then closes it.
- **Reduced motion.** Nothing moves: no parallax, no fades, no turning badge.

## Do's and Don'ts

- Do keep every ground matte: colour under grain, glass that is frosted.
- Do keep what is chosen in the soft mist green; never pure white, never a solid black disc.
- Do keep the two side panels the same width and the same distance from the edges.
- Don't put a filter on the bent window itself; it flattens the curve. Filter the strips.
- Don't show a real headset or a real brand.
- Don't run anything while the pointer is still; the interface is still pictures and transitions only.

---
version: alpha
name: Ma Kasuri
description: Four squares of kasuri cloth for four quiet Japanese films; washed, their stitched labels rewrite what was said into what was meant.
---

# Ma Kasuri

## Overview

Four squares of woven kasuri, one for each of four films about families who do not say things: Naruse's *Meshi* (1951), Ozu's *Sanma no aji* (1962), and Kore-eda's *Aruitemo aruitemo* (2008) and *Umi yori mo mada fukaku* (2016). Each cloth has a woven label stitched on, carrying the one line a character says out loud.

The second layer is time. Leave the pointer on a cloth and it goes through the wash: it creases, the dyes soften toward their own faded colours, the label crumples, and letter by letter the line is rewoven into what was meant and never said. Take the pointer away and it slowly comes back. With nobody's pointer on the board, the cloths take turns.

The title joins *ma*, the space between things, with *kasuri*. The cream patches left undyed in every cloth are the silences.

Three of the films were written at a seaside inn: Ozu wrote his post-war scripts there, and Kore-eda has written there since *Still Walking*. Their labels carry a small woven 海辺の宿, the seaside inn. Naruse never wrote there, so his label says 番外, the outsider, and is stitched in grey instead of red.

## Influences

| Source | What Ma Kasuri takes from it |
|---|---|
| Naruse, *Meshi* (1951) | A husband who comes to Tokyo on business and takes his wife home to Osaka. His line on the label is ordinary; what he means is not. All lines are our own, none are quoted from the film. |
| Ozu, *Sanma no aji* (1962) | A widower who marries off his daughter. The colours are a saury's back: dark steel blue on blue-black, silver greys. |
| Kore-eda, *Aruitemo aruitemo* (2008) | A family visiting on the anniversary of the elder son's death, a summer house on a hill. The cloth is a flight of steps, climbed one at a time, in dry summer greens. |
| Kore-eda, *Umi yori mo mada fukaku* (2016) | A typhoon night, a father and son sheltering in a playground, lottery tickets blown everywhere and gathered up after the storm. The tickets are the only yellow. |
| Kasuri and ikat weaving | Threads dyed before weaving and shifted on the loom, so every edge breaks into flames and colours speckle into each other. Igeta, the well-frame motif, for Ozu; tobi-gasuri, small scattered marks, for the tickets. |
| Woven clothing labels | Folded ends, a running stitch, a border woven in, letters that carry the weft through them. |
| The seaside inn where Ozu and Kore-eda wrote | The 海辺の宿 / 番外 marks. The inn is not named and nothing of its own appears. |

## Colors

Each cloth has its own dyes and its own faded dyes. The two older films keep to ink, grey and one colour, like the black-and-white films they come from; the two Kore-eda cloths have no black at all.

| Cloth | Fresh dyes | Fades toward | Accent |
|---|---|---|---|
| Meshi | ink `#1f1e23`, grey `#9c9a94`, cream `#f4efe3` | slightly lighter, never washed out | Red `#e8553e` |
| Sanma no aji | blue-black `#1a1f2b`, silver `#9ea4ab`, cream `#f2f0ea` | the lighter steel `#5b84b0` | Steel blue `#3e5f86` |
| Aruitemo aruitemo | dark green `#203a2b`, olive `#61733f`, stone `#c3b08a`, cream `#f1e7cc` | paler, sunbleached | Ochre treads `#d9a33a`, one burnt step `#8f4a2f` |
| Umi yori mo mada fukaku | night blue `#1d4573`, rain blue `#367aa3`, aqua `#a4cfd9`, summer green `#4b9a69`, cream `#eef4f1` | lighter and wetter | Ticket yellow `#f4d24e` |

Labels are a warm off-white `#efe9dc` with ink `#2a2724`; the stitch is red `#a8392a`, and grey `#4a4846` on Naruse's.

<details><summary>Tokens</summary>

```yaml
colors:
  label: "#efe9dc"
  labelInk: "#2a2724"
  stitch: "#a8392a"
  stitchOutsider: "#4a4846"
  meshiAccent: "#e8553e"
  sanmaAccent: "#3e5f86"
  aruiteAccent: "#d9a33a"
  aruiteBurnt: "#8f4a2f"
  umiAccent: "#f4d24e"
```

</details>

## Typography

| Style | Family | Size on a label | Use |
|---|---|---|---|
| Title | Shippori Mincho 500 | 17 to 26px, by length | Film title |
| Line | Klee One 400 | 10.5px | What is said, and what is meant |
| Small | Shippori Mincho 500 | 6.5 to 9px, tracked | Year, English title and director, the inn mark |

Sizes are at the cloth's design size, 520 × 520. A woven weft runs through all the letters.

<details><summary>Tokens</summary>

```yaml
typography:
  title:
    fontFamily: Shippori Mincho
    fontWeight: 500
    fontSize: 26px
    letterSpacing: 0.08em
  line:
    fontFamily: Klee One
    fontSize: 10.5px
  small:
    fontFamily: Shippori Mincho
    fontWeight: 500
    fontSize: 6.5px
    letterSpacing: 0.14em
```

</details>

## Layout

Four square cloths in two rows of two, drawn at 1068 × 1068 and scaled to the width they are given, as in day-for-night. Every label sits low on the right, a little crooked; short titles get a narrow label, long ones a wider one.

<details><summary>Tokens</summary>

```yaml
spacing:
  cloth: 520px x 520px
  gap: 28px
  board: 1068px x 1068px
  label: 190px or 248px x 92px
```

</details>

## Elevation & Depth

Cloth lying on the page: one close soft shadow, lifted by 6px on hover. The label has its own close shadow on the cloth. When washed, light from the upper left catches soft creases across cloth and label. Opened full size, the cloth sits over a dimmed, slightly blurred page.

## Shapes

Square cloths, a rectangular woven label with folded ends. No drawn objects: every shape is woven geometry, blocks, frames, steps, stripes and small scattered marks.

## Components

### The weave

Each design is a map of which dye goes where. The loom shifts each warp thread by its own amount, so straight edges break into flames of uneven width and height; colours bleed into each other near an edge, and each thread is dyed a shade apart. Small motifs (steps, tickets) are woven with less drift so they stay legible; Ozu's frames are left to melt.

### The label

Woven tape with heat-cut edges, ends folded under and held by a fine running stitch with needle holes.

### The wash

On hover the cloth creases (a displacement by low noise), soft creases are lit across it, the dyes move toward their faded colours, the label crumples a little less than the cloth, and the line is rewoven one letter at a time, the letter on the loom shown faint. It takes about four seconds; leaving takes it back in about two. Without a pointer, one cloth at a time goes through the wash and back; a cloth opened full size takes every turn itself.

With reduced motion the cloths are woven and stay fresh: the spoken lines only.

### Full size

Clicking a cloth opens it over the page, with notes beside it on the film, the cloth and the label (below it on a phone). The cloth starts its wash from the beginning; Replay starts it again. The arrow keys, Prev and Next go through the four, Esc, Close or a click outside closes it.

## Do's and Don'ts

- Do write every line ourselves; don't quote dialogue from the films.
- Do keep the meant line hidden until the wash; never show both at once.
- Do keep the silences as undyed cream.
- Don't draw objects (bowls, fish, slides, buildings): only woven geometry.
- Don't wash the colours out; real washing softens them, it does not grey them.
- Don't name or show the seaside inn.

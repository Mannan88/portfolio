# Interactive Portfolio

A motion-heavy personal portfolio built with Next.js, GSAP and Three.js. It combines pixel-art sprite typography, scroll-driven storytelling, a procedural 3D chrome sphere and tactile project showcases, all responsive from phones to wide desktops.

---

## Highlights

- **Sprite-sheet hero.** The word "PORTFOLIO" is built from animated pixel-art letters. Each letter plays on hover and finishes its loop before pausing. A single CSS variable (`--s`) drives the scale, so the layout stays crisp at integer multiples and needs no resize listeners. The sprite sheet animation was fully made by me, using an Open-source tool called LibreSprite.
- **Pinned scroll storytelling.** The "Craft" section pins the viewport and scrubs a timeline. On desktop and tablet the stage titles travel horizontally. On mobile the same content becomes a vertical, one-card-at-a-time flow with an arc stage indicator.
- **Procedural chrome sphere.** A Three.js sphere is displaced by simplex noise and shaded with a physical material, an environment map and a custom Fresnel rainbow halo via GLSL shader injection. Scroll progress "polishes" it from a rough blob into smooth chrome.
- **Project showcase.** On desktop, hovering a row fills it with stacked colour layers and shows a cursor-following preview window. On touch devices, rows show thumbnails and tapping opens a bottom drawer with a larger image, tags and a link to the project page.
- **Bezier image carousel.** Cards travel along a cubic Bezier path with drag, inertia, hover lift and tap-to-reveal captions. Cards enter and exit fully off-screen for a seamless loop.

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) (App Router), React, TypeScript |
| Animation | [GSAP](https://gsap.com), ScrollTrigger, `@gsap/react` (`useGSAP`), `gsap.matchMedia()` |
| 3D | [Three.js](https://threejs.org) (`SimplexNoise`, `RoomEnvironment`, `OrbitControls`) |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 |
| Fonts | [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with Geist |

## Getting Started

### Prerequisites

- Node.js 18.18 or newer
- npm, yarn, pnpm or bun

### Install and run

```bash
# install dependencies
npm install

# start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run the linter |

## Project Structure

```
components/
  hero/             Sprite template (animated pixel-art letters)
  clouds/           Hero section with the sprite-letter title and manifesto
  craft/            Pinned scroll section with stages and the chrome sphere
  chrome-sphere/    Three.js noise-displaced chrome sphere
  creations/        Project list, hover preview and mobile drawer
  ...               Bezier image carousel
data/
  stages.ts         Stage titles, descriptions and colours (Craft)
  projects.ts       Project entries and text-colour helper (Creations)
  images.ts         Image list for the Bezier carousel
lib/
  path.ts           assetPath() helper for public asset URLs
public/
  section_one_letters/   Sprite sheets for the hero letters
```

The exact folder names may differ slightly from this outline. The data files and `assetPath` helper are the main extension points.

## Customising Content

Most content lives in plain data files, so you rarely need to touch the components.

**Projects** (`data/projects.ts`). Each entry is used by the project list and the mobile drawer:

| Field | Purpose |
| --- | --- |
| `id`, `slug` | Unique key and the sub-route (`/<slug>`) |
| `name`, `category`, `tech` | Title, category label and tech tags |
| `image` | Preview image path |
| `colors` | Stacked fill layers. Index `0` is the final, top-most colour and also colours the mobile drawer |

`textColorFor(colors[0])` picks a readable text colour for the final fill.

**Stages** (`data/stages.ts`). Each stage has a `title`, `desc` and a Tailwind background `color` class. These drive the Craft cards and the mobile arc indicator.

**Carousel images** (`data/images.ts`). A list of `{ src, alt }` objects. The `alt` text is also shown as the caption.

**Sprite letters.** Each letter needs a vertical sprite sheet (frames stacked top to bottom) and these props: `frameCount`, `nativeWidth`, `nativeHeight`, plus optional `letterTop`, `letterHeight`, `duration` and `zIndex`.

## Responsive Behaviour

The layout is designed mobile-first, with behaviour that changes by input type and not only by width.

| Section | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| Hero | 3×3 letter grid, cropped to the letter band | Single row, smaller scale | Single row, full scale |
| Craft | Vertical pinned flow, one card at a time, arc indicator, smaller sphere | Horizontal pinned scroll | Horizontal pinned scroll with marquee ribbons |
| Creations | Thumbnails and a bottom drawer | Thumbnails and a bottom drawer | Hover fill and cursor-following preview |
| Carousel | Tap a card to reveal its caption | Tap a card to reveal its caption | Hover to pause and reveal the caption |

Breakpoints are handled with Tailwind classes and `gsap.matchMedia()`. Cleanup runs automatically when a breakpoint changes.

## Performance Notes

- The sphere runs in a single `requestAnimationFrame` loop. Its live values (amplitude, roughness, metalness, halo) are stored in refs rather than React state, so scrolling never rebuilds the WebGL scene.
- The carousel updates through the GSAP ticker and sets transforms directly, with no React re-renders per frame.
- Sprite sizes come from CSS `calc()` and a single custom property, so the hero needs no JavaScript on resize.
- Pixel-art sprites use `image-rendering: pixelated` to stay sharp.

## Browser Support

Modern evergreen browsers with WebGL support. Touch behaviour is built on Pointer Events. On iOS, scroll-locking while a Craft card is open can be inconsistent once a native scroll has started.

## License
All rights reserved

## Contact

Mannan kochar:
X: https://x.com/Mannan_k2005
LinkedIn: https://www.linkedin.com/in/mannan-kochar-74bb75270/
Email: kocharmanan88@gmail.com

# Dodeka Frontend Documentation

## Type Checking

Run `npm run check` to type-check the project. Note: there are pre-existing errors in legacy `AdminOld`/`LedenOld` code that can be ignored.

## Seasonal themes

The home page carries a seasonal decoration (summer, winter, Easter, …) that gets swapped a few times a year. It is controlled by **one switch**:

```ts
// src/pages/home/season.ts
export const SEASON_THEME_ENABLED: boolean = false;
```

That flag gates both halves of the theme. Keep them in sync — never enable one without the other:

| Part | File | What it is |
| --- | --- | --- |
| Falling emoji | `src/pages/home/home.tsx` — `snowContent` | Emoji drifting down over the title bar, injected by `createSnow` into `#sneeuw_container` |
| Decorative bar | `src/pages/home/components/TitleBar.tsx` — the `Sneeuw` import | An SVG strip along the bottom of the title bar |

### Turning a season on

1. Set `SEASON_THEME_ENABLED` to `true`.
2. Update the `snowContent` emoji list in `home.tsx` (summer was `["☀️", "🍦", "🍹", "🌻"]`).
3. Point the `Sneeuw` import in `TitleBar.tsx` at the season's SVG in `src/images/home/`. Only `zand.svg` (summer sand) is currently wired up; `blad.svg` (leaves — the winter theme, per the note on that import), `sneeuw.svg` (snow) and `grass.svg` sit unreferenced in the folder, ready to swap in.
4. Pick the bar layout in `TitleBar.tsx`: `sneeuw_bar--full` is one full-width strip (used by summer); `sneeuw_bar--left` / `--center` / `--right` are three separate drifts (used by winter). The unused variant is kept commented out in place.
5. Add a `Changelog.json` entry — theme changes are user-visible and get one by convention (see "Zomerthema online", "Paasthema").

Naming is historical: everything is called `sneeuw`/`snow` (Dutch for snow) because the effect started as a winter theme, regardless of the season it now renders.

> **Gotcha:** `createSnow` busy-waits in a `while (!snowContainer)` loop for `#sneeuw_container`. If that element is ever absent while `createSnow` runs, it spins forever and freezes the tab. This is why the call and the container element are gated behind the same flag.

## OWee mode: turning the frontpage back to normal

During the OWee (the Delft intro week) the home page runs a temporary setup: a fullscreen video above the navigation bar, a sticky promo banner, and an OWee item in the nav. All of it is meant to come off again afterwards.

Each piece is independent — remove only what you want gone. The seasonal decoration (falling emoji, sand/leaf bar) is a separate system with its own switch; see "Seasonal themes" above.

| Piece | Where | Section below |
| --- | --- | --- |
| Fullscreen hero video | `layout.tsx` + `HeroVideo.*` | 1 |
| Sticky OWee banner | `home.tsx` + `HomePromo.*` | 2 |
| "OWee" nav item | `NavigationBar.tsx` | 3 |

### 1. Removing the hero video

The video renders **above** the nav bar; the nav is `position: sticky`, so it simply starts below the fold and slides up into place as you scroll past the video. There is no scroll handler driving that — removing the video restores normal behaviour on its own.

1. In `src/pages/layout.tsx`, delete **three** things:
   ```tsx
   import HeroVideo from "./home/components/HeroVideo";   // delete
   const isHome = pathname === "/";                       // delete
   {isHome && <HeroVideo />}                              // delete
   ```
   `isHome` exists only to gate the hero, so `npm run check` fails with
   `TS6133: 'isHome' is declared but its value is never read` if you leave it
   behind. Keep `pathname` — the scroll-to-top effect still uses it.
2. Delete `src/pages/home/components/HeroVideo.tsx` and `HeroVideo.scss`.

Nothing else needs touching. Two hooks stay behind on purpose and both no-op once the video is gone:

- `src/components/Navigation Bar/animation.css` — `top: calc(var(--logo-top) + var(--hero-offset, 0px))`. `--hero-offset` is published by the hero so the fixed home logo rides down with the nav instead of floating over the video; it falls back to `0px` when nothing sets it.
- `src/pages/home/home.tsx` — `updateScrollProgress` offsets the logo animation by the hero's height. It *measures* the element (`?? 0`), so with no hero the offset is 0 and the animation behaves as it did before.

Leaving those in place means the video can be dropped back in next year without re-deriving them.

This was verified by actually doing it: with the hero gone the nav sits at the top of the page again, `--hero-offset` is unset so the logo `calc()` falls back to `0px`, and the logo animation runs over its original 0–384px scroll range.

### 2. Removing the OWee banner

1. In `src/pages/home/home.tsx`, delete the `HomePromo` import and the `<HomePromo />` line (it sits between `<TitleBar />` and `<HomeNieuws />`).
2. Optionally delete `src/pages/home/components/HomePromo.tsx` and `HomePromo.scss` — or keep them for next year, since nothing else imports them.

To keep the banner but change the dates or copy, edit `HomePromo.tsx` directly; the date chip and the two lines of text are plain strings.

### 3. Hiding the OWee nav item

The nav entries are toggled by commenting them out — the surrounding braces exist for exactly this. In `src/components/Navigation Bar/NavigationBar.tsx`, both the desktop (~line 118) and mobile (~line 202) copies:

```tsx
{/* <Item name="OWee" path="/owee" /> */}
{/* <Item name="OWee" path="/owee" onClick={closeMenu} /> */}
```

This only unlinks the page. The `/owee` route in `src/routes.ts` and everything under `src/pages/owee/` stay, so the page remains reachable by URL — that is intentional, and it is what gets uncommented next year.

### What not to revert

These landed alongside OWee mode but are general fixes. Undoing them will break things:

- **`#app_flex { overflow: clip }`** in `src/pages/layout.css` — it used to be `overflow: hidden`, which makes the element a scroll container and silently stops *any* `position: sticky` inside the page content from working. `clip` clips identically without that side effect.
- **`$nav_height`** in `src/variables.scss` — the nav bar's own height and anything pinning below it derive from this token.
- **`Changelog.json` entries** — a historical record; they stay even after the feature is removed.

## Overview

This project implements a registration and login flow using:
- **Faroe** (Go auth server) - Handles authentication primitives
- **Backend API** (Python) - Manages user data and newuser pre-registration
- **Frontend** (React with React Router 7) - User interface

## Architecture

### Components

1. **tiauth-faroe** (Port 12770)
   - Go-based Faroe server distribution
   - Handles signup, signin, password reset, etc.
   - Uses external user store (our Python backend)
   - Sends verification emails via SMTP

2. **dodeka/backend** (Port 12780)
   - Python API server using hfree
   - Implements Faroe user store protocol
   - Manages newusers pre-registration flow
   - Provides session management endpoints

3. **dodekafrontend** (this repo)
   - React application with React Router 7
   - Consumes both Faroe and backend APIs

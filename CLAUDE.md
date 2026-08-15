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

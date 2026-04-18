# Perfect Fit Game

![Perfect Fit Game Banner](PF-Repo-Banner.png)

Perfect Fit Game is a fast-paced 3D browser game focused on timing and shape matching.
Resize your player block to pass through incoming wall holes, build combo, and collect diamonds.

## Live Demo 🚀

Play online:
https://perfect-fit-game.vercel.app

## Features ✨

- 3D gameplay powered by React Three Fiber
- Reflex-based size-matching mechanic
- Combo scoring with increasing speed
- 8 unlockable themes and 8 trail effects
- In-game store using diamonds as currency
- Continue screen flow for high-score runs
- Settings for sound, haptics, effects, camera shake, and controls
- Multilingual UI support
- Mobile and desktop friendly controls

## Tech Stack

- React 19
- TypeScript
- Vite 6
- Three.js
- @react-three/fiber
- @react-three/drei
- Zustand (with persistent state)
- Tailwind CSS v4
- Framer Motion

## Gameplay 🎮

1. Start from the main menu.
2. Adjust the player block size to match each wall opening.
3. Use one of the available control modes:
   - Swipe mode: swipe up/down to resize.
   - Buttons mode: use on-screen arrows.
4. Pass walls to earn score and diamonds.
5. Difficulty increases as speed and level progress.
6. If you crash, the game ends or shows the continue prompt (when eligible).

## Local Setup

```bash
git clone https://github.com/ZainAntar/Perfect-Fit-Game.git
cd Perfect-Fit-Game
npm install
npm run dev
```

The dev server runs on port 3000 by default.

## Build for Production

```bash
npm run build
npm run preview
```

## Available Scripts

- npm run dev: starts the Vite dev server
- npm run build: creates a production build
- npm run preview: previews the production build locally
- npm run lint: runs TypeScript type checking

## Project Structure (Summary)

```text
Perfect-Fit-Game/
├─ src/
│  ├─ App.tsx
│  ├─ World.tsx
│  ├─ Player.tsx
│  ├─ UI.tsx
│  ├─ store.ts
│  ├─ levels.ts
│  └─ ...
├─ public/models/
├─ pf-assets/
├─ index.html
├─ vite.config.ts
└─ package.json
```

## Privacy and Terms

- Privacy policy: privacy.md
- Terms of service: terms.md

## Contributing

Contributions are welcome.
Please open a Pull Request from a dedicated feature branch.

## Contact

Zain Antar
antar.zain1@gmail.com

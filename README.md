# PIG Game 🎲

Two-player dice game built with Angular 19. Roll dice, accumulate points, and be the first to win!

## Play Online

Visit [virego.github.io](https://virego.github.io) to play!

## Features

- SVG-based dice with smooth animations
- Multi-language support (Russian, Ukrainian, Spanish, English)
- Dark/Light theme toggle
- 3 game modes: Classic, Bonus (doubles), Hard (6 penalty)
- Fully responsive: desktop, tablet, mobile
- Rules popup on mobile
- Custom language selector on mobile
- No scroll — fits exactly 100vh on all devices
- Cryptographically secure dice rolls (Crypto API)

## Development

```bash
cd pig-game
npm install
ng serve
```

Navigate to `http://localhost:4200/`

## Build & Deploy

```bash
ng build --configuration=production --base-href="/virego.github.io/"
```

Output: `pig-game/dist/pig-game/browser/`

Automatic deployment via GitHub Actions on push to `main`.

## Project Structure

```
pig-game/src/app/
├── components/
│   ├── dice/            # SVG dice
│   ├── game-board/      # Main game board
│   └── player-panel/    # Player score panel
└── services/
    ├── game.service.ts   # Game logic & state
    ├── i18n.service.ts   # Internationalization (4 langs)
    └── theme.service.ts  # Dark/Light theme
```

## License

MIT

# PIG Game 🎲

A fun two-player dice game built with Angular 19. Play against a friend and be the first to reach the winning score!

## 🎮 Game Rules

1. **Roll the dice** to accumulate points
2. If a **1 appears on any die** — you lose all round points
3. If **"Snake Eyes" (1+1)** are rolled — turn passes to opponent
4. Press **"Hold"** to lock in your accumulated points
5. First player to reach the set score **wins!**

### Game Modes

- **Classic** — Standard rules without modifiers
- **With Bonuses** — Double points when rolling doubles (6+6, 5+5, 4+4)!
- **Hard** — Rolling a 6 loses all round points

## 🚀 Play Online

Visit [virego.github.io](https://virego.github.io) to play!

## 🛠️ Development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
cd pig-game
npm install
```

### Run Locally

```bash
ng serve
```

Navigate to `http://localhost:4200/`

### Build for Production

```bash
ng build --configuration=production
```

## 📱 Features

- 🎲 SVG-based dice with smooth animations
- 🌍 Multi-language support (Russian, Ukrainian, Spanish, English)
- 🌙 Dark/Light theme toggle
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎯 Multiple game modes for variety
- 🔒 Cryptographically secure dice rolls

## 🚀 Deployment to GitHub Pages

### Automatic Deployment

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

### Manual Deployment

1. Build the project:
   ```bash
   ng build --configuration=production --base-href="/virego.github.io/"
   ```

2. Copy the contents of `dist/pig-game/browser/` to your `gh-pages` branch

3. Push to GitHub and enable Pages in repository settings

## 📁 Project Structure

```
pig-game/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dice/           # SVG dice component
│   │   │   ├── game-board/     # Main game board
│   │   │   └── player-panel/   # Player score panel
│   │   └── services/
│   │       ├── game.service.ts # Game logic & state
│   │       ├── i18n.service.ts # Internationalization
│   │       └── theme.service.ts# Theme management
│   ├── styles.scss             # Global styles & themes
│   └── index.html
└── angular.json
```

## 🎨 Technologies

- Angular 19
- Signals for state management
- CSS Custom Properties for theming
- Crypto API for secure random numbers

## 📄 License

MIT

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-player-panel',
  standalone: true,
  template: `
    <div class="panel" [class.active]="isActive()" [class.winner]="isWinner()">
      <div class="player-indicator"></div>
      <h2 class="player-name">{{ name() }}</h2>
      <div class="total-score">{{ totalScore() }}</div>
      <div class="current-box">
        <span class="current-label">{{ currentLabel() }}</span>
        <span class="current-score">{{ currentScore() }}</span>
      </div>
    </div>
  `,
  styles: [`
    .panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: clamp(0.5rem, 3vw, 2rem);
      opacity: 0.4;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      gap: clamp(0.3rem, 1.5vw, 1rem);
      min-height: 0;
    }
    .panel.active {
      opacity: 1;
    }
    .player-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .panel.active .player-indicator {
      opacity: 1;
      transform: scale(1);
    }
    .player-name {
      font-family: var(--font-display);
      font-size: clamp(0.65rem, 2.5vw, 1.2rem);
      text-transform: uppercase;
      letter-spacing: 0.3em;
      color: var(--text-secondary);
      font-weight: 300;
    }
    .panel.active .player-name {
      color: var(--text-primary);
      font-weight: 600;
    }
    .total-score {
      font-family: var(--font-display);
      font-size: clamp(2rem, 10vw, 5rem);
      font-weight: 100;
      color: var(--accent);
      line-height: 1;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .panel.active .total-score {
      transform: scale(1.1);
    }
    .panel.winner .total-score {
      animation: winner-pulse 1s ease-in-out infinite;
    }
    @keyframes winner-pulse {
      0%, 100% { transform: scale(1.1); }
      50% { transform: scale(1.2); }
    }
    .current-box {
      background: var(--accent);
      color: var(--accent-text);
      padding: clamp(0.3rem, 1.5vw, 0.75rem) clamp(0.75rem, 3vw, 2rem);
      border-radius: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.15rem;
      min-width: clamp(60px, 15vw, 120px);
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .panel.active .current-box {
      opacity: 1;
      transform: translateY(0);
    }
    .current-label {
      font-size: clamp(0.5rem, 1.5vw, 0.65rem);
      text-transform: uppercase;
      letter-spacing: 0.15em;
      opacity: 0.8;
    }
    .current-score {
      font-family: var(--font-display);
      font-size: clamp(0.9rem, 3vw, 1.5rem);
      font-weight: 600;
    }
  `],
})
export class PlayerPanelComponent {
  name = input.required<string>();
  totalScore = input<number>(0);
  currentScore = input<number>(0);
  currentLabel = input<string>('Current');
  isActive = input<boolean>(false);
  isWinner = input<boolean>(false);
}

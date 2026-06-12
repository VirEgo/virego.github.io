import { Injectable, signal, computed } from '@angular/core';

export type GamePhase = 'setup' | 'playing' | 'won';
export type GameMode = 'classic' | 'bonus' | 'hard';

export interface GameState {
  phase: GamePhase;
  scores: [number, number];
  currentScore: number;
  activePlayer: 0 | 1;
  dice: [number, number];
  winScore: number;
  isRolling: boolean;
  gameMode: GameMode;
  bonusMessage: string | null;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly _state = signal<GameState>({
    phase: 'setup',
    scores: [0, 0],
    currentScore: 0,
    activePlayer: 0,
    dice: [1, 1],
    winScore: 100,
    isRolling: false,
    gameMode: 'classic',
    bonusMessage: null,
  });

  readonly state = this._state.asReadonly();

  readonly activePlayerScore = computed(() => {
    const s = this._state();
    return s.scores[s.activePlayer];
  });

  readonly winner = computed(() => {
    const s = this._state();
    if (s.phase !== 'won') return null;
    return s.activePlayer === 0 ? 1 : 0;
  });

  startGame(winScore?: number, gameMode?: GameMode): void {
    const score = (winScore && winScore > 12) ? winScore : 100;
    this._state.set({
      phase: 'playing',
      scores: [0, 0],
      currentScore: 0,
      activePlayer: 0,
      dice: [1, 1],
      winScore: score,
      isRolling: false,
      gameMode: gameMode || 'classic',
      bonusMessage: null,
    });
  }

  rollDice(): void {
    const s = this._state();
    if (s.phase !== 'playing' || s.isRolling) return;

    this._state.update(st => ({ ...st, isRolling: true, bonusMessage: null }));

    setTimeout(() => {
      const dice1 = this.generateSecureDice();
      const dice2 = this.generateSecureDice();

      this._state.update(st => ({
        ...st,
        dice: [dice1, dice2],
        isRolling: false,
      }));

      if (dice1 === 1 && dice2 === 1) {
        setTimeout(() => this.switchPlayer('snakeEyes'), 600);
        return;
      }

      let roundPoints = dice1 + dice2;
      let bonusMsg: string | null = null;

      if (s.gameMode === 'hard' && (dice1 === 6 || dice2 === 6)) {
        this._state.update(st => ({
          ...st,
          currentScore: 0,
          bonusMessage: 'sixPenalty',
        }));
        setTimeout(() => this.switchPlayer(null), 600);
        return;
      }

      if (s.gameMode === 'bonus' && dice1 === dice2) {
        roundPoints *= 2;
        bonusMsg = 'doubleRolled';
      }

      this._state.update(st => ({
        ...st,
        currentScore: st.currentScore + roundPoints,
        bonusMessage: bonusMsg,
      }));
    }, 400);
  }

  private switchPlayer(reason: string | null): void {
    const s = this._state();
    const nextPlayer = s.activePlayer === 0 ? 1 : 0;
    this._state.set({
      ...s,
      phase: 'playing',
      currentScore: 0,
      activePlayer: nextPlayer,
      dice: [1, 1],
      bonusMessage: reason,
    });
  }

  private generateSecureDice(): number {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return (array[0] % 6) + 1;
    }
    return Math.floor(Math.random() * 6) + 1;
  }

  hold(): void {
    const s = this._state();
    if (s.phase !== 'playing' || s.currentScore === 0) return;

    const newScores: [number, number] = [...s.scores];
    newScores[s.activePlayer] += s.currentScore;

    if (newScores[s.activePlayer] >= s.winScore) {
      this._state.set({
        ...s,
        scores: newScores,
        currentScore: 0,
        dice: [1, 1],
        phase: 'won',
        bonusMessage: null,
      });
    } else {
      const nextPlayer = s.activePlayer === 0 ? 1 : 0;
      this._state.set({
        ...s,
        scores: newScores,
        currentScore: 0,
        activePlayer: nextPlayer,
        dice: [1, 1],
        bonusMessage: null,
      });
    }
  }

  resetGame(): void {
    this._state.set({
      phase: 'setup',
      scores: [0, 0],
      currentScore: 0,
      activePlayer: 0,
      dice: [1, 1],
      winScore: 100,
      isRolling: false,
      gameMode: 'classic',
      bonusMessage: null,
    });
  }
}

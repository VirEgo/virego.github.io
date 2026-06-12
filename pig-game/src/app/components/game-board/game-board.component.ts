import { Component, inject, signal, HostListener } from '@angular/core';
import { GameService, GameMode } from '../../services/game.service';
import { I18nService } from '../../services/i18n.service';
import { ThemeService } from '../../services/theme.service';
import { DiceComponent } from '../dice/dice.component';
import { PlayerPanelComponent } from '../player-panel/player-panel.component';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [DiceComponent, PlayerPanelComponent],
  template: `
    <div class="board" [class.won]="game.state().phase === 'won'">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <h1 class="title">{{ i18n.t('app.title') }}</h1>
        </div>
        <div class="header-right">
          <!-- Desktop lang buttons -->
          <div class="lang-switcher desktop-only">
            @for (lang of i18n.langs; track lang) {
              <button
                class="lang-btn"
                [class.active]="i18n.currentLang() === lang"
                (click)="i18n.setLang(lang)"
              >
                {{ i18n.langNames[lang] }}
              </button>
            }
          </div>
          <!-- Mobile custom select -->
          <div class="lang-select mobile-only">
            <button class="lang-select-trigger" (click)="toggleLang($event)">
              <span class="lang-select-current">{{ i18n.langNames[i18n.currentLang()] }}</span>
              <svg class="lang-select-arrow" [class.open]="langOpen()" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            @if (langOpen()) {
              <div class="lang-select-dropdown" (click)="$event.stopPropagation()">
                @for (lang of i18n.langs; track lang) {
                  <button
                    class="lang-select-option"
                    [class.active]="i18n.currentLang() === lang"
                    (click)="selectLang(lang, $event)"
                  >
                    {{ i18n.langNames[lang] }}
                  </button>
                }
              </div>
            }
          </div>
          <button class="theme-btn" (click)="theme.toggle()" [attr.aria-label]="i18n.t('theme.toggle')">
            @if (theme.theme() === 'dark') {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            } @else {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            }
          </button>
        </div>
      </header>

      <!-- Setup Phase -->
      @if (game.state().phase === 'setup') {
        <div class="setup-overlay">
          <div class="setup-layout">
            <!-- Rules Panel (desktop) -->
            <div class="rules-panel desktop-only">
              <h2 class="rules-title">{{ i18n.t('game.rulesTitle') }}</h2>
              <ul class="rules-list">
                <li>{{ i18n.t('game.rule1') }}</li>
                <li>{{ i18n.t('game.rule2') }}</li>
                <li>{{ i18n.t('game.rule3') }}</li>
                <li>{{ i18n.t('game.rule4') }}</li>
                <li>{{ i18n.t('game.rule5') }}</li>
                <li class="rule-bonus">{{ i18n.t('game.rule6') }}</li>
              </ul>
            </div>

            <!-- Setup Card -->
            <div class="setup-card">
              <div class="setup-icon">
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                  <rect x="2" y="2" width="46" height="46" rx="8" ry="8" fill="var(--accent)" stroke="var(--accent)" stroke-width="2"/>
                  <circle cx="12" cy="12" r="5" fill="var(--accent-text)"/>
                  <circle cx="38" cy="12" r="5" fill="var(--accent-text)"/>
                  <circle cx="25" cy="25" r="5" fill="var(--accent-text)"/>
                  <circle cx="12" cy="38" r="5" fill="var(--accent-text)"/>
                  <circle cx="38" cy="38" r="5" fill="var(--accent-text)"/>
                </svg>
              </div>

              <!-- Mobile rules button -->
              <button class="btn-rules-mobile mobile-only" (click)="rulesPopupOpen.set(true)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                {{ i18n.t('game.rulesTitle') }}
              </button>

              <p class="setup-text">{{ i18n.t('game.pressStart') }}</p>

              <!-- Game Mode -->
              <div class="mode-section">
                <label class="input-label">{{ i18n.t('game.variabilityLabel') }}</label>
                <div class="mode-buttons">
                  <button class="mode-btn" [class.active]="selectedMode() === 'classic'" (click)="selectedMode.set('classic')">
                    {{ i18n.t('game.modeClassic') }}
                  </button>
                  <button class="mode-btn" [class.active]="selectedMode() === 'bonus'" (click)="selectedMode.set('bonus')">
                    {{ i18n.t('game.modeBonus') }}
                  </button>
                  <button class="mode-btn" [class.active]="selectedMode() === 'hard'" (click)="selectedMode.set('hard')">
                    {{ i18n.t('game.modeHard') }}
                  </button>
                </div>
                <p class="mode-desc">
                  @switch (selectedMode()) {
                    @case ('classic') { {{ i18n.t('game.modeDescClassic') }} }
                    @case ('bonus') { {{ i18n.t('game.modeDescBonus') }} }
                    @case ('hard') { {{ i18n.t('game.modeDescHard') }} }
                  }
                </p>
              </div>

              <div class="input-group">
                <label class="input-label">{{ i18n.t('game.winScore') }}</label>
                <input
                  type="number"
                  class="score-input"
                  [placeholder]="i18n.t('game.defaultScore') + ' (100)'"
                  min="13"
                  #scoreInput
                />
              </div>
              <button class="btn btn-primary btn-start" (click)="startGame(scoreInput.value)">
                {{ i18n.t('game.start') }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Players -->
      @if (game.state().phase !== 'setup') {
        <div class="players">
          <app-player-panel
            [name]="i18n.t('game.player1')"
            [totalScore]="game.state().scores[0]"
            [currentScore]="game.state().activePlayer === 0 ? game.state().currentScore : 0"
            [currentLabel]="i18n.t('game.current')"
            [isActive]="game.state().activePlayer === 0 && game.state().phase !== 'won'"
            [isWinner]="game.state().phase === 'won' && game.winner() === 0"
          />
          <div class="center-divider"></div>
          <app-player-panel
            [name]="i18n.t('game.player2')"
            [totalScore]="game.state().scores[1]"
            [currentScore]="game.state().activePlayer === 1 ? game.state().currentScore : 0"
            [currentLabel]="i18n.t('game.current')"
            [isActive]="game.state().activePlayer === 1 && game.state().phase !== 'won'"
            [isWinner]="game.state().phase === 'won' && game.winner() === 1"
          />
        </div>
      }

      <!-- Win Score Badge -->
      @if (game.state().phase !== 'setup') {
        <div class="win-badge">{{ game.state().winScore }}</div>
      }

      <!-- Bonus Message -->
      @if (game.state().bonusMessage) {
        <div class="bonus-toast" [class.penalty]="game.state().bonusMessage === 'sixPenalty'">
          {{ i18n.t('game.' + game.state().bonusMessage!) }}
        </div>
      }

      <!-- Dice Area -->
      @if (game.state().phase !== 'setup' && game.state().phase !== 'won') {
        <div class="dice-area">
          <app-dice [value]="game.state().dice[0]" [rolling]="game.state().isRolling" />
          <app-dice [value]="game.state().dice[1]" [rolling]="game.state().isRolling" />
        </div>
      }

      <!-- Controls -->
      @if (game.state().phase === 'playing') {
        <div class="controls">
          <button class="btn btn-roll" (click)="game.rollDice()" [disabled]="game.state().isRolling">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/>
            </svg>
            {{ i18n.t('game.roll') }}
          </button>
          <button class="btn btn-hold" (click)="game.hold()" [disabled]="game.state().currentScore === 0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            {{ i18n.t('game.hold') }}
          </button>
        </div>
      }

      <!-- Winner Overlay -->
      @if (game.state().phase === 'won') {
        <div class="winner-overlay">
          <div class="winner-card">
            <div class="confetti">
              @for (i of confettiItems; track i) {
                <div class="confetti-piece" [style.--delay]="i * 0.1 + 's'" [style.--x]="(i * 37 % 100) + 'px'"></div>
              }
            </div>
            <h2 class="winner-title">
              {{ i18n.t('game.winnerMessage') }}
              {{ game.winner() === 0 ? i18n.t('game.player1') : i18n.t('game.player2') }}!
            </h2>
            <div class="winner-score">{{ game.state().scores[game.winner()!] }}</div>
            <button class="btn btn-primary" (click)="game.resetGame()">
              {{ i18n.t('game.newGame') }}
            </button>
          </div>
        </div>
      }

      <!-- Rules Popup (mobile) -->
      @if (rulesPopupOpen()) {
        <div class="popup-overlay" (click)="rulesPopupOpen.set(false)">
          <div class="popup-card" (click)="$event.stopPropagation()">
            <div class="popup-header">
              <h2 class="popup-title">{{ i18n.t('game.rulesTitle') }}</h2>
              <button class="popup-close" (click)="rulesPopupOpen.set(false)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <ul class="popup-rules-list">
              <li>{{ i18n.t('game.rule1') }}</li>
              <li>{{ i18n.t('game.rule2') }}</li>
              <li>{{ i18n.t('game.rule3') }}</li>
              <li>{{ i18n.t('game.rule4') }}</li>
              <li>{{ i18n.t('game.rule5') }}</li>
              <li class="rule-bonus">{{ i18n.t('game.rule6') }}</li>
            </ul>
            <button class="btn btn-primary popup-ok" (click)="rulesPopupOpen.set(false)">
              {{ i18n.t('game.ok') }}
            </button>
          </div>
        </div>
      }

      <!-- New Game Button -->
      @if (game.state().phase !== 'setup' && game.state().phase !== 'won') {
        <button class="btn-new-game" (click)="game.resetGame()">
          {{ i18n.t('game.newGame') }}
        </button>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .board {
      width: 100%;
      height: 100vh;
      height: 100dvh;
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      position: relative;
      padding: 0.75rem;
      gap: 0.5rem;
      overflow: hidden;
    }

    /* Visibility helpers */
    .desktop-only { display: flex; }
    .mobile-only { display: none; }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    .header-left { display: flex; align-items: center; }
    .header-right { display: flex; align-items: center; gap: 0.5rem; }
    .title {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    /* Lang Switcher (desktop) */
    .lang-switcher {
      display: flex;
      gap: 2px;
      background: var(--surface);
      border-radius: 8px;
      padding: 3px;
    }
    .lang-btn {
      border: none;
      background: transparent;
      color: var(--text-secondary);
      padding: 5px 8px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.65rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: all 0.2s;
    }
    .lang-btn:hover { color: var(--text-primary); background: var(--hover); }
    .lang-btn.active { background: var(--accent); color: var(--accent-text); }

    /* Lang Select (mobile) */
    .lang-select {
      position: relative;
    }
    .lang-select-trigger {
      background: var(--surface);
      border: none;
      border-radius: 8px;
      padding: 6px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    .lang-select-trigger:hover { background: var(--hover); }
    .lang-select-current {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-primary);
    }
    .lang-select-arrow {
      transition: transform 0.2s;
      color: var(--text-secondary);
      flex-shrink: 0;
    }
    .lang-select-arrow.open { transform: rotate(180deg); }
    .lang-select-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      z-index: 1000;
      min-width: 140px;
      overflow: hidden;
      animation: dropdownIn 0.15s ease-out;
    }
    @keyframes dropdownIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .lang-select-option {
      display: block;
      width: 100%;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      padding: 10px 14px;
      font-size: 0.8rem;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: background 0.15s;
    }
    .lang-select-option:hover { background: var(--hover); color: var(--text-primary); }
    .lang-select-option.active { background: var(--accent); color: var(--accent-text); font-weight: 600; }

    /* Theme Button */
    .theme-btn {
      border: none;
      background: var(--surface);
      color: var(--text-primary);
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .theme-btn:hover { background: var(--hover); transform: rotate(15deg); }

    /* Players */
    .players {
      display: flex;
      flex: 1;
      min-height: 0;
      background: var(--surface);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .center-divider {
      width: 1px;
      background: var(--border);
      margin: 1rem 0;
      flex-shrink: 0;
    }

    /* Win Badge */
    .win-badge {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: 48px;
      background: var(--accent);
      color: var(--accent-text);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 700;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      z-index: 5;
      border: 3px solid var(--bg);
    }

    /* Dice Area */
    .dice-area {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      padding: 0.5rem 0;
      flex-shrink: 0;
    }

    /* Controls */
    .controls {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-shrink: 0;
      padding-bottom: env(safe-area-inset-bottom, 0);
    }
    .btn {
      border: none;
      padding: 10px 24px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-primary { background: var(--accent); color: var(--accent-text); }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px var(--accent-shadow); }
    .btn-roll { background: var(--surface); color: var(--text-primary); border: 2px solid var(--border); }
    .btn-roll:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
    .btn-hold { background: var(--accent); color: var(--accent-text); }
    .btn-hold:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px var(--accent-shadow); }

    /* Setup */
    .setup-overlay {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 0;
    }
    .setup-layout {
      display: flex;
      gap: 1.5rem;
      width: 100%;
      max-width: 800px;
      animation: fadeInUp 0.5s ease-out;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Rules Panel (desktop) */
    .rules-panel {
      flex: 1;
      background: var(--surface);
      border-radius: 20px;
      padding: 1.5rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-height: 0;
    }
    .rules-title {
      font-family: var(--font-display);
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
      text-align: center;
    }
    .rules-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .rules-list li {
      font-size: 0.85rem;
      color: var(--text-secondary);
      padding-left: 20px;
      position: relative;
      line-height: 1.5;
    }
    .rules-list li::before {
      content: '•';
      position: absolute;
      left: 4px;
      color: var(--accent);
      font-weight: bold;
      font-size: 1.2em;
    }
    .rule-bonus { color: var(--accent) !important; font-weight: 600; }

    /* Setup Card */
    .setup-card {
      flex: 1;
      background: var(--surface);
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      min-height: 0;
    }
    .setup-icon { flex-shrink: 0; }
    .setup-text {
      font-size: 0.95rem;
      color: var(--text-secondary);
      text-align: center;
      flex-shrink: 0;
    }
    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      width: 100%;
    }
    .input-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-secondary);
    }
    .score-input {
      width: 100%;
      padding: 10px 14px;
      border: 2px solid var(--border);
      border-radius: 10px;
      background: var(--bg);
      color: var(--text-primary);
      font-size: 0.9rem;
      text-align: center;
      transition: border-color 0.2s;
    }
    .score-input:focus { outline: none; border-color: var(--accent); }
    .score-input::placeholder { color: var(--text-tertiary); }
    .btn-start { padding: 12px 36px; font-size: 0.95rem; width: 100%; justify-content: center; }

    /* Mobile rules button */
    .btn-rules-mobile {
      border: 2px solid var(--border);
      background: var(--bg);
      color: var(--text-primary);
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
      width: 100%;
      justify-content: center;
    }
    .btn-rules-mobile:hover { border-color: var(--accent); color: var(--accent); }

    /* Mode Section */
    .mode-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .mode-buttons {
      display: flex;
      gap: 6px;
    }
    .mode-btn {
      flex: 1;
      border: 2px solid var(--border);
      background: var(--bg);
      color: var(--text-secondary);
      padding: 8px 10px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .mode-btn:hover { border-color: var(--accent); color: var(--accent); }
    .mode-btn.active { background: var(--accent); border-color: var(--accent); color: var(--accent-text); }
    .mode-desc {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      text-align: center;
      min-height: 18px;
    }

    /* Winner Overlay */
    .winner-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .winner-card {
      background: var(--surface);
      border-radius: 24px;
      padding: 2.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 24px 48px rgba(0,0,0,0.2);
      position: relative;
      overflow: hidden;
      animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes scaleIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .confetti { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
    .confetti-piece {
      position: absolute;
      width: 8px;
      height: 8px;
      background: var(--accent);
      top: -10px;
      left: var(--x);
      animation: confettiFall 2s ease-in-out infinite;
      animation-delay: var(--delay);
      border-radius: 2px;
    }
    @keyframes confettiFall {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(300px) rotate(720deg); opacity: 0; }
    }
    .winner-title { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--text-primary); text-align: center; }
    .winner-score { font-family: var(--font-display); font-size: 3.5rem; font-weight: 100; color: var(--accent); }

    /* Bonus Toast */
    .bonus-toast {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--accent);
      color: var(--accent-text);
      padding: 14px 28px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      z-index: 200;
      animation: toastPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      white-space: nowrap;
    }
    .bonus-toast.penalty { background: var(--error); }
    @keyframes toastPop {
      0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }

    /* New Game */
    .btn-new-game {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      border: none;
      background: var(--surface);
      color: var(--text-secondary);
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.2s;
      z-index: 50;
    }
    .btn-new-game:hover { background: var(--accent); color: var(--accent-text); transform: translateY(-2px); }

    /* Popup */
    .popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 150;
      animation: fadeIn 0.2s ease-out;
      padding: 1rem;
    }
    .popup-card {
      background: var(--surface);
      border-radius: 20px;
      padding: 1.5rem;
      width: 100%;
      max-width: 360px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 24px 48px rgba(0,0,0,0.2);
      animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .popup-title {
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .popup-close {
      border: none;
      background: var(--bg);
      color: var(--text-secondary);
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .popup-close:hover { background: var(--hover); color: var(--text-primary); }
    .popup-rules-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .popup-rules-list li {
      font-size: 0.85rem;
      color: var(--text-secondary);
      padding-left: 20px;
      position: relative;
      line-height: 1.5;
    }
    .popup-rules-list li::before {
      content: '•';
      position: absolute;
      left: 4px;
      color: var(--accent);
      font-weight: bold;
    }
    .popup-ok { width: 100%; justify-content: center; }

    /* ============ TABLET (768-1024) ============ */
    @media (min-width: 769px) and (max-width: 1024px) {
      .board {
        padding: 1rem;
        gap: 0.75rem;
      }
      .title { font-size: 1.4rem; }
      .setup-layout { gap: 1.5rem; }
      .rules-panel { padding: 1.5rem; }
      .setup-card { padding: 1.5rem; }
      .dice-area { gap: 2rem; padding: 0.75rem 0; }
      .players { border-radius: 18px; }
    }

    /* ============ MOBILE (<=768) ============ */
    @media (max-width: 768px) {
      .desktop-only { display: none !important; }
      .mobile-only { display: flex !important; }

      .board {
        padding: 0.5rem;
        padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
        gap: 0.35rem;
      }
      .title { font-size: 1rem; }

      .setup-layout {
        flex-direction: column;
        gap: 0.75rem;
      }
      .rules-panel { display: none !important; }

      .setup-card {
        padding: 1rem;
        gap: 0.75rem;
        border-radius: 16px;
      }
      .setup-icon svg { width: 32px; height: 32px; }
      .setup-text { font-size: 0.85rem; }
      .mode-btn { padding: 6px 8px; font-size: 0.7rem; }
      .score-input { padding: 8px 12px; font-size: 0.85rem; }
      .btn-start { padding: 10px 24px; font-size: 0.85rem; }

      .players {
        border-radius: 14px;
      }
      .center-divider { margin: 0.5rem 0; }

      .win-badge { width: 40px; height: 40px; font-size: 1rem; border-width: 3px; }

      .dice-area { gap: 1rem; padding: 0.35rem 0; }

      .controls { gap: 0.75rem; padding-bottom: env(safe-area-inset-bottom, 0); }
      .controls .btn { padding: 10px 20px; font-size: 0.8rem; }

      .btn-new-game { bottom: 0.75rem; right: 0.75rem; font-size: 0.7rem; padding: 6px 12px; }

      .winner-card { padding: 1.5rem; border-radius: 18px; }
      .winner-title { font-size: 1.3rem; }
      .winner-score { font-size: 2.5rem; }
    }

    /* ============ SMALL MOBILE (<=480) ============ */
    @media (max-width: 480px) {
      .board { gap: 0.25rem; }
      .title { font-size: 0.9rem; }
      .header-right { gap: 0.35rem; }
      .theme-btn { width: 30px; height: 30px; }
      .theme-btn svg { width: 16px; height: 16px; }

      .setup-card { padding: 0.75rem; gap: 0.6rem; }
      .setup-text { font-size: 0.8rem; }
      .mode-btn { font-size: 0.65rem; padding: 5px 6px; }
      .input-label { font-size: 0.6rem; }
      .score-input { padding: 7px 10px; font-size: 0.8rem; }
      .btn-start { padding: 9px 20px; font-size: 0.8rem; }

      .controls .btn { padding: 8px 16px; font-size: 0.75rem; }

      .winner-card { padding: 1.2rem; }
      .winner-title { font-size: 1.1rem; }
      .winner-score { font-size: 2rem; }

      .btn-rules-mobile { padding: 6px 12px; font-size: 0.75rem; }
    }

    /* ============ LANDSCAPE MOBILE ============ */
    @media (max-height: 500px) and (orientation: landscape) {
      .board {
        flex-direction: row;
        flex-wrap: wrap;
        padding: 0.5rem;
        gap: 0.5rem;
      }
      .header { width: 100%; flex-shrink: 0; }
      .players {
        flex-direction: row;
        flex: 1 1 100%;
        min-height: 0;
        max-height: 55vh;
      }
      .center-divider { width: 1px; height: auto; margin: 0.5rem 0; }
      .setup-overlay { width: 100%; }
      .setup-layout { flex-direction: row; max-width: none; }
      .rules-panel { max-height: 70vh; overflow-y: auto; }
      .dice-area { width: 100%; padding: 0.25rem 0; }
      .controls { width: 100%; }
    }
  `],
})
export class GameBoardComponent {
  readonly game = inject(GameService);
  readonly i18n = inject(I18nService);
  readonly theme = inject(ThemeService);
  readonly confettiItems = Array.from({ length: 20 }, (_, i) => i);
  readonly selectedMode = signal<GameMode>('classic');
  readonly rulesPopupOpen = signal(false);
  readonly langOpen = signal(false);

  toggleLang(e: Event): void {
    e.stopPropagation();
    this.langOpen.set(!this.langOpen());
  }

  @HostListener('document:click')
  onDocClick(): void {
    this.langOpen.set(false);
  }

  selectLang(lang: I18nService['langs'][number], e: Event): void {
    e.stopPropagation();
    this.i18n.setLang(lang);
    this.langOpen.set(false);
  }

  startGame(value: string): void {
    const num = parseInt(value, 10);
    this.game.startGame(isNaN(num) ? undefined : num, this.selectedMode());
  }
}

import { Injectable, signal } from '@angular/core';

export type Lang = 'ru' | 'uk' | 'es' | 'en';

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  ru: {
    'app.title': 'Игра PIG',
    'game.start': 'Старт',
    'game.roll': 'Бросить кубик',
    'game.hold': 'Сохранить',
    'game.newGame': 'Новая игра',
    'game.score': 'Очки',
    'game.current': 'Текущие',
    'game.wins': 'Победил',
    'game.player1': 'Игрок 1',
    'game.player2': 'Игрок 2',
    'game.winScore': 'Очки для победы',
    'game.defaultScore': 'По умолчанию',
    'game.snakeEyes': 'Глаза змеи',
    'game.snakeEyesDesc': 'Выпало 1 и 1 на кубиках',
    'game.turnPasses': 'Ход переходит к',
    'game.ok': 'Хорошо',
    'game.pressStart': 'Нажмите «Старт» для начала игры',
    'game.winnerMessage': 'Победил',
    'theme.toggle': 'Сменить тему',
    'game.rulesTitle': 'Правила игры',
    'game.rule1': 'Бросайте кубики, чтобы набирать очки',
    'game.rule2': 'Если выпадает 1 на любом кубике — вы теряете все очки раунда',
    'game.rule3': 'Если выпадают «Глаза змеи» (1+1) — ход переходит к сопернику',
    'game.rule4': 'Нажмите «Сохранить», чтобы зафиксировать набранные очки',
    'game.rule5': 'Первый игрок, набравший заданное количество очков, побеждает!',
    'game.rule6': 'Бонус: двойные очки при выпадении дубля (6+6, 5+5, 4+4)!',
    'game.variabilityLabel': 'Режим игры',
    'game.modeClassic': 'Классический',
    'game.modeBonus': 'С бонусами',
    'game.modeHard': 'Сложный',
    'game.modeDescClassic': 'Стандартные правила без модификаторов',
    'game.modeDescBonus': 'Дополнительные очки за комбинации',
    'game.modeDescHard': 'При выпадении 6 — теряете весь счёт раунда',
    'game.doubleRolled': 'Дубль! Очки удвоены!',
    'game.sixPenalty': 'Выпала 6! Очки раунда сгорают!',
  },
  uk: {
    'app.title': 'Гра PIG',
    'game.start': 'Старт',
    'game.roll': 'Кинути кубик',
    'game.hold': 'Зберегти',
    'game.newGame': 'Нова гра',
    'game.score': 'Очки',
    'game.current': 'Поточні',
    'game.wins': 'Переміг',
    'game.player1': 'Гравець 1',
    'game.player2': 'Гравець 2',
    'game.winScore': 'Очки для перемоги',
    'game.defaultScore': 'За замовчуванням',
    'game.snakeEyes': 'Очі змії',
    'game.snakeEyesDesc': 'Випало 1 і 1 на кубиках',
    'game.turnPasses': 'Хід переходить до',
    'game.ok': 'Добре',
    'game.pressStart': 'Натисніть «Старт» для початку гри',
    'game.winnerMessage': 'Переміг',
    'theme.toggle': 'Змінити тему',
    'game.rulesTitle': 'Правила гри',
    'game.rule1': 'Кидайте кубики, щоб набирати очки',
    'game.rule2': 'Якщо випадає 1 на будь-якому кубику — ви втрачаєте всі очки раунду',
    'game.rule3': 'Якщо випадають «Очі змії» (1+1) — хід переходить до суперника',
    'game.rule4': 'Натисніть «Зберегти», щоб зафіксувати набрані очки',
    'game.rule5': 'Перший гравець, який набрав задану кількість очків, перемагає!',
    'game.rule6': 'Бонус: подвійні очки при випаданні дубля (6+6, 5+5, 4+4)!',
    'game.variabilityLabel': 'Режим гри',
    'game.modeClassic': 'Класичний',
    'game.modeBonus': 'З бонусами',
    'game.modeHard': 'Складний',
    'game.modeDescClassic': 'Стандартні правила без модифікаторів',
    'game.modeDescBonus': 'Додаткові очки за комбінації',
    'game.modeDescHard': 'При випаданні 6 — втрачаєте весь рахунок раунду',
    'game.doubleRolled': 'Дубль! Очки подвоєні!',
    'game.sixPenalty': 'Випала 6! Очки раунду згорають!',
  },
  es: {
    'app.title': 'Juego PIG',
    'game.start': 'Iniciar',
    'game.roll': 'Tirar dados',
    'game.hold': 'Guardar',
    'game.newGame': 'Nueva partida',
    'game.score': 'Puntos',
    'game.current': 'Actual',
    'game.wins': 'Ganó',
    'game.player1': 'Jugador 1',
    'game.player2': 'Jugador 2',
    'game.winScore': 'Puntos para ganar',
    'game.defaultScore': 'Por defecto',
    'game.snakeEyes': 'Ojos de serpiente',
    'game.snakeEyesDesc': 'Salieron 1 y 1 en los dados',
    'game.turnPasses': 'El turno pasa a',
    'game.ok': 'Aceptar',
    'game.pressStart': 'Presiona «Iniciar» para comenzar',
    'game.winnerMessage': 'Ganó',
    'theme.toggle': 'Cambiar tema',
    'game.rulesTitle': 'Reglas del juego',
    'game.rule1': 'Lanza los dados para acumular puntos',
    'game.rule2': 'Si sale 1 en cualquier dado — pierdes todos los puntos de la ronda',
    'game.rule3': 'Si salen «Ojos de serpiente» (1+1) — el turno pasa al oponente',
    'game.rule4': 'Presiona «Guardar» para fijar los puntos acumulados',
    'game.rule5': '¡El primer jugador en alcanzar la puntuación establecida gana!',
    'game.rule6': '¡Bonus: puntos dobles al sacar dobles (6+6, 5+5, 4+4)!',
    'game.variabilityLabel': 'Modo de juego',
    'game.modeClassic': 'Clásico',
    'game.modeBonus': 'Con bonificaciones',
    'game.modeHard': 'Difícil',
    'game.modeDescClassic': 'Reglas estándar sin modificadores',
    'game.modeDescBonus': 'Puntos extra por combinaciones',
    'game.modeDescHard': 'Al sacar 6 — pierdes toda la puntuación de la ronda',
    'game.doubleRolled': '¡Doble! ¡Puntos duplicados!',
    'game.sixPenalty': '¡Salió 6! ¡Los puntos de la ronda se pierden!',
  },
  en: {
    'app.title': 'PIG Game',
    'game.start': 'Start',
    'game.roll': 'Roll Dice',
    'game.hold': 'Hold',
    'game.newGame': 'New Game',
    'game.score': 'Score',
    'game.current': 'Current',
    'game.wins': 'Wins',
    'game.player1': 'Player 1',
    'game.player2': 'Player 2',
    'game.winScore': 'Score to win',
    'game.defaultScore': 'Default',
    'game.snakeEyes': 'Snake Eyes',
    'game.snakeEyesDesc': 'Rolled 1 and 1 on the dice',
    'game.turnPasses': 'Turn passes to',
    'game.ok': 'OK',
    'game.pressStart': 'Press «Start» to begin',
    'game.winnerMessage': 'Wins',
    'theme.toggle': 'Toggle theme',
    'game.rulesTitle': 'Game Rules',
    'game.rule1': 'Roll the dice to accumulate points',
    'game.rule2': 'If a 1 appears on any die — you lose all round points',
    'game.rule3': 'If «Snake Eyes» (1+1) are rolled — turn passes to opponent',
    'game.rule4': 'Press «Hold» to lock in your accumulated points',
    'game.rule5': 'First player to reach the set score wins!',
    'game.rule6': 'Bonus: double points when rolling doubles (6+6, 5+5, 4+4)!',
    'game.variabilityLabel': 'Game Mode',
    'game.modeClassic': 'Classic',
    'game.modeBonus': 'With Bonuses',
    'game.modeHard': 'Hard',
    'game.modeDescClassic': 'Standard rules without modifiers',
    'game.modeDescBonus': 'Extra points for combinations',
    'game.modeDescHard': 'Rolling a 6 — lose all round points',
    'game.doubleRolled': 'Double! Points doubled!',
    'game.sixPenalty': 'Rolled 6! Round points burned!',
  },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly currentLang = signal<Lang>(this.loadLang());
  readonly langs: Lang[] = ['ru', 'uk', 'es', 'en'];

  readonly langNames: Record<Lang, string> = {
    ru: 'Русский',
    uk: 'Українська',
    es: 'Español',
    en: 'English',
  };

  t(key: string): string {
    const lang = this.currentLang();
    return TRANSLATIONS[lang]?.[key] ?? key;
  }

  constructor() {}

  setLang(lang: Lang): void {
    this.currentLang.set(lang);
    localStorage.setItem('pig-game-lang', lang);
  }

  private loadLang(): Lang {
    const saved = localStorage.getItem('pig-game-lang') as Lang | null;
    if (saved && saved in TRANSLATIONS) return saved;
    const browserLang = navigator.language.substring(0, 2) as Lang;
    if (browserLang in TRANSLATIONS) return browserLang;
    return 'en';
  }
}

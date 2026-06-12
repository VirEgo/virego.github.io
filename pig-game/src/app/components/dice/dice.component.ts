import { Component, input, computed } from '@angular/core';

const DOT_POSITIONS: Record<number, { cx: number; cy: number }[]> = {
  1: [{ cx: 25, cy: 25 }],
  2: [{ cx: 12, cy: 12 }, { cx: 38, cy: 38 }],
  3: [{ cx: 12, cy: 12 }, { cx: 25, cy: 25 }, { cx: 38, cy: 38 }],
  4: [{ cx: 12, cy: 12 }, { cx: 38, cy: 12 }, { cx: 12, cy: 38 }, { cx: 38, cy: 38 }],
  5: [{ cx: 12, cy: 12 }, { cx: 38, cy: 12 }, { cx: 25, cy: 25 }, { cx: 12, cy: 38 }, { cx: 38, cy: 38 }],
  6: [{ cx: 12, cy: 12 }, { cx: 38, cy: 12 }, { cx: 12, cy: 25 }, { cx: 38, cy: 25 }, { cx: 12, cy: 38 }, { cx: 38, cy: 38 }],
};

@Component({
  selector: 'app-dice',
  standalone: true,
  template: `
    <svg
      [attr.viewBox]="'0 0 50 50'"
      [class.rolling]="rolling()"
      class="dice-svg"
    >
      <rect
        x="2" y="2" width="46" height="46" rx="8" ry="8"
        [attr.fill]="bgColor()"
        [attr.stroke]="borderColor()"
        stroke-width="2"
      />
      @for (dot of dots(); track dot.cx + '-' + dot.cy) {
        <circle
          [attr.cx]="dot.cx"
          [attr.cy]="dot.cy"
          r="5"
          [attr.fill]="dotColor()"
        />
      }
    </svg>
  `,
  styles: [`
    :host { display: inline-block; }
    .dice-svg {
      width: clamp(48px, 12vw, 80px);
      height: clamp(48px, 12vw, 80px);
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .dice-svg.rolling {
      animation: roll 0.4s ease-in-out;
    }
    @keyframes roll {
      0% { transform: rotate(0deg) scale(1); }
      25% { transform: rotate(90deg) scale(0.85); }
      50% { transform: rotate(180deg) scale(1.05); }
      75% { transform: rotate(270deg) scale(0.9); }
      100% { transform: rotate(360deg) scale(1); }
    }
  `],
})
export class DiceComponent {
  value = input.required<number>();
  rolling = input<boolean>(false);

  protected readonly bgColor = computed(() => {
    return 'var(--dice-bg)';
  });

  protected readonly borderColor = computed(() => {
    return 'var(--dice-border)';
  });

  protected readonly dotColor = computed(() => {
    return 'var(--dice-dot)';
  });

  protected readonly dots = computed(() => {
    const v = Math.max(1, Math.min(6, this.value()));
    return DOT_POSITIONS[v];
  });
}

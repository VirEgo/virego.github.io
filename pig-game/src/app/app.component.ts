import { Component } from '@angular/core';
import { GameBoardComponent } from './components/game-board/game-board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameBoardComponent],
  template: `<app-game-board />`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
  `],
})
export class AppComponent {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from './../../models/game';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard: string | undefined = '';
  game: Game | undefined; //Variable vom Typ game

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  
  takeCard() {
    if (!this.pickCardAnimation && this.game !== undefined) {
      this.currentCard = this.game.stack.pop(); //nimmt letzten Wert aus Array, gibt Wert zurück, gleichzeitig wird dieser aus Array entfernt
      console.log(this.currentCard)
      this.pickCardAnimation = true;

      setTimeout(() => {
        this.pickCardAnimation = false;
      }, 1500);

    }
  }


}

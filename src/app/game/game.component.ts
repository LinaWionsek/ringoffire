import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from './../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    GameInfoComponent

  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard?: string = '';
  game?: Game; //Variable vom Typ game

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
    console.log('PLAYER', this.game!.currentPlayer)
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game?.stack.pop(); //nimmt letzten Wert aus Array, gibt Wert zurück, gleichzeitig wird dieser aus Array entfernt
      this.pickCardAnimation = true;
   
      this.game!.currentPlayer++;
      this.game!.currentPlayer = this.game!.currentPlayer % this.game!.players.length;
      // modulo sorgt dafür das obwohl currentplayer immer hoch gezählt wird, 
      //das auf die anzahl der spieler gerechnet wird und wieder bei 0 angefnagen wird, wenn alle spieler dran waren
      //after card animation finished (1000ms), push currentCard to playedCards
      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game?.playedCards.push(this.currentCard!);
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    //neue Funktion wird aufgerufen mit der variable result (die dialog textfeld eingegeben wird)
    dialogRef.afterClosed().subscribe((result: string) => {
      if(result &&result.length > 0){
        this.game?.players.push(result)
      }
    });
  }
}

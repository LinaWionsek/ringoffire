import { COMPILER_OPTIONS, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from './../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { SaveGameService } from '../firebase-services/save-game/save-game.service';
import { addDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { GameInterface } from '../interfaces/game.interface';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard?: string = '';
  gameId: string = '';
  game?: Game; //Variable vom Typ game

  constructor(
    public dialog: MatDialog,
    private SaveGameService: SaveGameService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params) => {
      this.gameId = params['gameId'];
      console.log('GAMEID', this.gameId);
    });

    this.newGame();
  }

  async newGame() {
    this.game = new Game();
    if (this.gameId === undefined) {
   
      this.SaveGameService.addGame(this.game?.toJson);
    } else {
      
      let gameUpdate = await this.SaveGameService.getGameById(this.gameId);
      this.setGameData(gameUpdate);
     
    }
  }

  setGameData(gameUpdate: GameInterface) {
      this.game!.players = gameUpdate.players;
      this.game!.stack = gameUpdate.stack;
      this.game!.playedCards = gameUpdate.playedCards;
      this.game!.currentPlayer = gameUpdate.currentPlayer;
    
  }

  takeCard() {
    console.log(this.game, "TAKE CARD")
    if (!this.pickCardAnimation) {
      this.currentCard = this.game?.stack.pop(); //nimmt letzten Wert aus Array, gibt Wert zurück, gleichzeitig wird dieser aus Array entfernt
      this.pickCardAnimation = true;
      // (currentPlayer + 1) % length;
      this.game!.currentPlayer++;
      this.game!.currentPlayer =
        this.game!.currentPlayer % this.game!.players.length;
      // modulo sorgt dafür das obwohl currentplayer immer hoch gezählt wird,
      //das auf die anzahl der spieler gerechnet wird und wieder bei 0 angefnagen wird, wenn alle spieler dran waren
      //after card animation finished (1000ms), push currentCard to playedCards
      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game!.playedCards.push(this.currentCard!);
        this.SaveGameService.updateGame(
          this.gameId,
          {
            players: this.game!.players,
            stack: this.game!.stack,
            playedCards: this.game!.playedCards,
            currentPlayer: this.game!.currentPlayer,
          }
    
        );
      }, 1000);

    
    }
  }

  

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    //neue Funktion wird aufgerufen mit der variable result (die dialog textfeld eingegeben wird)
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result && result.length > 0) {
        this.game!.players.push(result);
        this.SaveGameService.updateGame(this.gameId, {
          players: this.game!.players,
          stack: this.game!.stack,
          playedCards: this.game!.playedCards,
          currentPlayer: this.game!.currentPlayer,
        });
      }
    });
  }
}

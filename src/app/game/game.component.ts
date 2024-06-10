import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from './../../models/game';
import { PlayerComponent } from '../player/player.component';
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { SaveGameService } from '../firebase-services/save-game/save-game.service';
import { DocumentData, addDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Firestore, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    PlayerMobileComponent,
    MatButtonModule,
    MatIconModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  // pickCardAnimation = false;
  // currentCard?: string = '';
  gameId: string = '';
  game?: Game; //Variable vom Typ game
  firestore: Firestore = inject(Firestore);
  gameEnd: boolean = false;

  constructor(
    public dialog: MatDialog,
    private SaveGameService: SaveGameService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params) => {
      this.gameId = params['gameId'];
    });

    this.newGame();
  }

  async newGame() {
    this.game = new Game();
    this.SaveGameService.addGame(this.game?.toJson());
    const q = this.SaveGameService.getSingleDocRef('games', this.gameId);
    onSnapshot(q, (singleGame) => {
      console.log(singleGame.data(), 'IDDDDDDDDDDDDDDDDDDDDDD');
      let gamedata = singleGame.data();
      if (gamedata) {
        this.setGameData(gamedata);
      }
    });
  }

  setGameData(gameUpdate: DocumentData) {
    this.game!.players = gameUpdate['players'];
    this.game!.stack = gameUpdate['stack'];
    this.game!.playedCards = gameUpdate['playedCards'];
    this.game!.currentPlayer = gameUpdate['currentPlayer'];
    this.game!.currentCard = gameUpdate['currentCard'];
    this.game!.pickCardAnimation = gameUpdate['pickCardAnimation'];
  }

  takeCard() {
    if (this.game!.players.length > 0) {
      if (!this.game!.pickCardAnimation) {
        this.animateCard();
        this.saveGame();
        this.updatePlayedCardStack();
      }
    } else {
      alert('Please create a player first!');
    }
  }

  animateCard() {
    // modulo sorgt dafür das obwohl currentplayer immer hoch gezählt wird,
    //das auf die anzahl der spieler gerechnet wird und wieder bei 0 angefnagen wird, wenn alle spieler dran waren
    //after card animation finished (1000ms), push currentCard to playedCards
    let poper = this.game?.stack.pop();
    this.game!.currentCard = poper ? poper : ''; //nimmt letzten Wert aus Array, gibt Wert zurück, gleichzeitig wird dieser aus Array entfernt
    this.game!.pickCardAnimation = true;
    this.game!.currentPlayer++; // (currentPlayer + 1) % length;
    this.game!.currentPlayer =
      this.game!.currentPlayer % this.game!.players.length;
  }

  updatePlayedCardStack() {
    setTimeout(() => {
      this.game!.pickCardAnimation = false;
      this.game!.playedCards.push(this.game!.currentCard!);
      this.saveGame();
      if (this.game!.playedCards.length === 2) {
        this.endGame();
      }
    }, 1000);
  }

  endGame() {
    this.gameEnd = true;
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }

  saveGame() {
    this.SaveGameService.updateGame(this.gameId, {
      players: this.game!.players,
      stack: this.game!.stack,
      playedCards: this.game!.playedCards,
      currentPlayer: this.game!.currentPlayer,
      currentCard: this.game!.currentCard,
      pickCardAnimation: this.game!.pickCardAnimation,
    });
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    //neue Funktion wird aufgerufen mit der variable result (die dialog textfeld eingegeben wird)
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result && result.length > 0) {
        this.game!.players.push(result);
        this.saveGame();
      }
    });
  }
  /* /////////////////////////////////////// */
}

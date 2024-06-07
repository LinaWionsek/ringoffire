import { COMPILER_OPTIONS, Component } from '@angular/core';
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
import { GameInterface } from '../interfaces/game.interface';

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

  constructor(
    public dialog: MatDialog,
    private SaveGameService: SaveGameService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params) => {
      this.gameId = params['gameId'];
      console.log('GAMEID', this.gameId);

      //-------------------------------------\
      // const q = this.SaveGameService.getSingleDocRef('games', this.gameId);

      // onSnapshot(q, (singleGame) => {
      //   console.log(singleGame.data(), 'IDDDDDDDDDDDDDDDDDDDDDD');
      //   let gamedata = singleGame.data();
      //   if (this.game) {
      //     this.game.players = gamedata!['players'];
      //     this.game.stack = gamedata!['players'];
      //     this.game.playedCards = gamedata!['playedCards'];
      //     this.game.currentPlayer = gamedata!['currentPlayer'];
      //     this.game.currentCard = gamedata!['currentCard'];
      //   }
      // });
      //-------------------------------------\
    });

    this.newGame();
  }

  async newGame() {
    //GlEICH
    this.game = new Game();
    this.SaveGameService.addGame(this.game?.toJson());
    //ALT
    // let gameUpdate = await this.SaveGameService.getGameById(this.gameId);
    // this.setGameData(gameUpdate);

    //NEU
    //-------------------------------------\
    const q = this.SaveGameService.getSingleDocRef('games', this.gameId);
    onSnapshot(q, (singleGame) => {
      console.log(singleGame.data(), 'IDDDDDDDDDDDDDDDDDDDDDD');
      let gamedata = singleGame.data();
      if (gamedata) {
        this.setGameData(gamedata);
      }
    });
    //-------------------------------------\
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
      console.log(this.game, 'TAKE CARD');
      if (!this.game!.pickCardAnimation) {
      
        let poper = this.game?.stack.pop();
        this.game!.currentCard = poper ? poper : ''; //nimmt letzten Wert aus Array, gibt Wert zurück, gleichzeitig wird dieser aus Array entfernt
        this.game!.pickCardAnimation = true;
       
        // (currentPlayer + 1) % length;
        this.game!.currentPlayer++;
        this.game!.currentPlayer =
        this.game!.currentPlayer % this.game!.players.length;
        // modulo sorgt dafür das obwohl currentplayer immer hoch gezählt wird,
        //das auf die anzahl der spieler gerechnet wird und wieder bei 0 angefnagen wird, wenn alle spieler dran waren
        //after card animation finished (1000ms), push currentCard to playedCards
        this.saveGame();
        // PICK CARD ANIMATION BOOL IST NICHT AUFM SERVER GESPEICHERT!
        setTimeout(() => {
          this.game!.pickCardAnimation = false;
          this.game!.playedCards.push(this.game!.currentCard!);
          console.log("SAVE")
          this.saveGame();
        }, 1000);
      }
    } else {
      alert('Please create a player first!');
    }

   
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

  /* /////////////////////////////////////// */
}

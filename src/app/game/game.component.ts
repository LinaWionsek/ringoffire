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


  /**
 * Initializes the component and subscribes to the route parameters to get the gameId.
 * Calls the newGame() method to initialize a new game.
 *
 * @return {Promise<void>} A promise that resolves when the initialization is complete.
 */
  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params) => {
      this.gameId = params['gameId'];
    });
    this.newGame();
  }


  /**
   * Initializes the component and subscribes to the route parameters to get the gameId.
   * Calls the newGame() method to initialize a new game.
   *
   */
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


  /**
   * Updates the game data with the provided game update.
   *
   * @param {DocumentData} gameUpdate - The game update containing the new data.
   */
  setGameData(gameUpdate: DocumentData) {
    this.game!.players = gameUpdate['players'];
    this.game!.stack = gameUpdate['stack'];
    this.game!.playedCards = gameUpdate['playedCards'];
    this.game!.currentPlayer = gameUpdate['currentPlayer'];
    this.game!.currentCard = gameUpdate['currentCard'];
    this.game!.pickCardAnimation = gameUpdate['pickCardAnimation'];
  }


  /**
   * Takes a card from the game if there are players and the pick card animation is not active.
   * Saves the game and updates the played card stack.
   * Displays an alert message if there are no players.
   */
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


  /**
   * Animates a card by popping it from the game stack, setting it as the current card,
   * enabling the card animation, incrementing the current player, and wrapping around
   * to the first player if all players have played their turn. After the animation
   * finishes, the current card is pushed to the played cards array.
   */
  animateCard() {
    let poper = this.game?.stack.pop();
    this.game!.currentCard = poper ? poper : ''; //takes last value from array, returns value, at the same time this is removed from the array
    this.game!.pickCardAnimation = true;
    this.game!.currentPlayer++; // (currentPlayer + 1) % length;
    this.game!.currentPlayer =
      this.game!.currentPlayer % this.game!.players.length;
    // modulo ensures that although currentplayer is always counted up,
    // that is calculated on the number of players and starts again at 0 when all players have had their turn
  }


  /**
   * Updates the played card stack by setting the pick card animation to false,
   * pushing the current card to the played cards array, saving the game, and
   * ending the game if the number of played cards is equal to 2.
   *
   */
  updatePlayedCardStack() {
    setTimeout(() => {
      this.game!.pickCardAnimation = false;
      this.game!.playedCards.push(this.game!.currentCard!);
      this.saveGame();
      if (this.game!.playedCards.length === 2) {
        this.endGame();
      }
      // after card animation finished (1000ms), push currentCard to playedCards
    }, 1000);
  }


  /**
   * 
   * Ends the game and navigates to the root route after a delay of 3000 milliseconds.
   *
   */
  endGame() {
    this.gameEnd = true;
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }


  /**
   * Saves the game by calling the `updateGame` method of the `SaveGameService` with the current game data.
   *
   */
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


  /**
   * Opens a dialog to add a player to the game.
   *
   */
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
}

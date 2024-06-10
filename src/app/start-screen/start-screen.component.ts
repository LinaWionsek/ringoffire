import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from './../../models/game';
import { SaveGameService } from './../firebase-services/save-game/save-game.service';
import { addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})

export class StartScreenComponent {
  // private router because router just using in this component, not in another (like html file)
  constructor(
    private router: Router,
    private SaveGameService: SaveGameService
  ) {}

  
  /**
   * Asynchronously creates a new game and adds it to the Firestore database.
   * After successfully adding the game, navigates to the game details page.
   *
   * @return {Promise<void>} A promise that resolves when the game is added and navigation is complete.
   */
  async newGame() {
    let game = new Game();
    await addDoc(this.SaveGameService.getGamesRef(), game.toJson())
      .catch((err) => {
        console.error(err);
      })
      .then((gameInfo) => {
        console.log('Document written with ID: ', gameInfo?.id);
        // Start game
        this.router.navigateByUrl('/game/' + gameInfo!.id);
      });
  }
}

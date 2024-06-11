import { Injectable, inject } from '@angular/core';
import { GameInterface } from '../../interfaces/game.interface';
import {
  Firestore,
  collection,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  updateDoc,
} from '@angular/fire/firestore';

//MEhstJaJCoeuwGniOeXw

@Injectable({
  providedIn: 'root',
})
export class SaveGameService {
  unsubGames: any;
  modifiedGame: any = [];
  firestore: Firestore = inject(Firestore);

  constructor() {
    // this.unsubGames = this.subGamesList();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.unsubGames();
  }



  /**
   * Updates a game document in the 'games' collection with the provided game data.
   *
   * @param {string} docId - The ID of the document to update.
   * @param {GameInterface} game - The updated game data.
   * @return {Promise<void>} - A promise that resolves when the update is complete.
   */
  async updateGame(docId: string, game: GameInterface) {
    const docRef = doc(this.firestore, 'games', docId);
    await updateDoc(docRef, this.getCleanJson(game));
  }

  /**
   * Returns a clean JSON representation of the given GameInterface object.
   *
   * @param {GameInterface} game - The GameInterface object to be converted to clean JSON.
   */
  getCleanJson(game: GameInterface): {} {
    return {
      players: game.players,
      stack: game.stack,
      playedCards: game.playedCards,
      currentPlayer: game.currentPlayer,
      currentCard: game.currentCard,
      pickCardAnimation: game.pickCardAnimation,
    };
  }

  /**
   * Asynchronously adds a new game to the 'games' collection in Firestore.
   *
   * @param {GameInterface} game - The game object to be added.
   * @return {Promise<void>} - A promise that resolves when the game is added successfully.
   */
  async addGame(game: GameInterface) {
    await addDoc(this.getGamesRef(), game);
  }

  getGamesRef() {
    return collection(this.firestore, 'games'); //this.firebase - Datenbank, notes - Referenz
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId); //docId ist dieser Zahlensalat der an dem Eintrag klebt
  }

  /* ------------------- */
}

import { Injectable, inject } from '@angular/core';
import { GameInterface } from '../../interfaces/game.interface';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SaveGameService {
  firestore: Firestore = inject(Firestore);

  constructor() {}


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
      gameEnd: game.gameEnd,
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


  /**
   * Returns a reference to the 'games' collection in the Firestore database.
   *
   * @return {CollectionReference} A reference to the 'games' collection.
   */
  getGamesRef() {
    return collection(this.firestore, 'games'); 
  }


  /**
   * Returns a reference to a single document in the specified collection with the given document ID.
   *
   * @param {string} colId - The ID of the collection.
   * @param {string} docId - The ID of the document.
   * @return {DocumentReference} A reference to the specified document.
   */
  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId); //docId ist dieser Zahlensalat der an dem Eintrag klebt
  }
}

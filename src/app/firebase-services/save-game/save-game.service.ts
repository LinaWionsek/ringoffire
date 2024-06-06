import { Injectable, inject } from '@angular/core';
import { GameInterface } from '../../interfaces/game.interface';
import {
  Firestore,
  collection,
  collectionData,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  query,
  where,
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
    this.unsubGames();
  }

  subGamesList(gameId: string) {
    // console.log(this.getSingleDocRef('games', gameId));
    const q = this.getSingleDocRef('games', gameId);
    return onSnapshot(q, (singleGame) => {
      // this.modifiedGame = [];

      console.log(singleGame.id);
    });
  }

  async updateGame(docId: string, game: GameInterface) {
    const docRef = doc(this.firestore, 'games', docId);
    await updateDoc(docRef, this.getCleanJson(game));
  }

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


  /* ------------------- */
  async addGame(game: GameInterface) {
    await addDoc(this.getGamesRef(), game);
  }

  async getGameById(docId: string) : Promise<GameInterface> {
    const docRef = doc(this.firestore, 'games', docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      return  {
        players: docSnap.data()['players'],
        stack: docSnap.data()['stack'],
        playedCards: docSnap.data()['playedCards'],
        currentPlayer: docSnap.data()['currentPlayer'],
        currentCard: docSnap.data()['currentCard'],
        pickCardAnimation: docSnap.data()['pickCardAnimation']
      };
      
    } else {
      // docSnap.data() will be undefined in this case
      console.log('No such document!');
      return  {
        players: [],
        stack: [],
        playedCards: [],
        currentPlayer: 0,
        currentCard: '',
        pickCardAnimation: false
      };
    }
    // const docSnap = await this.getSingleDocRef('games', docId);
    // console.log(docSnap.data(), 'getgamebyid');
    // this.getCleanJson(docSnap.data());
  }

  getGamesRef() {
    return collection(this.firestore, 'games'); //this.firebase - Datenbank, notes - Referenz
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId); //docId ist dieser Zahlensalat der an dem Eintrag klebt
  }

  /* ------------------- */
}

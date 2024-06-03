import { Injectable, inject } from '@angular/core';
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
  unsubGames : any;
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

  async updateGame(docId: string, item: {}) {
    const docRef = doc(this.firestore, 'games', docId);
    await updateDoc(docRef, item);
  }


  /* ------------------- */
  async addGame(game: {}) {
    await addDoc(this.getGamesRef(), game);
  }

  async getGameById(docId: string, item: {}) {
    const docRef = doc(this.firestore, 'games', docId);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());

    return docSnap.data();
  }

  getGamesRef() {
    return collection(this.firestore, 'games'); //this.firebase - Datenbank, notes - Referenz
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId); //docId ist dieser Zahlensalat der an dem Eintrag klebt
  }

  /* ------------------- */
}

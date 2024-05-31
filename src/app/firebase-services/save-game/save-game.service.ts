import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  onSnapshot,
  doc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SaveGameService {
  unsubGames;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubGames = this.subGamesList();
    // this.unsubGames();
  }

  subGamesList() {
    return onSnapshot(this.getGamesRef(), (list) => {
      console.log(list)
      list.forEach((element)=>{
        console.log(element.data())
      })
    });
  }

  getGamesRef() {
    return collection(this.firestore, 'games'); //this.firebase - Datenbank, notes - Referenz
    
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId); //docId ist dieser Zahlensalat der an dem Eintrag klebt
  }

  /* ------------------- */
}

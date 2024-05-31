import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-21926","appId":"1:149291365779:web:c744950925efc99c8da466","storageBucket":"ring-of-fire-21926.appspot.com","apiKey":"AIzaSyAuMaIEDvGTboEVgYNxWekSXWTwymRDMto","authDomain":"ring-of-fire-21926.firebaseapp.com","messagingSenderId":"149291365779"})), provideFirestore(() => getFirestore())]
};

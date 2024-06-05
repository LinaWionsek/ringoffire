import { Routes } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
    {path: '', component: StartScreenComponent},
    {path: 'game', component: GameComponent}, 
    {path: 'game/:gameId', component: GameComponent} 
    //doppelpunkt - nach diesem game und slash kommt eine Id (ist eine variable)
    //route verfügt über eine variable
];

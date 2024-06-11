export interface GameInterface {
     players: string[], 
     stack: string[],
     playedCards: string[],
     currentPlayer: number,
     currentCard: string,
     pickCardAnimation: boolean;
     gameEnd: boolean;
}

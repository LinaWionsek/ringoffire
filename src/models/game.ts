export class Game {
    public players: string[] = [];
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
}
// public weil wir in anderen Dateien darauf zugreifen wollen
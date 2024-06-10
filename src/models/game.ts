export class Game {
  public players: string[] = [];
  public stack: string[] = [];
  public playedCards: string[] = [];
  public currentPlayer: number = 0;
  public currentCard: string = '';
  public pickCardAnimation = false;


  /**
   * Initializes the game by populating the stack with card names and shuffling the stack.
   *
   * @return {void} This function does not return anything.
   */
  constructor() {
    for (let i = 1; i < 14; i++) {
      this.stack.push('ace_' + i);
      this.stack.push('clubs_' + i);
      this.stack.push('hearts_' + i);
      this.stack.push('diamonds_' + i);
    }
    shuffle(this.stack);
  }


  /**
   * Returns a JSON representation of the current object.
   * It includes the values of the properties of the object.
   *
   * @return {Object} The JSON representation of the object.
   */
  public toJson() {  //public because we want to access it in other files
    return {
      players: this.players,
      stack: this.stack,
      playedCards: this.playedCards,
      currentPlayer: this.currentPlayer,
      currentCard: this.currentCard,
      pickCardAnimation: this.pickCardAnimation,
    };
  }
}


/**
 * Shuffles the elements of an array in place using the Fisher-Yates algorithm.
 *
 * @param {string[]} array - The array to be shuffled.
 * @return {void} This function does not return anything.
 */
function shuffle(array: string[]) {
  let currentIndex = array.length;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

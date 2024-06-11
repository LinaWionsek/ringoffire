import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-game-info',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.scss',
})

export class GameInfoComponent {
  cardAction = [
    {
      title: 'WATERFALL',
      description:
        'The cardholder starts to drink, and the players must drink continuously until the cardholder stops.',
    },
    {
      title: 'YOU',
      description: 'Nominate someone to drink.',
    },
    {
      title: 'ME',
      description: 'You drink.',
    },
    {
      title: 'FOCUS',
      description:
        'Have a staring contest with another player. The loser drinks.',
    },
    {
      title: 'THUMB MASTER',
      description:
        'Place your thumb on the edge of the table at any given time. Everyone must follow. The last player to do so drinks.',
    },
    {
      title: 'SINGLE',
      description: "Drink if you're single.",
    },
    {
      title: 'HEAVEN',
      description:
        'Point your finger to the sky at any given time, everyone must follow. The last player to do so drinks. You can continue this until the next 7 is drawn.',
    },
    {
      title: 'MATE',
      description:
        'Pick a mate. Every time you drink they have to, and vice versa.',
    },
    {
      title: 'RHYME',
      description:
        'Say any word, and the player clockwise must come up with a word rhyming with it. This continues around the circle until a player fails. They then have to drink.',
    },
    {
      title: 'CATEGORIES',
      description:
        'Choose a topic that each player, in turn, must relate a word to. This continues around the circle until a player fails. They then have to drink.',
    },
    {
      title: 'RULE',
      description:
        'Make a rule for all to follow until the next Jack is drawn. Any who fail to comply must drink.',
    },
    {
      title: 'QUESTION MASTER',
      description:
        "Try to get players to answer your questions. If they do so, they drink. If they respond 'Fuck you Question Master', you drink. You can continue this until the next Queen is drawn.",
    },
    {
      title: 'POUR',
      description:
        'Pour some of your drink into the Cup unless you draw the 4th and final King.',
    },
  ];

  title = '';
  description = '';
  @Input()card?: string;

  constructor() {}

    /**
   * Updates the title and description of the component based on the value of the 'card' input property.
   * If the 'card' input property is not null, the card number is extracted from the 'card' string,
   * and the corresponding title and description are retrieved from the 'cardAction' array.
   */
  ngOnChanges() {
    if(this.card){
      let cardNumber = +this.card!.split('_')[1];
      this.title = this.cardAction[cardNumber - 1].title;
      this.description = this.cardAction[cardNumber - 1].description;
    }
  }
}

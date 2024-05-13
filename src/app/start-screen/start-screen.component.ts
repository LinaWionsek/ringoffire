import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  // private router because router just using in this component, not in another (like html file)
  constructor(private router: Router) { }

  newGame(){
    // Start game
    this.router.navigateByUrl('/game');
  }

}

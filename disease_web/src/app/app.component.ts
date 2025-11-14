import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoggedOutMessageComponent } from './logged-out-message/logged-out-message.component';
import { DiseaseService } from './disease/disease.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoggedOutMessageComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'disease_web';
  loggedIn?: boolean;
  constructor(diseaseService: DiseaseService) {
    //this.loggedIn = diseaseService.isUserLoggedIn();
    this.loggedIn = true;
  }

}

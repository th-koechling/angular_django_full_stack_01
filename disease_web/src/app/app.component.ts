import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderMenuComponent} from './header-menu/header-menu.component';
import { LoggedOutMessageComponent } from './logged-out-message/logged-out-message.component';
import { DiseaseService } from './disease/disease.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoggedOutMessageComponent, HeaderMenuComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'disease_web';
  loggedIn?: boolean;
  constructor(diseaseService: DiseaseService) {
    //this.loggedIn = diseaseService.isUserLoggedIn();
    this.loggedIn = true;
  }

}

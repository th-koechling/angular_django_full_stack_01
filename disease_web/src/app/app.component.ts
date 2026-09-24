import { Component, Host, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderMenuComponent} from './header-menu/header-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderMenuComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'disease_web';
  canClose = false;

  /* this does not work, right? too late to ask for confirmation when the page is already closed:
  @HostListener('window:unload', ['$event'])
  unloadHandler(event: Event) {
    event.preventDefault();
    event.defaultPrevented
    return true;
  }
  */

  /*
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
    return false;
  }
  */

}

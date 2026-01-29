import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatIconModule, MatDivider],
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css']
})
export class HeaderMenuComponent {

  constructor(private router: Router) { }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'

@Component({
  selector: 'app-url-encoding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './url-encoding.component.html',
  styleUrl: './url-encoding.component.css'
})
export class UrlEncodingComponent {

  router = inject(Router);

  encodeUrl(url: string) {
    const encodeUrl = encodeURI(url);
    this.router.navigate([encodeUrl]);
  }





}

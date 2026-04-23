import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Disease } from '../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-disease-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './disease-card.component.html',
  styleUrls: ['./disease-card.component.css']
})
export class DiseaseCardComponent {

  constructor(private router: Router) { }

  readonly disease = input.required<Disease>();
  
  viewDisease(diseaseName: string) {
    console.log("Viewing disease: ", diseaseName);
    // Navigate to detail view and pass the disease object via navigation state
    this.router.navigate(['/detail-view'], { queryParams: {diseaseName: diseaseName} });
  }

}

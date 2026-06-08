import { Component, ViewEncapsulation, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Disease } from '../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-disease-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './disease-card.component.html',
  styleUrls: ['./disease-card.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DiseaseCardComponent {

  constructor(private router: Router) { }
  readonly disease = input.required<Disease>();
 
  /*
  viewDisease(diseaseName: string) {
    console.log("Viewing disease: ", diseaseName);
    // Navigate to detail view and pass the disease object via navigation state
    this.router.navigate(['/detail-view'], { queryParams: {diseaseName: diseaseName} });
  }
  */

  // ID based navigation is more robust, as disease names may not be unique or may contain special characters that complicate URL encoding (AI)
  viewDisease(diseaseId: number) {
    console.log("Viewing disease with ID: ", diseaseId);
    // Navigate to detail view and pass the disease ID via query parameters
    this.router.navigate(['/disease'], { queryParams: {id: diseaseId} });
  }

}

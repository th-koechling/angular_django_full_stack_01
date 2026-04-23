import { Component, AfterViewInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DiseaseCardComponent } from '../disease-card/disease-card.component';
import { Disease } from '../interfaces';
import { DiseaseService } from '../disease.service';

@Component({
  selector: 'app-grid-view',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, DiseaseCardComponent],
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.css']
})
export class GridViewComponent implements AfterViewInit {

  constructor(private diseaseService: DiseaseService) { }

  diseases = signal<Disease[]>([]);

  ngAfterViewInit(): void {
    this.diseaseService.getDiseases().subscribe((data) => {
      this.diseases.set(data);
    });
  }

}
 
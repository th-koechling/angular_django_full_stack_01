import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiseaseService } from '../disease.service';
import { Disease } from '../interfaces';
import { Panel } from '../interfaces';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule, MatOption } from '@angular/material/select';





@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [MatFormField, MatIconModule, MatSelectModule, MatOption],
  templateUrl: './detail-view.component.html',
  styleUrl: './detail-view.component.css'
})

export class DetailViewComponent implements OnInit {

  diseaseName: string | null = '';
  associated_panels: any=undefined;
  panelsPreSelect: Panel[] = [];
  disease: Disease = {
    id: 0,
    name: '',
    comment: '',
    analysis_comment: '',
    associated_panels: this.associated_panels,
  };

  constructor(private route: ActivatedRoute, 
              private diseaseService: DiseaseService,
              private router: Router) {}

    ngOnInit() {
      this.route.queryParams.subscribe(params => {this.diseaseName = params['diseaseName']});
        console.log("Detail view for disease (queryParams): ", this.diseaseName);

      this.diseaseService.getDiseaseByName(this.diseaseName!).subscribe((data) => {
        this.disease = data;
        console.log("Loaded disease details: ", this.disease); 
      });
    }
} 

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiseaseService } from '../disease.service';
import { Disease } from '../interfaces';
import { Panel } from '../interfaces';
import { DiseasePanel } from '../interfaces';
import { FormsModule, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule, MatOption } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormField, 
            MatIconModule, MatSelectModule, MatOption, MatFormFieldModule, 
            MatInputModule, MatTableModule, MatButtonModule],
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

  panels = new FormControl('');
  panelList: Panel[] = [];
  panel: Panel = {
    name: '',
    genes: '',
  };

  displayedColumns: string[] = ['panelid', 'name', 'genes', 'rank'];
  dataSource = new MatTableDataSource<Panel>();
  diseasePanels: DiseasePanel[] = [];
  /*
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;
  diseases: Disease[] = [];
  filteredDiseases: Disease[] = [];
  associated_panels: any=undefined;
  panelsPreSelect: Panel[] = [];
  */

  ngOnInit() {
    this.route.queryParams.subscribe(params => {this.diseaseName = params['diseaseName']});
      console.log("Detail view for disease (queryParams): ", this.diseaseName);
    // TODO: make nicer by using forkjoin (deprecated?) or combineLatest (for simultaneous calls), 
    // or merge map, switch map (to call one after another) -->
    this.diseaseService.getDiseaseByName(this.diseaseName!).subscribe((disease_data) => {
      this.diseaseService.getPanels().subscribe((panel_data) => {
        this.diseaseService.getDiseasePanels().subscribe((disease_panel_data) => {
          const associatedPanels: Panel[] = [];
          disease_panel_data.forEach(dp => {
            if (dp.disease_name === disease_data.name) {
              const panel = panel_data.find(p => p.name === dp.panel_name);
              if (panel) {
                panel['rank'] = dp.rank;  // M2M: join/add rank to panel
                associatedPanels.push(panel);
              }
            }
          });
          this.disease = disease_data;
          this.disease.associated_panels = associatedPanels;
          this.dataSource = new MatTableDataSource<Panel>(this.disease.associated_panels);
          console.log("Final disease with associated panels: ", this.disease);
        });
      });
    });
  }

  showChange(value: any) {
    console.log("CHECK VAL: ", value);
    console.log("TYPE: ", typeof(value));
    this.disease.associated_panels = value;
  }

  setDisease(rowData: Disease) {
    this.disease.id = rowData.id;
    this.disease.name = rowData.name;
    this.disease.comment = rowData.comment;
    this.disease.analysis_comment = rowData.analysis_comment;
    this.disease.associated_panels = rowData.associated_panels;
    this.panelsPreSelect = this.disease.associated_panels;
    console.log("current associated panels: ", this.disease.associated_panels);
    // TODO: I AM HERE: set rank values in associated panels
  }

  unsetDisease() {
    this.disease.id = 0;
    this.disease.name = '';
    this.disease.comment = '';
    this.disease.analysis_comment = '';
    this.disease.associated_panels = this.associated_panels;
  }

  addUpdateDisease(disease: Disease) {
    // TODO: I AM HERE: set rank values in associated panels
    console.log("Adding/updating disease: ", disease);
    if (disease.id !== 0) {
      this.diseaseService.updateDisease(disease).subscribe({
        next:(data) => {
          console.log("Disease data updated");
          window.location.reload();
        },
        error:(err: any) => {
          console.log(err);
        }
      })
    } else {
      this.diseaseService.createDisease(disease).subscribe({
        next:(data) => {
          console.log("New disease created successfully");
          window.location.reload();
        },
        error:(err) => {
          console.log(err);
        }
      }) 
    }
  }

  isAssociatedPanel(panel: Panel): boolean {
    //console.log("Checking if panel is associated: ", panel);
    return this.disease.associated_panels?.some((p: Panel) => p.name === panel.name);
  }

  goToDiseaseOverview() {
    this.router.navigate(['/diseases']);
  }


} 

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiseaseService } from '../disease.service';
import { Disease } from '../interfaces';
import { Panel } from '../interfaces';
import { DiseasePanel } from '../interfaces';
import { FormsModule, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, forkJoin, concat } from 'rxjs';
import { MatFormField } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule, MatOption } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

const material = [
  MatFormField,
  MatIconModule,
  MatSelectModule,
  MatOption,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatButtonModule,
  MatSort,
  MatSortModule,
  MatPaginator
]

@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [material, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './detail-view.component.html',
  styleUrl: './detail-view.component.css'
})

export class DetailViewComponent implements OnInit {

  diseaseName: string | null = '';
  associated_panels: any=undefined;
  diseasePanels: DiseasePanel[] = [];
  diseasePanelBuffer: DiseasePanel[] = [];
  panelsPreSelect: Panel[] = [];
  disease: Disease = {
    id: 0,
    name: '',
    general_info: '',
    associated_panels: this.associated_panels,
    analysis_notes: '',
    analysis_features: '',
    report_info: '',
    report_text: '',
    report_tech: '',
  };

  constructor(private route: ActivatedRoute, 
              private diseaseService: DiseaseService,
              private router: Router) {}

  panels = new FormControl('');
  rankValues: number[] = [];
  panelList: Panel[] = [];
  panel: Panel = {
    id: 0,
    name: '',
    genes: [],
    rank: 0,
  };

  displayedColumns: string[] = ['rank', 'name', 'genes', 'setRank'];
  dataSource = new MatTableDataSource<Panel>();
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: any;
  

  ngOnInit() {
    this.rankValues = [];
    console.log("rankValues: ", this.rankValues);
    const panels$: Observable<Panel[]> = this.diseaseService.getPanels();
    const diseasePanels$: Observable<DiseasePanel[]> = this.diseaseService.getDiseasePanels();
    const disease$: Observable<Disease> = this.diseaseService.getDiseaseByName(this.route.snapshot.queryParamMap.get('diseaseName')!);
    
    forkJoin([panels$, diseasePanels$, disease$]).subscribe(([panel_data, disease_panel_data, disease_data]) => {
      const associated_panels: Panel[] = [];
      disease_panel_data.forEach(dp => {
        if (dp.disease_name === disease_data.name) {
          const panel: Panel | undefined = panel_data.find(p => p.name === dp.panel_name);
          if (panel) {
            if (dp.rank == null) {
              dp.rank = 0;
            }
            panel['rank'] = dp.rank;  // M2M: join/add rank to panel
            associated_panels.push(panel);
          }
        }
      });
      this.panelList = panel_data;
      this.diseasePanels = disease_panel_data;
      this.disease = disease_data;
      this.disease.associated_panels = associated_panels;
      const numberOfRanks = associated_panels.length
      for (let i = 1; i <= numberOfRanks; i++) {
        this.rankValues.push(i);
      }
      this.dataSource = new MatTableDataSource<Panel>(this.disease.associated_panels);
      this.dataSource.sort = this.sort;
      this.paginator._intl.itemsPerPageLabel = 'Einträge pro Seite:';
      this.paginator._intl.nextPageLabel = 'Nächste Seite';
      this.paginator._intl.previousPageLabel = 'Vorherige Seite';
      this.dataSource.paginator = this.paginator;
    });
  }

  showChange(value: any) {
    this.disease.associated_panels = value;
  }

  panelSelect: Boolean = true;
  togglePanelsLock() {
    if (this.panelSelect === false) {
      this.panelSelect = true;
    } else {
      this.panelSelect = false;
    }
  }

  updateDisease(disease: Disease) {
    if (disease.id !== 0) {
      this.diseasePanels = this.diseasePanelBuffer;
      const diseasePanelsToUpdate: DiseasePanel[] = this.diseasePanels.filter(
        (dp: DiseasePanel) => dp.disease_name === this.disease.name
      );
      const dpUpdates: Observable<DiseasePanel>[] = [];
      diseasePanelsToUpdate.forEach((dp: DiseasePanel) => {
        dpUpdates.push(
          this.diseaseService.updateDiseasePanel(dp)
        );
      });
      concat(
        forkJoin(dpUpdates),
        this.diseaseService.updateDisease(disease)
      ).subscribe({
        complete: () => {
          this.ngOnInit();
          //window.location.reload();
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  updateDiseasePanels(disease: Disease) {
    this.diseasePanels = this.diseasePanelBuffer;
    // <-- using the buffer in the setRank method, so it can be cancelled if needed (button press)
    if (disease.id !== 0) {
      this.diseasePanels.forEach((dp: DiseasePanel) => {
        if (dp.disease_name === this.disease.name) {
          this.diseaseService.updateDiseasePanel(dp).subscribe({
            next:(data) => {
              console.log("diseasePanel updated");
              window.location.reload();
            },
            error:(err) => {
              console.log(err);
            }
          })
        }
      });
    }
  }

  restoreDisease() {
    this.rankValues = [];
    this.ngOnInit();
    this.diseasePanelBuffer = [];
    this.disease.associated_panels = this.panelsPreSelect;
  }

  setRank({panel, value}: {panel: Panel, value: Number}) {
    const rank = value;
    this.diseasePanels.forEach((dp: DiseasePanel) => {
      if (dp.disease_name === this.disease.name && dp.panel_name === panel.name) {
        const data: DiseasePanel = {
          id : dp.id,
          panel_name : dp.panel_name, 
          disease_name : this.disease.name, 
          rank : rank
        };
        this.diseasePanelBuffer.push(data);
      }
    })
  }

  isAssociatedPanel(panel: Panel): boolean {
    return this.disease.associated_panels?.some((p: Panel) => p.name === panel.name);
  }

  goToDiseaseOverview() {
    this.router.navigate(['/diseases']);
  }

} 

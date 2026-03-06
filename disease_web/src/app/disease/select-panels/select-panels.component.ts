import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiseaseService } from '../disease.service';
import { Disease, Panel, DiseasePanel } from '../interfaces';
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from "@angular/material/tooltip";

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
  MatPaginator,
  MatPaginatorModule,
]

@Component({
  selector: 'app-select-panels',
  standalone: true,
  imports: [...material, CommonModule, FormsModule, 
            ReactiveFormsModule, MatTooltipModule],
  templateUrl: './select-panels.component.html',
  styleUrls: ['./select-panels.component.css']
})
export class SelectPanelsComponent implements OnInit {

  diseaseName: string | null = null;
  associated_panels: any=undefined;
  diseasePanels: DiseasePanel[] = [];
  diseasePanelBuffer: DiseasePanel[] = [];
  panelsPreSelect: Panel[] = [];
  panelSelect: Boolean = false;
  disease: Disease = {
    id: 0,
    name: '',
    general_info: '',
    associated_panels: this.associated_panels,
    filter_info: '',
    analysis_features: '',
    report_info: '',
    report_text: '',
    report_tech: '',
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private diseaseService: DiseaseService) {}

  // AI suggestion (type):
  //panels = new FormControl<Panel[]>([]);
  panels = new FormControl('');
  rankValues: number[] = [];
  panelList: Panel[] = [];
  panel: Panel = {
    id: 0,
    name: '',
    genes: [],
    rank: 0,
  }

  displayedColumns: string[] = ['rank', 'name', 'genes', 'setRank'];
  dataSource = new MatTableDataSource<Panel>();
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: any;
  sorted_associated_panels: Panel[] = [];

  ngOnInit(): void {
    // removed, is read further down:
    //const queryParams = new URLSearchParams(window.location.search);
    //this.diseaseName = queryParams.get('diseaseName');
    //console.log('Received disease name:', this.diseaseName); 
    this.rankValues = [];
    console.log("rankValues: ", this.rankValues);
    const panels$: Observable<Panel[]> = this.diseaseService.getPanels();
    const diseasePanels$: Observable<DiseasePanel[]> = 
      this.diseaseService.getDiseasePanels();
    const disease$: Observable<Disease> =
      this.diseaseService.getDiseaseByName(
        this.route.snapshot.queryParamMap.get('diseaseName')!
      );
    forkJoin([panels$, diseasePanels$, disease$]).subscribe(
      ([panel_data, disease_panel_data, disease_data]) => {
        const associated_panels: Panel[] = [];
        disease_panel_data.forEach(dp => {
          if (dp.disease_name === disease_data.name) {
            const panel: Panel | undefined = panel_data.find(
              p => p.name === dp.panel_name
            );
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
        this.panelsPreSelect = associated_panels; // for restore/cancel functionality
        const numberOfRanks = associated_panels.length;
        for (let i = 1; i <= numberOfRanks; i++) {
          this.rankValues.push(i);
        }
        this.dataSource = new MatTableDataSource<Panel>(
          this.disease.associated_panels
        );
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Eintäge pro Seite';
        this.paginator._intl.nextPageLabel = 'Nächste Seite';
        this.paginator._intl.previousPageLabel = 'Vorherige Seite';
        this.sorted_associated_panels = this.disease.associated_panels.sort(
          (a: Panel, b: Panel) =>
          ((a.rank as number) < (b.rank as number) ? -1 : 1)
        );
      }
    );
  }

  togglePanelsLock(): Boolean {
    this.panelSelect = !this.panelSelect;
    return this.panelSelect;
  }

  // TODO: specify type Panel ?
  showChange(value: any) {
    this.disease.associated_panels = value;
  }

  isAssociatedPanel(panel: Panel): boolean {
    return this.disease.associated_panels?.some((p: Panel) =>
      p.name === panel.name
    );
  }

  goToDiseaseDetailView() {
    this.router.navigate(['/detail-view'], {
      queryParams: { diseaseName: this.disease.name }
    });
  }

  updateDiseasePanelBuffer(diseaseName: string) {
    this.diseasePanelBuffer.forEach((dp: DiseasePanel) => {
      dp.disease_name = diseaseName;
    })
  }

  // TODO: remove passed argument: use this.disease!
  updateDisease(disease: Disease) {
    if (disease.id !== 0) {
      this.updateDiseasePanelBuffer(disease.name);
      this.diseasePanels = this.diseasePanelBuffer;
      const diseasePanelsToUpdate: DiseasePanel[] = this.diseasePanels.filter(
        (dp: DiseasePanel) => dp.disease_name === this.disease.name
      );
      console.log("DiseasePanels: ", this.diseasePanels);
      console.log("DiseasePanelBuffer: ", this.diseasePanelBuffer);
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
        next: () => {
          this.ngOnInit(); // see changes made, NOT by window.location.reload();
        },
        error: (error) => {
          console.error(error);
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
          id: dp.id,
          panel_name: dp.panel_name,
          disease_name: this.disease.name,
          rank: rank
        };
        this.diseasePanelBuffer.push(data);
      }
    })
  }





}




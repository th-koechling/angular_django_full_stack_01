import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiseaseService } from '../disease.service';
import { Disease, Panel, DiseasePanel } from '../interfaces';
import { FormsModule, FormControl, FormBuilder } from '@angular/forms';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, forkJoin, concat } from 'rxjs';
import { MatFormField } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule, MatSelect, MatOption } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from "@angular/material/tooltip";

const material = [
  MatFormField,
  MatIconModule,
  MatSelectModule,
  MatSelect,
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
  preselectedPanels: Panel[] = [];
  bufferedAssociatedPanels: Panel[] = [];
  bufferedDiseaseName: string = '';
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

  panelsForm: FormGroup;
  panelSelect = new FormControl(false);

  panelSelectActive: boolean = false;
  toggleDisableSelect() {
    const isDisabled = this.panelsForm.get('panelSelect')?.disabled;
    if (isDisabled) {
      this.panelsForm.get('panelSelect')?.enable();
      this.panelSelectActive = true;
      return;
    } else {
      this.panelsForm.get('panelSelect')?.disable();
      this.panelSelectActive = false;
      return;
    } 
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private diseaseService: DiseaseService) {
    const fb = new FormBuilder();   
    this.panelsForm = fb.group({
      //panelSelect: new FormControl(false)
      panelSelect: [{value: false, disabled: true}]
    });
  }

  panelSelectControl = new FormControl<Panel[]>([]);
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
    //stuff by AI removed, is read further down:
    //const queryParams = new URLSearchParams(window.location.search);
    //this.diseaseName = queryParams.get('diseaseName');
    //console.log('Received disease name:', this.diseaseName); 
    this.rankValues = [];
    console.log("rankValues: ", this.rankValues);
    const panels$: Observable<Panel[]> = this.diseaseService.getPanels();
    const diseasePanels$: Observable<DiseasePanel[]> = 
      this.diseaseService.getDiseasePanels();
    const disease$: Observable<Disease> =
      this.diseaseService.getDiseaseById(
        Number(this.route.snapshot.queryParamMap.get('diseaseId'))
      );
    /*
      this.diseaseService.getDiseaseByName(
        this.route.snapshot.queryParamMap.get('diseaseName')!
      );
      */
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
        this.disease = disease_data;
        this.preselectedPanels = this.disease.associated_panels; // for restore/cancel functionality
        this.preselectedPanels.sort();
        this.bufferedDiseaseName = this.disease.name;
        this.bufferedAssociatedPanels = this.disease.associated_panels;
        this.panelList = panel_data;
        this.diseasePanels = disease_panel_data;
        this.disease.associated_panels = associated_panels;
        const numberOfRanks = associated_panels.length;
        for (let i = 1; i <= numberOfRanks; i++) {
          this.rankValues.push(i);
        }
        this.diseasePanelBuffer = [];
        this.dataSource = new MatTableDataSource<Panel>(
          this.disease.associated_panels
        );
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Einträge pro Seite';
        this.paginator._intl.nextPageLabel = 'Nächste Seite';
        this.paginator._intl.previousPageLabel = 'Vorherige Seite';
      }
    );
  }


  // TODO: specify type Panel ?
  onPanelSelectionChange(value: any) {
    this.disease.associated_panels = value;
    console.log("onPanelSelectionChange --- Selected panels: ", this.disease.associated_panels);
  }

  isAssociatedPanel(panel: Panel): boolean {
    return this.disease.associated_panels?.some((p: Panel) =>
      p.name === panel.name
    );
  }

  goToDiseaseDetailView() {
    this.router.navigate(['/disease'], {
      queryParams: { id: this.disease.id }
    });
  }

  updateDiseasePanelBuffer(diseaseName: string) {
    this.diseasePanelBuffer.forEach((dp: DiseasePanel) => {
      dp.disease_name = diseaseName;
    })
  }

  updateDisease() {
    if (this.disease.id !== 0) {
      this.updateDiseasePanelBuffer(this.disease.name);
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
        this.diseaseService.updateDisease(this.disease)
      ).subscribe({
        next: () => {
          //this.ngOnInit(); // <- does not pre-select the mat-options!!
          window.location.reload();
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
    this.disease.associated_panels = this.preselectedPanels;
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




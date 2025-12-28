import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiseaseService } from '../disease.service';
import { Disease } from '../interfaces';
import { Panel } from '../interfaces';
import { DiseasePanel } from '../interfaces';
import { FormsModule, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
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
  diseasePanels: DiseasePanel[] = [];
  diseasePanelBuffer: DiseasePanel[] = [];
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
  rankValues: number[] = [];
  //rankFormControl = new FormControl([1]);
  panelList: Panel[] = [];
  panel: Panel = {
    id: 0,
    name: '',
    genes: '',
  };

  displayedColumns: string[] = ['rank', 'name', 'genes', 'setRank'];
  dataSource = new MatTableDataSource<Panel>();
  /*
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;
  diseases: Disease[] = [];
  filteredDiseases: Disease[] = [];
  associated_panels: any=undefined;
  panelsPreSelect: Panel[] = [];
  */

  ngOnInit() {
    const panels$: Observable<Panel[]> = this.diseaseService.getPanels();
    const diseasePanels$: Observable<DiseasePanel[]> = this.diseaseService.getDiseasePanels();
    const disease$: Observable<Disease> = this.diseaseService.getDiseaseByName(this.route.snapshot.queryParamMap.get('diseaseName')!);
    
    forkJoin([panels$, diseasePanels$, disease$]).subscribe(([panel_data, disease_panel_data, disease_data]) => {
      const associated_panels: Panel[] = [];
      disease_panel_data.forEach(dp => {
        if (dp.disease_name === disease_data.name) {
          const panel: Panel | undefined = panel_data.find(p => p.name === dp.panel_name);
          if (panel) {
            console.log("DEBUG: panel rank: ", dp.rank);
            if (dp.rank == null) {
              console.log(dp.panel_name, "<- panel rank is null");
              dp.rank = 0;
            }
            console.log("oninit -> dp rank", dp.rank);
            //panel['rank'] = dp.rank;  // M2M: join/add rank to panel
            associated_panels.push(panel);
          }
        }
      });
      this.diseasePanels = disease_panel_data;
      this.disease = disease_data;
      this.disease.associated_panels = associated_panels;
      const numberOfRanks = associated_panels.length
      for (let i = 1; i <= numberOfRanks; i++) {
        this.rankValues.push(i);
      }
      this.dataSource = new MatTableDataSource<Panel>(this.disease.associated_panels);
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
    // TODO: I AM HERE: set rank values in associated panels
  }

  XXXunsetDisease() {
    this.disease.id = 0;
    this.disease.name = '';
    this.disease.comment = '';
    this.disease.analysis_comment = '';
    this.disease.associated_panels = this.associated_panels;
  }

  unsetDisease() {
    this.diseaseService.getDiseaseByName(this.disease.name).subscribe((data) => {
      this.disease = data;
      window.location.reload();
      //this.disease.associated_panels = this.associated_panels;
    });
  }

    // BUG: not all panels are available for selection here!!!
    // TODO: I AM HERE: set rank values in associated panels
    //       -> use forkJoin to update Disease and DiseasePanels simultaneously?
    //       -> or let the disease service do this?
    //       (what do post and put methods return?)
    // <<-- modified diseasePanel data is available here!! -->>

  updateDisease(disease: Disease) {
    if (disease.id !== 0) {
      console.log("diseassPanels before update: ", this.diseasePanels);
      console.log("DEBUG: disease: ", disease);
      /*
      disease.associated_panels.forEach((panel: Panel) => {
        this.diseasePanels.forEach((dp: DiseasePanel) => {
          if (dp.disease_name === disease.name && dp.panel_name === panel.name) {
            console.log("MATCH! panel name: ", dp.panel_name, "rank: ", dp.rank);
            //panel['rank'] = dp.rank;  // M2M: join/add rank to panel
            disease.associated_panels.push(panel);
            console.log("d.e.b.u.g. -> ", disease);
          }
      })
    });
          */
      this.diseaseService.updateDisease(disease).subscribe({
        next:(disease) => {
          console.log("D.A.T.A.: ", disease);
          console.log("disease updated"); 
          //window.location.reload();
        },
        error:(err) => {
          console.log(err);
        }
      });
    } 
    /*
    else {
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
      */

    //this.updateDiseasePanels(disease);
  }

  updateDiseasePanels(disease: Disease) {
    this.diseasePanels = this.diseasePanelBuffer;
    // <-- using the buffer in the setRank method, so it can be cancelled if needed (button press)
    console.log("DEBUG: disease.id: ", disease.id);
    console.log("DEBUG: diseasePanels: ", this.diseasePanels);
    if (disease.id !== 0) {
      this.diseasePanels.forEach((dp: DiseasePanel) => {
        if (dp.disease_name === this.disease.name) {
          console.log("panel name: ", dp.panel_name, "rank: ", dp.rank);
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




  isAssociatedPanel(panel: Panel): boolean {
    return this.disease.associated_panels?.some((p: Panel) => p.name === panel.name);
  }

  setRank({panel, value}: {panel: Panel, value: Number}) {
    // TODO!? empty buffer here?
    // this.diseasePanelBuffer = [];
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

  goToDiseaseOverview() {
    this.router.navigate(['/diseases']);
  }


} 

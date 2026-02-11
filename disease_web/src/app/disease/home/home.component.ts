import { Panel, Disease } from '../interfaces';
import { DiseaseService } from '../disease.service';
import { Component, AfterViewInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule, MatOption } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, 
            MatTableModule, FormsModule, CommonModule, MatSort, MatSortModule,
            MatPaginator, MatPaginatorModule, MatSelectModule, MatOption, 
            ReactiveFormsModule,
          ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  
  constructor(private diseaseService: DiseaseService) { }
  displayedColumns: string[] = ['id', 'name', 'comment', 'analysis_comment', 
                                'associated_panels', 'edit', 'view', 'delete'];
  dataSource = new MatTableDataSource<Disease>();
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;
  diseases: Disease[] = [];
  filteredDiseases: Disease[] = [];
  associated_panels: any=undefined;
  panelsPreSelect: Panel[] = [];
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

  toStr = JSON.stringify;
  toJson = JSON.parse;
  panels = new FormControl('');
  panelList: Panel[] = [];
  panel: Panel = {
    id: 0,
    name: '',
    genes: [],
  };

  ngAfterViewInit(): void {
    const diseases$: Observable<Disease[]> = this.diseaseService.getDiseases();
    const panels$: Observable<Panel[]> = this.diseaseService.getPanels();
    forkJoin([diseases$, panels$]).subscribe(([disease_data, panel_data]) => {
      this.diseases = disease_data;
      this.dataSource = new MatTableDataSource<Disease>(disease_data);
      this.dataSource.sort = this.sort;
      this.paginator._intl.itemsPerPageLabel = 'Einträge pro Seite:';
      this.paginator._intl.nextPageLabel = 'Nächste Seite';
      this.paginator._intl.previousPageLabel = 'Vorherige Seite';
      this.dataSource.paginator = this.paginator;
      this.panelList = panel_data;
    });
  }

  // TODO: I AM HERE: get the selected panels and add them to the disease object
  // 2way data binding needed for the selected panels? but on click "EDIT disease"
  showChange(value: any) {
    console.log("CHECK VAL: ", value);
    console.log("TYPE: ", typeof(value));
    this.disease.associated_panels = value;
  }

  isAssociatedPanel(panel: Panel): boolean {
    return this.disease.associated_panels?.some((p: Panel) => p.name === panel.name);
  }

  unsetDisease() {
    this.disease.id = 0;
    this.disease.name = '';
    this.disease.general_info = '';
    this.disease.associated_panels = [];
    this.disease.filter_info = '';
    this.disease.analysis_features = '';
    this.disease.report_info = '';
    this.disease.report_text = '';
    this.disease.report_tech = '';
  }

  setDisease(rowData: Disease) {
    this.disease.id = rowData.id;
    this.disease.name = rowData.name;
    this.disease.general_info = rowData.general_info;;
    this.disease.associated_panels = rowData.associated_panels;
    this.disease.filter_info = rowData.filter_info;
    this.disease.analysis_features = rowData.analysis_features;
    this.disease.report_info = rowData.report_info;
    this.disease.report_text = rowData.report_text;
    this.disease.report_tech = rowData.report_tech;
    this.panelsPreSelect = rowData.associated_panels;
    console.log("preselected panels: ", this.panelsPreSelect);
  }

  searchDiseases(input:any) {
    console.log("searchin in panels", this.diseases.filter(item => 
      item.associated_panels)
    );
    this.filteredDiseases = this.diseases.filter(item => 
      item.name.toLowerCase().includes(input.toLowerCase()) || 
      item.general_info.toLowerCase().includes(input.toLowerCase()) ||
      item.filter_info.toLowerCase().includes(input.toLowerCase()) ||
      item.associated_panels.toString().includes(input))
      this.dataSource = new MatTableDataSource<Disease>(this.filteredDiseases);
  }

  deleteDisease(id: Number) {
    const confirm = window.confirm("Delete disease?");
    this.diseaseService.deleteDisease(id).subscribe((data) => {
      this.diseases = this.diseases.filter(item => item.id !== id)
      window.location.reload();
    });
  }

  viewDisease(diseaseName: string) {
    console.log("Viewing disease: ", diseaseName);
    // Navigate to detail view and pass the disease object via navigation state
    this.router.navigate(['/detail-view'], { queryParams: {diseaseName: diseaseName} });
    /*
    alert("Disease:\n" + JSON.stringify(rowData, null, 2));
    let url = 'test(01)';
    const encodeUrl = encodeURI(url).replace('(', '%28').replace(')', '%29');
    const encodeUrl = this.extEncodeURI(url);
    console.log("Encoded URL: ", encodeUrl);
    */
  }

  goToPanels() {
    this.router.navigate(['/panels']);
  }

  extEncodeURI(str: string): string {
    return encodeURI(str).replace(/[()]/g, function(c: string): string {
      return '%' + c.charCodeAt(0).toString(16);
    }); 
  }

  router = inject(Router);
  encodeUrl(url: string) {
    const encodeUrl = encodeURI(url).replace('(', '%28').replace(')', '%29');
    this.router.navigate([encodeUrl]);
  }

  addUpdateDisease(disease: Disease) {
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

}

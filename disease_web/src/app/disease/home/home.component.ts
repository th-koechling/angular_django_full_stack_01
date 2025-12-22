import { Component, AfterViewInit, ViewChild, inject, Injectable } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule, MatOption } from '@angular/material/select';
import { Panel, Disease } from '../interfaces';
import { DiseaseService } from '../disease.service';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
//import { MatDivider } from '@angular/material/divider';

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
                                'associated_panels', 'edit', 'view',  'delete'];
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
    comment: '',
    analysis_comment: '',
    associated_panels: this.associated_panels,
  };

  toStr = JSON.stringify;
  toJson = JSON.parse;
  panels = new FormControl('');
  panelList: Panel[] = [];
  panel: Panel = {
    id: 0,
    name: '',
    genes: '',
  };

  ngAfterViewInit(): void {
    this.diseaseService.getDiseases().subscribe((data) => {
      this.diseases = data;
      console.log("loaded diseases: ", this.diseases)
      this.dataSource = new MatTableDataSource<Disease>(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.diseaseService.getPanels().subscribe((data) => {
      this.panelList = data;
      console.log("loaded panels: ", this.panelList);
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
    //console.log("Checking if panel is associated: ", panel);
    return this.disease.associated_panels?.some((p: Panel) => p.name === panel.name);
  }

  setDisease(rowData: Disease) {
    this.disease.id = rowData.id;
    this.disease.name = rowData.name;
    this.disease.comment = rowData.comment;
    this.disease.analysis_comment = rowData.analysis_comment;
    this.disease.associated_panels = rowData.associated_panels;
    this.panelsPreSelect = this.disease.associated_panels;
    console.log("current associated panels: ", this.disease.associated_panels);
  }

  unsetDisease() {
    this.disease.id = 0;
    this.disease.name = '';
    this.disease.comment = '';
    this.disease.analysis_comment = '';
    this.disease.associated_panels = this.associated_panels;
  }

  searchDiseases(input:any) {
    this.filteredDiseases = this.diseases.filter(item => 
      item.name.toLowerCase().includes(input.toLowerCase()) || 
      item.comment.toLowerCase().includes(input.toLowerCase()) ||
      item.analysis_comment.toLowerCase().includes(input.toLowerCase()) ||
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

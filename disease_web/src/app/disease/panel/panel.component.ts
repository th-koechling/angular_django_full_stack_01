import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Panel } from './../interfaces';
import { DiseasePanel } from './../interfaces';
import { DiseaseService } from '../disease.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, 
            MatButtonModule, MatIconModule, MatInputModule, MatTableModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit {
  panelList: Panel[] = [];
  diseasePanelList: DiseasePanel[] = [];
  constructor(private diseaseService: DiseaseService,
              private router: Router) {}

  panels = new FormControl('');
  panel: Panel = {id: 0, name: '', genes: ''};

  displayedColumns: string[] = ['name', 'genes'];
  dataSource = new MatTableDataSource<Panel>();

  ngOnInit(): void {
    this.diseaseService.getPanels().subscribe((data) => {
      this.panelList = data;
      this.dataSource = new MatTableDataSource<Panel>(this.panelList);
      console.log("DEBUG: all panels: ", this.panelList);
    });
    this.diseaseService.getDiseasePanels().subscribe((data) => {
      this.diseasePanelList = data;
      console.log("DEBUG: diseasePanels: ", this.diseasePanelList);
    });
  }

  addUpdatePanel(panel: Panel) {
    console.log("Adding/updating panel: ", panel);
    if (this.panel.id !== 0) {
      this.diseaseService.updatePanel(panel).subscribe({
        next:(data) => {
          console.log("Panel data updated");
          window.location.reload(); 
        },
        error:(err: any) => {
          console.log(err);
        }
      })
    } else {
      this.diseaseService.createPanel(panel).subscribe({
        next:(data) => {
          console.log("New panel created successfully");
          window.location.reload();
        },
        error:(err) => {
          console.log(err);
        }
      })
    }
  }

  unsetPanel() {
    this.panel.id = 0;
    this.panel.name = '';
    this.panel.genes = '';  
  }

  setPanel(rowData: Panel) {
    this.panel.id = rowData.id;
    this.panel.name = rowData.name;
    this.panel.genes = rowData.genes;
  }

  deletePanel(id: Number) {
    const confirm = window.confirm("Delete panel?");
    this.diseaseService.deletePanel(id).subscribe((data) => {
      this.panelList = this.panelList.filter(item => item.id !== id)
      window.location.reload();
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

}

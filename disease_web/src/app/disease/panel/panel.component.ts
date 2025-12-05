import { Component, OnInit } from '@angular/core';
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
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit {
  panelList: Panel[] = [];
  diseasePanelList: DiseasePanel[] = [];
  constructor(private diseaseService: DiseaseService) {}

  panels = new FormControl('');
  panel: Panel = {
    name: '',
    genes: '',
  };



  displayedColumns = ['name', 'genes'];
  dataSource = new MatTableDataSource<Panel>();

  ngOnInit(): void {
    this.diseaseService.getPanels().subscribe((data) => {
      this.panelList = data;
      //console.log(this.panels);
    });
    this.diseaseService.getDiseasePanels().subscribe((data) => {
      this.diseasePanelList = data;
      console.log("DEBUG: diseasePanels: ", this.diseasePanelList, "<= DEBUG");
    });
  }

  addUpdatePanel(panel: Panel) {
    return "blah!";
  }

  unsetPanel() {
    return "blahhhhaaahhh!!!";
  }



}

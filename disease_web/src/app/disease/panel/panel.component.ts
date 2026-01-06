import { Panel, DiseasePanel, Gene } from './../interfaces';
import { GeneService } from '../gene/gene.service';
import { DiseaseService } from '../disease.service';
import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule, MatOption } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Observable, forkJoin } from 'rxjs';


@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, 
            MatButtonModule, MatIconModule, MatInputModule, MatTableModule,
            MatSelectModule, MatOption],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements AfterViewInit {
  panelList: Panel[] = [];
  diseasePanelList: DiseasePanel[] = [];
  geneList: Gene[] = [];
  genesPreSelect: Gene[] = [];

  constructor(private diseaseService: DiseaseService,
              private geneService: GeneService,
              private router: Router) {}

  panels = new FormControl('');
  genes = new FormControl('');
  panel: Panel = {id: 0, name: '', genes: []};

  displayedColumns: string[] = ['id', 'name', 'genes', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Panel>();

  ngAfterViewInit(): void {
    const panels: Observable<Panel[]> = this.diseaseService.getPanels();
    const diseasePanels: Observable<DiseasePanel[]> = this.diseaseService.getDiseasePanels();
    const genes: Observable<Gene[]> = this.geneService.getGenes();
    forkJoin([panels, diseasePanels, genes]).subscribe(
      ([panelData, diseasePanelData, geneData]) => {
        this.panelList = panelData;
        this.diseasePanelList = diseasePanelData;
        this.geneList = geneData;
        this.dataSource = new MatTableDataSource<Panel>(this.panelList);
      } 
    )
  }

  addUpdatePanel(panel: Panel) {
    if (panel.id !== 0) {
      this.diseaseService.updatePanel(panel).subscribe({
        next:(data) => {
          window.location.reload(); 
        },
        error:(err: any) => {
          console.log(err);
        }
      })
    } else {
      this.diseaseService.createPanel(panel).subscribe({
        next:(data) => {
          window.location.reload();
        },
        error:(err) => {
          console.log(err);
        }
      })
    }
  }

  geneSelectionChange(value: any) {
    console.log("CHECK VAL: ", value);
    console.log("TYPE: ", typeof(value));
    this.panel.genes = value;
  }

  unsetPanel() {
    this.panel.id = 0;
    this.panel.name = '';
    this.panel.genes = [];
  }

  setPanel(rowData: Panel) {
    this.panel.id = rowData.id;
    this.panel.name = rowData.name;
    this.panel.genes = rowData.genes;
    this.genesPreSelect = rowData.genes || [];
  }

  deletePanel(id: Number) {
    const confirm = window.confirm("Panel löschen?");
    this.diseaseService.deletePanel(id).subscribe((data) => {
      this.panelList = this.panelList.filter(item => item.id !== id)
      window.location.reload();  // TODO: view renew without page reload possible?
    });
  }

  isAssociatedGene(gene: Gene): boolean {
    return this.panel.genes?.some((g: Gene) => g.symbol === gene.symbol);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToGenes() {
    this.router.navigate(['/genes/home'])
  }

}

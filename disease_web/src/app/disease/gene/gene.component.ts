import { Component, AfterViewInit } from '@angular/core';
import { Gene } from '../interfaces';
import { GeneService } from './gene.service';
import { Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-gene',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatTableModule, MatFormFieldModule,
            MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './gene.component.html',
  styleUrl: './gene.component.css'
})
export class GeneComponent implements AfterViewInit{

  geneList: Gene[] = [];
  genesForm = new FormControl('');
  gene: Gene = {id: 0, symbol: '', description: ''};
  displayedColumns: string[] = ['symbol', 'description', 'delete'];
  dataSource = new MatTableDataSource<Gene>();

  constructor(private geneService: GeneService,
              private router: Router) {}

  ngAfterViewInit(): void {
    this.geneService.getGenes().subscribe((data) => {
      this.geneList = data;
      this.dataSource = new MatTableDataSource<Gene>(this.geneList);
      console.log("DEBUG: genes loaded: ", this.geneList);
    })
  }


  addUpdateGene(gene: Gene) {
    console.log("Adding/updating gene: ", gene);
    if (gene.id !== 0) {
      this.geneService.updateGene(gene).subscribe({
        next:(data) => {
          console.log("Gene data updated");
          window.location.reload(); 
        },
        error:(err: any) => {
          console.log(err);
        }
      })
    } else {
      this.geneService.createGene(gene).subscribe({
        next:(data) => {
          console.log("New gene created successfully");
          window.location.reload();
        },
        error:(err) => {
          console.log(err);
        }
      })
    }
  }

  deleteGene(id: number) {
    this.geneService.deleteGene(id).subscribe({
      next:(data) => {
        console.log("Gene deleted successfully");
        window.location.reload();
      }
    })
  }

  setGene(gene: Gene) {
    this.gene = gene;
  }

  unsetGene() {
    this.gene = {
      id: 0,
      symbol: '',
      description: '',
    }

  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToPanels() {
    this.router.navigate(['/panels/home']);
  }


}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiseaseService } from '../disease.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { EditingNote } from '../interfaces';
import { DatePipe } from '@angular/common';
import { A11yModule } from "@angular/cdk/a11y";


@Component({
  selector: 'app-editing-notes-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSort,
    MatInputModule,
    MatProgressSpinnerModule,
    A11yModule,
    DatePipe
],
  templateUrl: './editing-notes-table.component.html',
  styleUrls: ['./editing-notes-table.component.css']
})
export class EditingNotesTableComponent implements OnInit {

  diseaseId!: number;
  editingNotes: EditingNote[] = [];
  displayedColumns: string[] = ['note', 'created_at', 'created_by'];
  dataSource = new MatTableDataSource<EditingNote>(this.editingNotes);
  constructor(
     private route: ActivatedRoute,
     private router: Router,
     private diseaseService: DiseaseService) { }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.diseaseId = +params['diseaseId'] || 0;
    });
    this.diseaseService.getEditingNotes().subscribe((notes: EditingNote[]) => {
      this.editingNotes = notes.filter(note => note.disease === this.diseaseId);
      this.dataSource = new MatTableDataSource<EditingNote>(this.editingNotes);
      this.dataSource.sort = this.sort;
      this.paginator._intl.itemsPerPageLabel = 'Einträge pro Seite:';
      this.paginator._intl.nextPageLabel = 'Nächste Seite';
      this.paginator._intl.previousPageLabel = 'Vorherige Seite';
      this.dataSource.paginator = this.paginator;
    });
  }


}

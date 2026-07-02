import { Component, Input, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog, 
         MatDialogActions, 
         MatDialogContent, 
         MatDialogTitle, 
         MatDialogModule,
         MatDialogRef, 
         MatDialogClose } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { EditingNoteDialogBoxComponent } from '../editing-note-dialog-box/editing-note-dialog-box.component';
import { DiseaseService } from '../disease.service';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { EditingNote } from '../interfaces';
import { MatFormField } from "@angular/material/form-field";

@Component({
  selector: 'app-editing-notes',
  standalone: true,
  imports: [MatExpansionModule,
    MatFormField,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    DatePipe,
    MatAccordion,
    MatDividerModule,
    MatIconModule,
    MatTooltip,
    MatDialogModule, RouterOutlet],
  templateUrl: './editing-notes.component.html',
  styleUrls: ['./editing-notes.component.css']
})
export class EditingNotesComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private diseaseService: DiseaseService) {}

  @Input() diseaseId!: number;

  editingNotesControl = new FormControl('');
  editingNotes: EditingNote[] | undefined;
  diseaseEditingNotes: EditingNote[] | undefined;
  latestNote: string = '';
  latestEditingNote: EditingNote | undefined;
  newNote: string = '';
  readonly dialog = inject(MatDialog);


  ngOnInit(): void {
    if (this.diseaseId !== null && this.diseaseId !== undefined) {
      this.diseaseService.getEditingNotes().subscribe(notes => {
        this.editingNotes = notes.length > 0 ? notes : undefined;
        this.diseaseEditingNotes = this.editingNotes ? this.editingNotes.filter(note => note.disease === this.diseaseId) : undefined;
        this.latestEditingNote = this.diseaseEditingNotes && this.diseaseEditingNotes.length > 0 ? this.diseaseEditingNotes[0] : undefined;
        this.latestNote = this.diseaseEditingNotes && this.diseaseEditingNotes.length > 0 ? this.diseaseEditingNotes[0].note : '';
      });
    }
  }

  showAllEditingNotes() {
    const url = `/diseases/home/editing-notes-table?diseaseId=${this.diseaseId}`;
    console.log("diseaseId: " + this.diseaseId);
    console.log("navigating to: " + url);
    //this.router.navigate(['/editing-notes-table'], { queryParams: { diseaseId: this.diseaseId } });
    this.router.navigate(['/editing-notes-table'], { queryParams: { diseaseId: this.diseaseId } });
  }



}

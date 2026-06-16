import { Component, Input, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
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
import { ActivatedRoute } from '@angular/router';
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
            MatDialogModule],
  templateUrl: './editing-notes.component.html',
  styleUrls: ['./editing-notes.component.css']
})
export class EditingNotesComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
              private diseaseService: DiseaseService) {}

  @Input() diseaseId!: number;

  editingNotesControl = new FormControl('');
  editingNotes: EditingNote[] | undefined;
  diseaseEditingNotes: EditingNote[] | undefined;
  latestNote: string = '';
  latestEditingNote: EditingNote | undefined;
  newNote: string = '';
  editingNoteDialogVisible: boolean = false;
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



}

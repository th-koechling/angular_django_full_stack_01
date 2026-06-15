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
//import { EditingNotesComponent } from '../editing-notes/editing-notes.component';
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

  constructor(private route: ActivatedRoute, private diseaseService: DiseaseService) {}

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

  addNote() {
    if (!this.newNote.trim()) {
      console.log("empty note, not adding");
      return;
    }
    console.log("DISEASE ID: ", this.diseaseId);
    this.editingNoteDialogVisible = false;
    const newEditingNote: EditingNote = {
      //id: Date.now(), // Using timestamp as a simple unique ID
      disease: this.diseaseId,
      note: this.newNote,
      created_by: 'Current User', // Placeholder, replace with actual user info
      created_at: new Date().toISOString() // Using ISO string for date format
    };
    this.diseaseService.createEditingNote(newEditingNote).subscribe({
      next: (data) => {
        console.log("New editing note created successfully");
        this.editingNotes = this.editingNotes ? [data, ...this.editingNotes] : [data];
        this.latestNote = data.note;
        this.newNote = '';
        this.ngOnInit(); // Refresh the notes list to include the new note
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  testFun() {
    console.log("TESTING TESTING 123");
    if (!this.editingNoteDialogVisible) {
      document.getElementById("editing-notes-dialog")?.scrollIntoView({ behavior: "smooth" });
      this.editingNoteDialogVisible = true;
    }
  }

  openTestDialog() {
    const dialog = document.getElementById("test-dialog") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  }

  openDialogMaterial(diseaseId: Number): void {
    console.log("Opening dialog for disease ID: ", diseaseId);
    const dialogRef = this.dialog.open(EditingNoteDialogBoxComponent, {
      width: '400px',
      data: { diseaseId: diseaseId }
    });
}


  testDialog() {
      const dialog = document.getElementById("test-dialog") as HTMLDialogElement;
      dialog.close();
    /*
    const dialog = document.getElementById("test-dialog") as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
      */
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { DiseaseService } from '../disease.service';
import { ActivatedRoute } from '@angular/router';
import { EditingNote } from '../interfaces';
import { MatFormField } from "@angular/material/form-field";

@Component({
  selector: 'app-editing-notes',
  standalone: true,
  imports: [MatExpansionModule, MatFormField, FormsModule, MatInputModule, MatButtonModule, DatePipe, MatAccordion, MatDividerModule],
  templateUrl: './editing-notes.component.html',
  styleUrls: ['./editing-notes.component.css']
})
export class EditingNotesComponent implements OnInit {

  constructor(private route: ActivatedRoute, private diseaseService: DiseaseService) {}

  @Input() diseaseId!: number;

  editingNotesControl = new FormControl('');
  editingNotes: EditingNote[] | undefined;
  latestNote: string = '';
  latestEditingNote: EditingNote | undefined;
  newNote: string = '';

  ngOnInit(): void {
    if (this.diseaseId !== null && this.diseaseId !== undefined) {
      this.diseaseService.getEditingNotesByDiseaseId(this.diseaseId).subscribe((notes) => {
        this.editingNotes = notes.length > 0 ? notes : undefined;
        this.latestEditingNote = this.editingNotes && this.editingNotes.length > 0 ? this.editingNotes[0] : undefined;
        this.latestNote = this.editingNotes && this.editingNotes.length > 0 ? this.editingNotes[0].note : '';
      });
    }
  }

  addNote() {
    console.log("DISEASE ID: ", this.diseaseId);
    const newEditingNote: EditingNote = {
      id: Date.now(), // Using timestamp as a simple unique ID
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


}

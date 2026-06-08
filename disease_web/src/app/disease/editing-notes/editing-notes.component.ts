import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion } from '@angular/material/expansion';
import { DiseaseService } from '../disease.service';
import { ActivatedRoute } from '@angular/router';
import { EditingNote } from '../interfaces';
import { MatFormField } from "@angular/material/form-field";

@Component({
  selector: 'app-editing-notes',
  standalone: true,
  imports: [MatExpansionModule, MatFormField, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './editing-notes.component.html',
  styleUrls: ['./editing-notes.component.css']
})
export class EditingNotesComponent implements OnInit {

  constructor(private route: ActivatedRoute, private diseaseService: DiseaseService) {}

  @Input() diseaseId!: number;

  editingNotesControl = new FormControl('');
  editingNotes: EditingNote[] | undefined;
  latestNote: string = '';
  newNote: string = '';

  dummy_latestEditingNote: string = '';
  dummy_editingNotesBacklog: string[] = [];
  dummy_editingNotes: string[] = [
    "Note 1: This is the first editing note.",
    "Note 2: This is the second editing note.",
    "Note 3: This is the third editing note.",
    "Note 4: This is the fourth editing note.",
    "Note 5: This is the fifth editing note."
  ];

  ngOnInit(): void {
    if (this.diseaseId !== null && this.diseaseId !== undefined) {
      this.diseaseService.getEditingNotesByDiseaseId(this.diseaseId).subscribe((notes) => {
        this.editingNotes = notes.length > 0 ? notes : undefined;
        this.latestNote = this.editingNotes && this.editingNotes.length > 0 ? this.editingNotes[0].note : '';
      });
    }

    this.dummy_latestEditingNote = this.dummy_editingNotes[this.dummy_editingNotes.length - 1];
    this.dummy_editingNotesBacklog = this.dummy_editingNotes.slice(0, -1).reverse();
  }

  addNote() {
    console.log("DISEASE ID: ", this.diseaseId);
    const newEditingNote: EditingNote = {
      id: Date.now(), // Using timestamp as a simple unique ID
      disease: this.diseaseId,
      note: this.newNote,
      created_by: 'Current User', // Placeholder, replace with actual user info
      created_at: new Date().toISOString()
    };
    this.diseaseService.createEditingNote(newEditingNote).subscribe({
      next: (data) => {
        console.log("New editing note created successfully");
        this.editingNotes = this.editingNotes ? [data, ...this.editingNotes] : [data];
        this.latestNote = data.note;
        this.newNote = '';
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


}

import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAccordion } from '@angular/material/expansion';
import { DiseaseService } from '../disease.service';

@Component({
  selector: 'app-editing-notes',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './editing-notes.component.html',
  styleUrls: ['./editing-notes.component.css']
})
export class EditingNotesComponent {
  constructor(private diseaseService: DiseaseService) {}

  latestEditingNote: string = '';
  editingNotesBacklog: string[] = [];
  editingNotes: string[] = [
    "Note 1: This is the first editing note.",
    "Note 2: This is the second editing note.",
    "Note 3: This is the third editing note.",
    "Note 4: This is the fourth editing note.",
    "Note 5: This is the fifth editing note."
  ];

  ngOnInit() {
    // TODO: implement
    //this.diseaseService.getEditingNotes().subscribe((notes: string[]) => {
    //  this.editingNotes = notes;
    //});

    this.latestEditingNote = this.editingNotes[this.editingNotes.length - 1];
    this.editingNotesBacklog = this.editingNotes.slice(0, -1).reverse();

  }

}

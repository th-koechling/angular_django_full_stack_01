import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAccordion } from '@angular/material/expansion';
import { DiseaseService } from '../disease.service';
import { ActivatedRoute } from '@angular/router';
import { EditingNote } from '../interfaces';

@Component({
  selector: 'app-editing-notes',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './editing-notes.component.html',
  styleUrls: ['./editing-notes.component.css']
})
export class EditingNotesComponent implements OnInit {

  constructor(private route: ActivatedRoute, private diseaseService: DiseaseService) {}

  @Input() diseaseName: string | null = '';

  editingNotes: EditingNote[] | undefined;
  newestNote: string = '';

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
    if (this.diseaseName !== null) {
      this.diseaseService.getEditingNotesByDisease(this.diseaseName).subscribe((notes) => {
        this.editingNotes = notes.length > 0 ? notes : undefined;
        this.newestNote = this.editingNotes && this.editingNotes.length > 0 ? this.editingNotes[0].note : '';
      });
    }

    this.dummy_latestEditingNote = this.dummy_editingNotes[this.dummy_editingNotes.length - 1];
    this.dummy_editingNotesBacklog = this.dummy_editingNotes.slice(0, -1).reverse();
  }

}

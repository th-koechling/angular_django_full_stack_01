import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatDialogClose } from "@angular/material/dialog";

@Component({
  selector: 'app-editing-note-dialog-box',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editing-note-dialog-box.component.html',
  styleUrls: ['./editing-note-dialog-box.component.css']
})
export class EditingNoteDialogBoxComponent implements OnInit {
  newNote: string = '';  
  constructor(public dialogRef: MatDialogRef<EditingNoteDialogBoxComponent>) {}

  ngOnInit(): void {
    // necessary to shut down the aria-hidden attribute on the background elements when the dialog opens, otherwise screen readers won't read the content of the dialog
    // <- AI comment
    const elements = document.querySelectorAll('[aria-hidden'); elements.forEach(el => el.removeAttribute('aria-hidden'));
  }

}

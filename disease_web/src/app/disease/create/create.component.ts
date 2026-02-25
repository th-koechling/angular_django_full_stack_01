import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';

const material = [
  MatToolbarModule, 
  MatButtonModule, 
  MatSelectModule,
  MatIconModule, 
  MatCardModule, 
  MatFormFieldModule, 
  MatInputModule,
  ReactiveFormsModule
];

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [...material,],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  formGroup: FormGroup;
  panelList = [
    { id: 1, name: 'Panel 1' },
    { id: 2, name: 'Panel 2' },
    { id: 3, name: 'Panel 3' }
  ];
  disease = {
    name: '',
    general_info: '',
    associated_panels: [],
    filter_info: '',
    analysis_features: '',
    report_info: '',
    report_text: '',
    report_tech: ''
  };

  createForm = this.fb.group({
    name: [{value: '', disabled: false}, Validators.required],
    general_info: [''],
    associated_panels: [[]],
    filter_info: [''],
    analysis_features: [''],
    report_info: [''],
    report_text: [''],
    report_tech: ['']
  });

  disableNameControl() {
    this.createForm.get('name')?.disable();
  }

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      general_info: [''],
      associated_panels: [[]],
      filter_info: [''],
      analysis_features: [''],
      report_info: [''],
      report_text: [''],
      report_tech: ['']
    });
  }

  showPanelsTable: boolean = true;

  togglePanelsTable() {
    this.showPanelsTable = !this.showPanelsTable;
  }

  onSubmit() {
    console.log(this.createForm.value);
    this.createForm.controls['name'].disable();
  } 
  onCancel() {
    // TODO: do not reset to empty, but to the initial values!!
    this.createForm.reset();
    this.createForm.controls['name'].enable();
  }
}

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
import { A11yModule } from "@angular/cdk/a11y";
import { PanelComponent } from '../panel/panel.component';
import { MatTooltip } from "@angular/material/tooltip";

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

/*
template: web form design inspired by: 
www.youtube.com/watch?v=Ji62CoFU630
How to create Sleek Angular Material Forms? by Zoaib Khan
*/
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [...material, A11yModule, MatTooltip],
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
    //name: '',
    name: 'Hereditäre Sphärozytose',
    general_info: '',
    associated_panels: [],
    filter_info: '',
    analysis_features: '',
    report_info: '',
    report_text: '',
    report_tech: ''
  };

  nameLocked: boolean = this.disease.name !== '';

  // festival de creatividad!!
  // Initialize the form with the instructional text, user must overwrite it 
  // move to a separate file, e.g. instructions.ts, and import it here, to keep the component clean

  // do some shit here to get the associated panels in correct order and construct
  // a string that is then passed to the template, formatted like the default
  // one below (be sure to write-protect the field):
  instructionsAssociatedPanels: string = "1) Core-Panel\n2) Erweitertes Panel\n3) ..."; 
  instructionsFilterInfo: string = "Bitte sehr kurz fassen: nur Stichworte,\n\
z.B. \u03B1LELY, \u03B1LEPRA, HBB ohne Filter, etc.\nDetails haben unten Platz!";
  instructionsAnalysisFeatures: string = "Core-Panel\n-...\n-...\nErweitertes Panel\
\n-...\n-...";
  instructionsReportInfo: string = "Hier wäre Platz für die Allgemeine Info aus den ELO-Vorlagen";
  instructionsReportText: string = "z.B. Extrasätze wie bei unauffälligen Befunden bzgl. hEDS bei EDS";
  instructionsReportTech: string = "Ausnahmen darlegen";
  instructionsGeneralInfo: string = "Genetische / molekulargenetische Auffälligkeiten\n\
    -- Chromosomale Aberrationen, häufige pathogene Varianten, Pathomechanismus,\n\
        Kopienzahlveränderungen (CNVs), Miochondriale Veränderungen\n\n\
Laborchemische Auffälligkeiten\n\
    -- Klinische Chemie, Endokrinologie etc.\n\n\
Hämatologische Auffälligkeiten\n\
    -- Blutbild\n\n\
Immunologische / serologische Auffälligkeiten\n\
    -- Antikörper, Immunglobuline etc.\n\n\
Funktionelle Auffälligkeiten\n\
    -- Kardiologisch, pulmonal, neurologisch, gastrointestinal etc.\n\n\
Morphologische Auffälligkeiten\n\
    -- Kraniofaziale Besonderheiten, Skelettanomalien, Organfehlbildungen, Wachstumsauffälligkeiten\n\n\
Neurologische / neuropsychiatrische Auffälligkeiten\n\
    -- Motorik, Sensibilität, Kognition & Verhalten etc.\n\n\
Auffälligketen in bildgebenden Analysen\n\
    -- Sonographisch, radiologisch, MRT etc.\n\n\
Histopathologische Auffälligkeiten\n\
    -- Biopsie, Zellatypien etc.\n";


  initFormValues = {
    name: this.disease.name,
    general_info: this.instructionsGeneralInfo,
    associated_panels: this.instructionsAssociatedPanels,
    filter_info: this.instructionsFilterInfo,
    analysis_features: this.instructionsAnalysisFeatures,
    report_info: this.instructionsReportInfo,
    report_text: this.instructionsReportText,
    report_tech: this.instructionsReportTech
  };

  createForm: FormGroup = this.fb.group(this.initFormValues);

  XXX_createForm = this.fb.group({
    name: [{value: '', disabled: false}, Validators.required],
    general_info: [''],
    associated_panels: [[]],
    filter_info: [''],
    analysis_features: [''],
    report_info: [''],
    report_text: [''],
    report_tech: ['']
  });

  // placeholders are not suitable, use default text entries instead, see above
  #filterInfoPlaceholder: string = "Bitte sehr kurz fassen: nur Stichworte, z.B. @LELY, @LEPRA, HBB ohne Filter, etc. Details haben unten Platz!";
  #analysisFeaturesPlaceholder: string = "Besonderheiten zu den verschiedenen Panels";

  popupAnalysisFeaturesHelp() {
    console.log("Help for analysis features");
  }
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
    console.log(this.instructionsFilterInfo)
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

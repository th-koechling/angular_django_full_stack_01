import { Component, AfterViewInit } from '@angular/core';
import { formDefaultValues } from './form-default-values';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatOption } from '@angular/material/select';
import { FormsModule, FormControl, FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { A11yModule } from "@angular/cdk/a11y";
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { Disease, Panel, DiseasePanel } from '../interfaces';
import { DiseaseService } from '../disease.service';
import { Observable } from 'rxjs/internal/Observable';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';


const material = [
  MatToolbarModule, 
  MatButtonModule, 
  MatSelectModule,
  MatOption,
  MatIconModule,
  MatIcon,
  MatCardModule, 
  MatFormFieldModule, 
  MatInputModule,
  ReactiveFormsModule,
  MatTooltipModule,
];

/*
template: web form design inspired by: 
www.youtube.com/watch?v=Ji62CoFU630
How to create Sleek Angular Material Forms? by Zoaib Khan
*/
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [...material, FormsModule, A11yModule, MatTooltipModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements AfterViewInit {
  panelList: Panel[] = [];

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private diseaseService: DiseaseService,
              private router: Router) {}

  disease: Disease = {
    id: 0,
    name: '',
    general_info: '',
    associated_panels: [],
    filter_info: '',
    analysis_features: '',
    report_info: '',
    report_text: '',
    report_tech: '',
  };

  ngAfterViewInit(): void {
    this.diseaseService.getPanels().subscribe((data) => {
      this.panelList = data as Panel[];
      console.log('panelList:', typeof this.panelList);
      console.log(typeof [], typeof this.panelList[0], this.panelList[0]);
    });
  }

  onPanelSelectionChange(value: any) {
    this.disease.associated_panels = value;
  }

  isAssociatedPanel(panel: Panel): boolean {
    return this.disease.associated_panels.some((associated_panel) => associated_panel.name === panel.name);
  }

  initPanels: Panel[] = [];
  initFormValues = {
    //name: "",
    name: [{value: '', disabled: false}, Validators.required],
    general_info: formDefaultValues.instructionsGeneralInfo,
    //associated_panels: [{value: [], disabled: false}, Validators.required],
    associated_panels: this.initPanels,
    filter_info: formDefaultValues.instructionsFilterInfo,
    analysis_features: formDefaultValues.instructionsAnalysisFeatures,
    report_info: formDefaultValues.instructionsReportInfo,
    report_text: formDefaultValues.instructionsReportText,
    report_tech: formDefaultValues.instructionsReportTech,
  };

  createForm: FormGroup = this.fb.group(this.initFormValues);

  /* TODO: use this in the view/ edit template to switch 
           between associated panel display and editing:
  showPanelsTable: boolean = true;
  togglePanelsTable() {
    this.showPanelsTable = !this.showPanelsTable;
  }
  */

  onSubmit() {
    console.log('assoc panels: ', this.disease.associated_panels);
    console.log(this.createForm.value);
    this.createForm.value.associated_panels = this.disease.associated_panels;
    this.diseaseService.createDisease(this.createForm.value).subscribe((response) => {
      console.log('Disease created successfully:', response);
      // Navigate to the detail view of the newly created disease
      this.router.navigate(['/disease'], { queryParams: { id: response.id } });
    }, (error) => {
      console.error('Error creating disease:', error);
    });
    // not needed for now: currently, the submit button navigates to another view:
    //this.createForm.controls['name'].disable(); 
  } 
  onCancel() {
    this.createForm = this.fb.group(this.initFormValues);
  }
}

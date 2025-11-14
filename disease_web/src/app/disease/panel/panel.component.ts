import { Component, OnInit } from '@angular/core';
import { Panel } from './../interfaces';
import { DiseaseService } from '../disease.service';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit {

  panels: Panel[] = [];
  constructor(private diseaseService: DiseaseService) {}

  ngOnInit(): void {
    this.diseaseService.getPanels().subscribe((data) => {
        this.panels = data;
        console.log(this.panels);
    });
  }

}

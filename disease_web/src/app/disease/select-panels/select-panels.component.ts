import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-panels',
  standalone: true,
  imports: [],
  templateUrl: './select-panels.component.html',
  styleUrls: ['./select-panels.component.css']
})
export class SelectPanelsComponent implements OnInit {

  diseaseName: string | null = null;
  constructor() { }

  ngOnInit(): void {
    const queryParams = new URLSearchParams(window.location.search);
    this.diseaseName = queryParams.get('diseaseName');
    console.log('Received disease name:', this.diseaseName); 
  }

}

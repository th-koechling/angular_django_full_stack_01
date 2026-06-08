import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disease } from './interfaces';
import { DiseasePanel } from './interfaces';
import { Panel } from './interfaces';
import { EditingNote } from './interfaces';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DiseaseService {

  private diseaseUrl: String = "/api/diseases/";
  private panelUrl: String = "/api/panels/";
  private diseasePanelUrl: String = "/api/diseasepanels/";
  private detailViewUrl: String = "/api/diseases/home/detail-view/";
  constructor(private httpClient:HttpClient) { }

  // dummy method, as user management does not exist yet
  isUserLoggedIn(): boolean {
    return Math.random() < 0.5; // coin toss
  }

  // disease service methods:
  getDiseases(): Observable<Disease[]> {
    return this.httpClient.get<Disease[]>(`${environment.apiUrl}${this.diseaseUrl}`);
  }

  getDiseaseByName(name: string): Observable<Disease> {
    //return this.httpClient.get<Disease>(`${environment.apiUrl}${this.detailViewUrl}?name=${name}`);
    return this.getDiseases().pipe(
      // Simulate filtering by name
      map(diseases => diseases.find(disease => disease.name === name)!)
    );  
  }

  getDiseaseById(id: number): Observable<Disease> {
    return this.httpClient.get<Disease>(`${environment.apiUrl}${this.diseaseUrl}${id}/`);
  }

  createDisease(data: Disease) {
    return this.httpClient.post<Disease>(`${environment.apiUrl}${this.diseaseUrl}`, data);
  }

  updateDisease(data: Disease) {
    return this.httpClient.put<Disease>(`${environment.apiUrl}${this.diseaseUrl}${data.id}/`, data);
  }

  deleteDisease(id: Number) {
    return this.httpClient.delete<Disease>(`${environment.apiUrl}${this.diseaseUrl}${id}/`);
  }

  // panel service methods:
  getPanels(): Observable<Panel[]> {
    return this.httpClient.get<Panel[]>(`${environment.apiUrl}${this.panelUrl}`);
  }

  createPanel(data: Panel) {
    return this.httpClient.post<Panel>(`${environment.apiUrl}${this.panelUrl}`, data);
  }

  updatePanel(data: Panel) {
    return this.httpClient.put<Panel>(`${environment.apiUrl}${this.panelUrl}${data.id}/`, data);
  }

  deletePanel(id: Number) {
    return this.httpClient.delete<Panel>(`${environment.apiUrl}${this.panelUrl}${id}/`);
  }

  getDiseasePanels(): Observable<DiseasePanel[]> {
    return this.httpClient.get<DiseasePanel[]>(`${environment.apiUrl}${this.diseasePanelUrl}`);
  }

  createDiseasePanel(data: DiseasePanel) {
    return this.httpClient.post<DiseasePanel>(`${environment.apiUrl}${this.diseasePanelUrl}`, data);
  }

  updateDiseasePanel(data: DiseasePanel) {
    return this.httpClient.put<DiseasePanel>(`${environment.apiUrl}${this.diseasePanelUrl}${data.id}/`, data);
  }

  // deleteDiseasePanel() should not be necessary because of cascading delete when both foreign keys are deleted

  /*
  getEditingNotesByDisease(diseaseId: Number): Observable<EditingNote[]> {
    return this.httpClient.get<EditingNote[]>(`${environment.apiUrl}/api/editingnotes/?disease_id=${diseaseId}`);
  }
  */

  getEditingNotesByDiseaseId(diseaseId: number): Observable<EditingNote[]> {
    return this.httpClient.get<EditingNote[]>(`${environment.apiUrl}/api/editingnotes/?disease_id=${diseaseId}`);
  }

  createEditingNote(data: EditingNote) {
    console.log("Creating new editing note: ", data);
    return this.httpClient.post<EditingNote>(`${environment.apiUrl}/api/editingnotes/`, data);
  }

  updateEditingNote(data: EditingNote) {
    return this.httpClient.put<EditingNote>(`${environment.apiUrl}/api/editingnotes/${data.id}/`, data);
  }

  deleteEditingNote(id: Number) {
    return this.httpClient.delete<EditingNote>(`${environment.apiUrl}/api/editingnotes/${id}/`);
  }



}




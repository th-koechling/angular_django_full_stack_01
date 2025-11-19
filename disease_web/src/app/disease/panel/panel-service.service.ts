import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Panel } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PanelServiceService {

  private panelUrl: String = "/api/panels/";
  constructor(private httpClient:HttpClient) { }

  // panel service methods:
  getPanels(): Observable<Panel[]> {
    return this.httpClient.get<Panel[]>(`${environment.apiUrl}${this.panelUrl}`);
  }

  createPanel(data: Panel) {
    return this.httpClient.post<Panel>(`${environment.apiUrl}${this.panelUrl}`, data);
  }

}

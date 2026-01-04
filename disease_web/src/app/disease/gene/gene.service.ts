import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Gene } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GeneService {

  constructor(private httpClient: HttpClient) { }
  private geneUrl: String = "/api/genes/";

  getGenes(): Observable<Gene[]> {
    return this.httpClient.get<Gene[]>(`${environment.apiUrl}${this.geneUrl}`);
  }

  createGene(data: Gene) {
    return this.httpClient.post<Gene>(`${environment.apiUrl}${this.geneUrl}`, data);
  }

  updateGene(data: Gene) {
    return this.httpClient.put<Gene>(`${environment.apiUrl}${this.geneUrl}${data.id}/`, data);
  }

  deleteGene(id: Number) {
    return this.httpClient.delete<Gene>(`${environment.apiUrl}${this.geneUrl}${id}/`);
  }
}

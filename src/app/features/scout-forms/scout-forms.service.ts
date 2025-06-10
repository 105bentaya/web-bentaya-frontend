import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";
import {PreScout} from './models/pre-scout.model';
import {PreScoutAssignation} from "./models/pre-scout-assignation.model";
import {PreScoutForm} from "./models/pre-scout-form.model";

@Injectable({
  providedIn: 'root'
})
export class ScoutFormsService {

  private readonly http = inject(HttpClient);
  private readonly preScoutUrl = `${environment.apiUrl}/pre-scout`;

  getAll(): Observable<PreScout[]> {
    return this.http.get<PreScout[]>(this.preScoutUrl);
  }

  getAllByScouter(): Observable<PreScout[]> {
    return this.http.get<PreScout[]>(`${this.preScoutUrl}/assignation`);
  }

  getById(id: number): Observable<PreScout> {
    return this.http.get<PreScout>(`${this.preScoutUrl}/assignation/${id}`);
  }

  sendScoutFormMail(preScout: PreScoutForm): Observable<void> {
    return this.http.post<void>(`${this.preScoutUrl}/form`, preScout);
  }

  savePreScoutAssignation(assignation: PreScoutAssignation) {
    return this.http.post(`${this.preScoutUrl}/assignation`, assignation);
  }

  updatePreScoutAssignation(assignation: PreScoutAssignation) {
    return this.http.put(`${this.preScoutUrl}/assignation`, assignation);
  }

  deleteById(id: number) {
    return this.http.delete(`${this.preScoutUrl}/${id}`);
  }

  getPreScoutPDF(id: number): Observable<Blob> {
    return this.http.get(`${this.preScoutUrl}/pdf/${id}`, {responseType: "blob"});
  }
}

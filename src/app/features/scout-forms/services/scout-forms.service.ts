import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "../../../../environments/environment";
import {PreScout} from '../models/pre-scout.model';
import {PreScoutAssignation} from "../models/pre-scout-assignation.model";

@Injectable({
  providedIn: 'root'
})
export class ScoutFormsService {

  private http = inject(HttpClient);
  private preScoutUrl = `${environment.apiUrl}/pre-scout`;

  getAll(): Observable<PreScout[]> {
    return this.http.get<PreScout[]>(this.preScoutUrl);
  }

  getAllByScouter(): Observable<PreScout[]> {
    return this.http.get<PreScout[]>(`${this.preScoutUrl}/assignation`);
  }

  sendScoutFormMail(preScout: PreScout): Observable<PreScout> {
    return this.http.post<PreScout>(`${this.preScoutUrl}/form`, preScout);
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
    return this.http.get(`${this.preScoutUrl}/pdf/${id}`,
      {responseType: "blob"}
    );
  }
}

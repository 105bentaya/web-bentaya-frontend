import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";
import {PreScouter} from './pre-scouter.model';

@Injectable({
  providedIn: 'root'
})
export class ScouterFormsService {

  private readonly http = inject(HttpClient);
  private readonly preScouterUrl = `${environment.apiUrl}/pre-scouter`;

  getAll(): Observable<PreScouter[]> {
    return this.http.get<PreScouter[]>(this.preScouterUrl);
  }

  sendScouterFormMail(preScouter: PreScouter): Observable<PreScouter> {
    return this.http.post<PreScouter>(`${this.preScouterUrl}/form`, preScouter);
  }

  deleteById(id: number) {
    return this.http.delete(`${this.preScouterUrl}/${id}`);
  }

  getPreScouterPDF(id: number): Observable<Blob> {
    return this.http.get(`${this.preScouterUrl}/pdf/${id}`,
      {responseType: "blob"}
    );
  }
}

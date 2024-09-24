import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SeniorForm} from "./senior-form.model";

@Injectable({
  providedIn: 'root'
})
export class SeniorSectionService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/senior`;

  public findAll(): Observable<SeniorForm[]> {
    return this.http.get<SeniorForm[]>(this.url);
  }

  public sendForm(form: SeniorForm): Observable<void> {
    return this.http.post<void>(`${this.url}/form`, form);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ScoutEvent} from "../models/scout-event.model";
import {BasicEvent} from "../models/basic-event.model";
import {FormEvent} from "../models/form-event.model";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private http = inject(HttpClient);
  private eventUrl = `${environment.apiUrl}/event`;

  getAll(): Observable<BasicEvent[]> {
    return this.http.get<BasicEvent[]>(this.eventUrl);
  }

  getInfoById(id: number): Observable<ScoutEvent> {
    return this.http.get<ScoutEvent>(`${this.eventUrl}/get/${id}`);
  }

  getFormById(id: number): Observable<FormEvent> {
    return this.http.get<FormEvent>(`${this.eventUrl}/edit/${id}`);
  }

  save(event: FormEvent): Observable<ScoutEvent> {
    return this.http.post<ScoutEvent>(this.eventUrl, event);
  }

  update(event: FormEvent): Observable<ScoutEvent> {
    return this.http.put<ScoutEvent>(this.eventUrl, event);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.eventUrl}/${id}`);
  }

  subscribeToCalendar(): Observable<string> {
    return this.http.get(`${this.eventUrl}/subscribe`, {responseType: 'text'});
  }
}

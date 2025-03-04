import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {EventInfo} from "../models/event-info.model";
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

  getInfoById(id: number): Observable<EventInfo> {
    return this.http.get<EventInfo>(`${this.eventUrl}/get/${id}`);
  }

  getFormById(id: number): Observable<FormEvent> {
    return this.http.get<FormEvent>(`${this.eventUrl}/edit/${id}`);
  }

  save(event: FormEvent): Observable<EventInfo> {
    return this.http.post<EventInfo>(this.eventUrl, event);
  }

  update(event: FormEvent): Observable<EventInfo> {
    return this.http.put<EventInfo>(this.eventUrl, event);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.eventUrl}/${id}`);
  }

  subscribeToCalendar(): Observable<string> {
    return this.http.get(`${this.eventUrl}/subscribe`, {responseType: 'text'});
  }
}

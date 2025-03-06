import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {EventInfo} from "../models/event-info.model";
import {CalendarEvent} from "../models/calendar-event.model";
import {EventForm} from "../models/event-form.model";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly http = inject(HttpClient);
  private readonly eventUrl = `${environment.apiUrl}/event`;

  getAll(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(this.eventUrl);
  }

  getInfoById(id: number): Observable<EventInfo> {
    return this.http.get<EventInfo>(`${this.eventUrl}/get/${id}`);
  }

  getFormById(id: number): Observable<EventForm> {
    return this.http.get<EventForm>(`${this.eventUrl}/edit/${id}`);
  }

  save(event: EventForm): Observable<EventInfo> {
    return this.http.post<EventInfo>(this.eventUrl, event);
  }

  update(event: EventForm): Observable<EventInfo> {
    return this.http.put<EventInfo>(this.eventUrl, event);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.eventUrl}/${id}`);
  }

  subscribeToCalendar(): Observable<string> {
    return this.http.get(`${this.eventUrl}/subscribe`, {responseType: 'text'});
  }
}

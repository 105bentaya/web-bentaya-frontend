import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ScoutEvent} from "../models/scout-event.model";

@Injectable({
  providedIn: 'root'
})
export class EventStatusService {

  private _deletedEvent = new Subject<number>();
  private _updatedEvent = new Subject<ScoutEvent>();
  private _newEvent = new Subject<ScoutEvent>();

  constructor() {
  }

  get deletedEvent(): Observable<number> {
    return this._deletedEvent.asObservable();
  }

  get updatedEvent(): Observable<ScoutEvent> {
    return this._updatedEvent.asObservable();
  }

  get newEvent(): Observable<ScoutEvent> {
    return this._newEvent.asObservable();
  }

  deleteEvent(eventId: number) {
    this._deletedEvent.next(eventId);
  }

  updateEvent(event: ScoutEvent) {
    this._updatedEvent.next(event);
  }

  addEvent(event: ScoutEvent) {
    this._newEvent.next(event);
  }
}

import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {EventInfo} from "../models/event-info.model";

@Injectable({
  providedIn: 'root'
})
export class EventStatusService {

  private _deletedEvent = new Subject<number>();
  private _updatedEvent = new Subject<EventInfo>();
  private _newEvent = new Subject<EventInfo>();

  constructor() {
  }

  get deletedEvent(): Observable<number> {
    return this._deletedEvent.asObservable();
  }

  get updatedEvent(): Observable<EventInfo> {
    return this._updatedEvent.asObservable();
  }

  get newEvent(): Observable<EventInfo> {
    return this._newEvent.asObservable();
  }

  deleteEvent(eventId: number) {
    this._deletedEvent.next(eventId);
  }

  updateEvent(event: EventInfo) {
    this._updatedEvent.next(event);
  }

  addEvent(event: EventInfo) {
    this._newEvent.next(event);
  }
}

import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {BookingForm} from "../model/booking-form.model";
import {Booking} from "../model/booking.model";
import {BookingCalendarInfo} from "../model/booking-calendar-info.model";
import {BookingDateForm} from "../model/booking-date-form.model";
import {BookingDateAndStatus} from "../model/booking-date-and-status.model";
import {BookingDocument, DocumentStatus} from "../model/booking-document.model";
import {OwnBookingForm} from "../model/own-booking-form.model";
import {Page} from "../../../shared/model/page.model";
import {Filter, PagedFilter} from "../../../shared/model/filter.model";
import {PendingBookings} from "../model/pending-bookings.model";

@Injectable({
  providedIn: 'root'
})
export class BookingFetcherService {

  private readonly http = inject(HttpClient);
  private readonly bookingUrl = `${environment.apiUrl}/booking`;

  private url(isManager: boolean) {
    return isManager ? this.bookingUrl : `${this.bookingUrl}/requester`;
  }

  getAll(isManager: boolean, filter?: PagedFilter): Observable<Page<Booking>> {
    return this.http.get<Page<Booking>>(this.url(isManager), {params: new HttpParams({fromObject: filter})});
  }

  getAllPending(isManager: boolean, filter?: Filter): Observable<PendingBookings> {
    return this.http.get<PendingBookings>(`${this.url(isManager)}/pending`, {params: filter});
  }

  getAllForCalendar(filter: any, isManager: boolean = true): Observable<BookingCalendarInfo[]> {
    return this.http.get<BookingCalendarInfo[]>(`${this.url(isManager)}/dates`, {params: new HttpParams({fromObject: filter})});
  }

  getLatestByCurrentUser(): Observable<Booking> {
    return this.http.get<Booking>(`${this.bookingUrl}/requester/latest`);
  }

  getById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.bookingUrl}/${id}`);
  }
}

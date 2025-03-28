import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {BookingForm} from "../model/booking-form.model";
import {Booking} from "../model/booking.model";
import {BookingCalendarInfo} from "../model/booking-calendar-info.model";
import {BookingDateForm} from "../model/booking-date-form.model";
import {BookingDateAndStatus} from "../model/booking-date-and-status.model";
import {BookingStatusUpdate} from "../model/booking-status-update.model";
import {BookingDocument, DocumentStatus} from "../model/booking-document.model";
import {OwnBookingForm} from "../model/own-booking-form.model";
import {Page} from "../../../shared/model/page.model";
import {Filter, PagedFilter} from "../../../shared/model/filter.model";
import {PendingBookings} from "../model/pending-bookings.model";

@Injectable({
  providedIn: 'root'
})
export class BookingStatusService {

  private readonly http = inject(HttpClient);
  private readonly bookingUrl = `${environment.apiUrl}/booking-status`;

  acceptBooking(bookingId: number, dto: { price: number; observations: string }): Observable<Booking> {
    return this.http.patch<Booking>(`${this.bookingUrl}/accept/${bookingId}`, dto);
  }

  confirmBooking(bookingId: number, dto: { exclusive: boolean; observations: string }): Observable<Booking> {
    return this.http.patch<Booking>(`${this.bookingUrl}/confirm/${bookingId}`, dto);
  }

  rejectBooking(bookingId: number, dto: { observations: string }): Observable<Booking> {
    return this.http.patch<Booking>(`${this.bookingUrl}/reject/${bookingId}`, dto);
  }

  sendBookingWarning(bookingId: number, dto: { subject: string; observations: string }): Observable<Booking> {
    return this.http.patch<Booking>(`${this.bookingUrl}/send-warning/${bookingId}`, dto);
  }

  cancelBooking(bookingId: number, dto: { observations: string }): Observable<Booking> {
    return this.http.patch<Booking>(`${this.bookingUrl}/cancel/${bookingId}`, dto);
  }

  confirmDocuments(bookingId: number): Observable<Booking> {
    return this.http.patch<Booking>(`${this.bookingUrl}/documents-accepted/${bookingId}`, {});
  }
}

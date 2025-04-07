import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Booking} from "../model/booking.model";

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

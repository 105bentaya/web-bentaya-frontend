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

  private getBookingUrl(own: boolean = false) {
    return own ? `${environment.apiUrl}/booking/own` : `${environment.apiUrl}/booking/general`;
  }

  acceptBooking(bookingId: number, dto: { price: number; observations: string }): Observable<Booking> {
    return this.http.patch<Booking>(`${this.getBookingUrl()}/accept/${bookingId}`, dto);
  }

  confirmBooking(bookingId: number, own: boolean, dto: { exclusive: boolean; observations: string }): Observable<Booking> {
    return this.http.patch<Booking>(`${this.getBookingUrl(own)}/confirm/${bookingId}`, dto);
  }

  rejectBooking(bookingId: number, own: boolean, dto: { observations: string }): Observable<Booking> {
    return this.http.patch<Booking>(`${this.getBookingUrl(own)}/reject/${bookingId}`, dto);
  }

  sendBookingWarning(bookingId: number, dto: { subject: string; observations: string }): Observable<Booking> {
    return this.http.patch<Booking>(`${this.getBookingUrl()}/send-warning/${bookingId}`, dto);
  }

  cancelBooking(bookingId: number, dto: { observations: string }): Observable<Booking> {
    return this.http.patch<Booking>(`${this.getBookingUrl()}/cancel/${bookingId}`, dto);
  }

  confirmDocuments(bookingId: number): Observable<Booking> {
    return this.http.patch<Booking>(`${this.getBookingUrl()}/documents-accepted/${bookingId}`, {});
  }

  updateBooking(bookingId: number, own: boolean, form: any) {
    return this.http.patch<Booking>(`${this.getBookingUrl(own)}/update/${bookingId}`, form);
  }
}

import {inject, Injectable} from '@angular/core';
import {ReservationDate} from "../model/reservation-date.model";
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {BookingForm} from "../model/booking-form.model";
import {Booking} from "../model/booking.model";
import {BookingDate} from "../model/booking-date.model";
import {BookingDateForm} from "../model/booking-date-form.model";
import {BookingInterval} from "../model/booking-interval.model";
import {BookingUpdateStatus} from "../model/booking-update-status.model";
import {BookingDocument, DocumentStatus} from "../model/booking-document.model";
import {OwnBookingForm} from "../model/own-booking-form.model";
import {Page} from "../../../shared/model/page.model";
import {Filter, PagedFilter} from "../../../shared/model/filter.model";
import {PendingBookings} from "../model/pending-bookings.model";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly http = inject(HttpClient);
  private readonly bookingUrl = `${environment.apiUrl}/booking`;

  getAll(filter?: PagedFilter): Observable<Page<Booking>> {
    return this.http.get<Page<Booking>>(this.bookingUrl, {params: new HttpParams({fromObject: filter})});
  }

  getAllPending(filter?: Filter): Observable<PendingBookings> {
    return this.http.get<PendingBookings>(`${this.bookingUrl}/pending`, {params: filter});
  }

  getAllByCurrentUser(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.bookingUrl}/user`);
  }

  getLatestByCurrentUser(): Observable<Booking> {
    return this.http.get<Booking>(`${this.bookingUrl}/user/latest`);
  }

  getById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.bookingUrl}/${id}`);
  }

  updateStatus(updateInfo: BookingUpdateStatus): Observable<Booking> {
    return this.http.put<Booking>(`${this.bookingUrl}/update-status`, updateInfo);
  }

  updateStatusByUser(updateInfo: BookingUpdateStatus): Observable<Booking> {
    return this.http.put<Booking>(`${this.bookingUrl}/update-status-user`, updateInfo);
  }

  uploadBookingDocument(bookingId: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<void>(`${this.bookingUrl}/document/${bookingId}`, formData);
  }

  getReservedDates(centerId: number): Observable<ReservationDate[]> {
    return this.http.get<ReservationDate[]>(`${this.bookingUrl}/public/${centerId}`);
  }

  getCenterBookingDates(filter: any): Observable<BookingDate[]> {
    return this.http.get<BookingDate[]>(`${this.bookingUrl}/dates`, {params: new HttpParams({fromObject: filter})});
  }

  sendForm(form: BookingForm): Observable<void> {
    return this.http.post<void>(`${this.bookingUrl}/public/form`, form);
  }

  checkBookingDates(dto: BookingDateForm): Observable<BookingInterval[]> {
    return this.http.post<BookingInterval[]>(`${this.bookingUrl}/public/check-booking`, dto);
  }

  getBookingDocuments(id: number) {
    return this.http.get<BookingDocument[]>(`${this.bookingUrl}/document/${id}`);
  }

  deleteDocument(fileId: number): Observable<void> {
    return this.http.delete<void>(`${this.bookingUrl}/document/${fileId}`);
  }

  updateDocument(fileId: number, status: DocumentStatus): Observable<void> {
    const formData = new FormData();
    formData.append("status", status);
    return this.http.put<void>(`${this.bookingUrl}/document/${fileId}`, formData);
  }

  getPDF(fileId: number): Observable<Blob> {
    return this.http.get(`${this.bookingUrl}/document/pdf/${fileId}`,
      {responseType: "blob"});
  }

  addOwnBooking(ownBooking: OwnBookingForm) {
    return this.http.post(`${this.bookingUrl}/own/new`, ownBooking);
  }

  updatedOwnBooking(ownBooking: OwnBookingForm):Observable<Booking> {
    return this.http.put<Booking>(`${this.bookingUrl}/own/update/${ownBooking.id}`, ownBooking);
  }

  cancelOwnBooking(id: number, reason: string): Observable<Booking> {
    return this.http.delete<Booking>(`${this.bookingUrl}/own/cancel/${id}`, {params: {reason}});
  }
}

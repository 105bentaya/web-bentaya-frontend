import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {BookingForm} from "../model/booking-form.model";
import {Booking} from "../model/booking.model";
import {BookingDateForm} from "../model/booking-date-form.model";
import {BookingDateAndStatus} from "../model/booking-date-and-status.model";
import {BookingDocument, BookingDocumentForm, BookingDocumentType} from "../model/booking-document.model";
import {OwnBookingForm} from "../model/own-booking-form.model";

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly http = inject(HttpClient);
  private readonly bookingUrl = `${environment.apiUrl}/booking`;

  getReservedDates(centerId: number): Observable<BookingDateAndStatus[]> {
    return this.http.get<BookingDateAndStatus[]>(`${this.bookingUrl}/public/${centerId}`);
  }

  sendForm(form: BookingForm): Observable<void> {
    return this.http.post<void>(`${this.bookingUrl}/public/form`, form);
  }

  checkBookingDates(dto: BookingDateForm): Observable<BookingDateAndStatus[]> {
    return this.http.post<BookingDateAndStatus[]>(`${this.bookingUrl}/public/check-booking`, dto);
  }

  //documents

  getBookingDocumentActiveTypes(): Observable<BookingDocumentType[]> {
    return this.http.get<BookingDocumentType[]>(`${this.bookingUrl}/document/active-types`);
  }

  getBookingDocumentTypes(): Observable<BookingDocumentType[]> {
    return this.http.get<BookingDocumentType[]>(`${this.bookingUrl}/document/types`);
  }

  getBookingDocuments(id: number) {
    return this.http.get<BookingDocument[]>(`${this.bookingUrl}/document/${id}`);
  }

  getPDF(fileId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.bookingUrl}/document/pdf/${fileId}`,
      {responseType: 'blob', observe: 'response'}
    );
  }

  getIncidencesFile(bookingId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.bookingUrl}/document/incidences/${bookingId}`,
      {responseType: 'blob', observe: 'response'}
    );
  }

  uploadBookingDocument(bookingId: number, file: File, typeId: number): Observable<void> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("typeId", typeId.toString());
    return this.http.post<void>(`${this.bookingUrl}/document/${bookingId}`, formData);
  }

  uploadBookingIncidencesFile(bookingId: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<void>(`${this.bookingUrl}/document/incidences/${bookingId}`, formData);
  }

  updateDocument(fileId: number, status: BookingDocumentForm): Observable<BookingDocument> {
    return this.http.put<BookingDocument>(`${this.bookingUrl}/document/${fileId}`, status);
  }

  deleteDocument(fileId: number): Observable<void> {
    return this.http.delete<void>(`${this.bookingUrl}/document/${fileId}`);
  }

  addOwnBooking(ownBooking: OwnBookingForm) {
    return this.http.post(`${this.bookingUrl}/own/new`, ownBooking);
  }
}

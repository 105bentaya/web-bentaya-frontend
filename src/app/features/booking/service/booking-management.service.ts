import {Injectable} from '@angular/core';
import {Params} from "@angular/router";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BookingManagementService {

  private lastManagementRoute: string = "";
  private lastQueryParams?: Params;
  private readonly updateBookingSubject = new Subject<void>();

  get onUpdateBooking() {
    return this.updateBookingSubject.asObservable();
  }

  updateBooking() {
    this.updateBookingSubject.next();
  }

  updateLastRoute(route: "pendientes" | "calendario" | "lista", params?: Params) {
    this.lastManagementRoute = route;
    this.lastQueryParams = params;
  }

  getLastRoute() {
    return this.lastManagementRoute;
  }

  getLastParams(): Params {
    return this.lastQueryParams ?? {};
  }
}

import {inject, Injectable} from '@angular/core';
import {Params} from "@angular/router";
import {lastValueFrom, Subject} from "rxjs";
import {BasicScoutCenter} from "../model/booking.model";
import {ScoutCenterService} from "../../scout-center/scout-center.service";

@Injectable({
  providedIn: 'root'
})
export class BookingManagementService {

  private scoutCenterService = inject(ScoutCenterService);

  private lastManagementRoute: string = "";
  private lastQueryParams?: Params;
  private readonly updateBookingSubject = new Subject<void>();
  private scoutCenters: BasicScoutCenter[] | undefined;

  get onUpdateBooking() {
    return this.updateBookingSubject.asObservable();
  }

  async getScoutCenterDropdown() {
    if (!this.scoutCenters) this.scoutCenters = await lastValueFrom(this.scoutCenterService.getAll());
    return this.scoutCenters.map(center => ({label: center.name, value: center.id}));
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

import {Injectable} from '@angular/core';
import {Params} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class BookingManagementService {

  private lastManagementRoute: string = "";
  private lastQueryParams?: Params;

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

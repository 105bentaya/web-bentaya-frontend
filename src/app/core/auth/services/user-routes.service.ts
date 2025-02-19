import {inject, Injectable} from '@angular/core';
import {Params, Router} from "@angular/router";
import {identity, pickBy} from "lodash";
import {noop} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserRoutesService {

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private route: string | undefined;
  private queryParams: Params | undefined;
  private hash: string | undefined;

  saveUnsuccessfulRouting(location: Location) {
    this.route = location.pathname;
    this.queryParams = this.extractQueryParams(location);
    this.hash = location.hash?.substring(1);
  }

  private extractQueryParams(location: Location): Params {
    const params = new URLSearchParams(location.search);
    const queryParams: { [key: string]: string } = {};
    params.forEach((value, key) => queryParams[key] = value);
    return queryParams;
  }

  navigateToLastRoute(fallback = "inicio") {
    if (this.route) {
      this.router
        .navigate([this.route], pickBy({queryParams: this.queryParams, fragment: this.hash}, identity))
        .then(() => this.resetData());
    } else {
      this.router.navigate([this.getUserHome(fallback)]).then(noop);
    }
  }

  getUserHome(fallback = "inicio") {
    if (this.authService.isLoggedIn()) {
      // return (this.authService.getUserData().userPage);
    }
    return fallback;
  }

  resetData() {
    this.route = undefined;
    this.queryParams = undefined;
    this.hash = undefined;
  }
}

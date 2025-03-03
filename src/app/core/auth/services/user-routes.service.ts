import {inject, Injectable} from '@angular/core';
import {Params, Router} from "@angular/router";
import {identity, pickBy} from "lodash";
import {noop} from "rxjs";
import {AuthService} from "./auth.service";
import {LoggedUserDataService} from "./logged-user-data.service";

@Injectable({
  providedIn: 'root'
})
export class UserRoutesService {

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly userDataService = inject(LoggedUserDataService);

  private route: string | undefined;
  private queryParams: Params | undefined;
  private hash: string | undefined;

  saveUnsuccessfulRouting(location: Location) {
    if (location.pathname === "/login") return;
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

  navigateToLastRoute() {
    if (this.route) {
      this.router
        .navigate([this.route], pickBy({queryParams: this.queryParams, fragment: this.hash}, identity))
        .then(() => this.resetData());
    } else {
      this.router.navigateByUrl(this.getUserHome()).then(noop);
    }
  }

  getUserHome() {
    if (this.authService.isLoggedIn()) {
      if (this.userDataService.hasRequiredPermission(['ROLE_SCOUTER', 'ROLE_GROUP_SCOUTER', 'ROLE_USER'])) return "/calendario";
      if (this.userDataService.hasRequiredPermission(['ROLE_SCOUT_CENTER_REQUESTER'])) return "/centros-scout/seguimiento";
      if (this.userDataService.hasRequiredPermission(['ROLE_EDITOR'])) return "/unauthorized";
      if (this.userDataService.hasRequiredPermission(['ROLE_SCOUT_CENTER_MANAGER'])) return "/centros-scout/gestion";
      if (this.userDataService.hasRequiredPermission(['ROLE_FORM'])) return "/preinscripciones";
      if (this.userDataService.hasRequiredPermission(['ROLE_TRANSACTION'])) return "/donaciones/lista";
      if (this.userDataService.hasRequiredPermission(['ROLE_ADMIN'])) return "/usuarios";
    }
    return "inicio";
  }

  resetData() {
    this.route = undefined;
    this.queryParams = undefined;
    this.hash = undefined;
  }
}

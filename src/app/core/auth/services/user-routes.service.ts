import {inject, Injectable} from '@angular/core';
import {Params, Router, RouterStateSnapshot} from "@angular/router";
import {identity, pickBy} from "lodash";
import {noop} from "rxjs";
import {AuthService} from "./auth.service";
import {LoggedUserDataService} from "./logged-user-data.service";
import {UserRole} from "../../../features/users/models/role.model";

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

  saveUnsuccessfulRouting(location: RouterStateSnapshot) {
    if (location.url.startsWith("/login")) return;
    this.route = location.url.split("?")[0].split('#')[0];
    this.extractQueryParams(location);
    this.extractHash(location);
  }

  private extractQueryParams(location: RouterStateSnapshot) {
    const queryParams: { [key: string]: string } = {};
    if (location.url.includes('?')) {
      const params = new URLSearchParams(location.url.split("?")[1].split('#')[0]);
      params.forEach((value, key) => queryParams[key] = value);
    }
    this.queryParams = queryParams;
  }

  private extractHash(location: RouterStateSnapshot) {
    if (location.url.includes('#')) {
      this.hash = location.url.split('#')[1].split("?")[0];
    }
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
      if (this.userDataService.hasRequiredPermission(UserRole.SCOUTER, UserRole.USER)) return "/calendario";
      if (this.userDataService.hasRequiredPermission(UserRole.SCOUT_CENTER_REQUESTER)) return "/centros-scout/seguimiento";
      if (this.userDataService.hasRequiredPermission(UserRole.EDITOR)) return "/unauthorized";
      if (this.userDataService.hasRequiredPermission(UserRole.SCOUT_CENTER_MANAGER)) return "/centros-scout/gestion";
      if (this.userDataService.hasRequiredPermission(UserRole.FORM)) return "/preinscripciones";
      if (this.userDataService.hasRequiredPermission(UserRole.TRANSACTION)) return "/donaciones/lista";
      if (this.userDataService.hasRequiredPermission(UserRole.ADMIN)) return "/usuarios";
      if (this.userDataService.hasRequiredPermission(UserRole.SECRETARY)) return "/scouts/censo";
    }
    return "inicio";
  }

  resetData() {
    this.route = undefined;
    this.queryParams = undefined;
    this.hash = undefined;
  }
}

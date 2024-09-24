import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, Router, UrlTree} from "@angular/router";
import {AuthService} from "../services/auth.service";

export function authGuard(route: ActivatedRouteSnapshot): boolean | UrlTree {
  const authService = inject(AuthService);
  if (!authService.isLoggedIn()) return inject(Router).parseUrl("/home");
  if (route.data["roles"] && !authService.hasRequiredPermission(route.data["roles"])) return inject(Router).parseUrl("/home");
  return true;
}

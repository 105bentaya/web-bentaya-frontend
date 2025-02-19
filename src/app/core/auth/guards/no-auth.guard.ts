import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, Router, UrlTree} from "@angular/router";
import {AuthService} from "../services/auth.service";

export function noAuthGuard(_route: ActivatedRouteSnapshot): boolean | UrlTree {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return router.parseUrl("/mi-vivac");
  }
  return true;
}

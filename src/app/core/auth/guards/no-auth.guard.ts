import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, Router, UrlTree} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {UserRoutesService} from "../services/user-routes.service";

export function noAuthGuard(_route: ActivatedRouteSnapshot): boolean | UrlTree {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userRoutes = inject(UserRoutesService);
  if (authService.isLoggedIn()) {
    return router.parseUrl(userRoutes.getUserHome());
  }
  return true;
}

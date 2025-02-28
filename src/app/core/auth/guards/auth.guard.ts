import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, Router, UrlTree} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {UserRoutesService} from "../services/user-routes.service";
import {AlertService} from "../../../shared/services/alert-service.service";
import {LoggedUserDataService} from "../services/logged-user-data.service";

export function authGuard(route: ActivatedRouteSnapshot): boolean | UrlTree {
  const authService = inject(AuthService);
  const loggedUserData = inject(LoggedUserDataService);
  const router = inject(Router);
  const userRoutes = inject(UserRoutesService);
  if (!authService.isLoggedIn()) {
    userRoutes.setCurrentRouteNotProtected();
    userRoutes.saveUnsuccessfulRouting(location);
    return router.parseUrl("/login");
  }
  if (route.data["roles"] && !loggedUserData.hasRequiredPermission(route.data["roles"])) {
    inject(AlertService).sendBasicErrorMessage("No tiene permisos para acceder a esta zona");
    return router.parseUrl(userRoutes.getUserHome());
  }
  userRoutes.setCurrentRouteProtected();
  return true;
}

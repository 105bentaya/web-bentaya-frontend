import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, Router, UrlTree} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {UserRoutesService} from "../services/user-routes.service";
import {AlertService} from "../../../shared/services/alert-service.service";
import {LoggedUserDataService} from "../services/logged-user-data.service";
import {maintenanceEmail} from "../../../shared/constant";

export function authGuard(route: ActivatedRouteSnapshot): boolean | UrlTree {
  const authService = inject(AuthService);
  const loggedUserData = inject(LoggedUserDataService);
  const router = inject(Router);
  const userRoutes = inject(UserRoutesService);
  if (!authService.isLoggedIn()) {
    userRoutes.saveUnsuccessfulRouting(location);
    return router.parseUrl("/login");
  }
  if (route.data["roles"] && !loggedUserData.hasRequiredPermission(route.data["roles"])) {
    if (route.routeConfig?.path !== 'unauthorized') inject(AlertService).sendBasicErrorMessage(unauthorizedMessage);
    return router.parseUrl(userRoutes.getUserHome());
  }
  return true;
}

const unauthorizedMessage = "No tiene permisos para acceder a esta zona. Pruebe a volver iniciar sesión o envíe un correo a " + maintenanceEmail;

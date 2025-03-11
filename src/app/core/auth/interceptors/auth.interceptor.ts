import {inject} from "@angular/core";
import {HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse} from "@angular/common/http";
import {noop, Observable, tap} from "rxjs";
import {catchError} from "rxjs/operators";
import {AuthService} from "../services/auth.service";
import {AlertService} from "../../../shared/services/alert-service.service";
import {maintenanceEmail} from "../../../shared/constant";
import {UserRoutesService} from "../services/user-routes.service";
import {Router} from "@angular/router";

const authException = "webBentayaAuthError";
const bentayaException = "webBentayaError";
const noAuthHeader = "WEB_BENTAYA_USER_NO_LONGER_AUTHENTICATED";

export function authInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);
  const alertService = inject(AlertService);
  const userRoutes = inject(UserRoutesService);
  const router = inject(Router);
  return next(request).pipe(
    tap(response => responseAuthIsExpired(response) ? authService.logout() : noop()),
    catchError(error => {
      if (error.status === 503) {
        alertService.sendBasicErrorMessage("La página web no está disponible en este momento, vuelva a intentarlo en un rato");
      } else if (error.error?.[authException]) {
        alertService.sendBasicErrorMessage(error.error[authException]);
        authService.logout();
        if (!request.url.endsWith(AuthService.userInfoUrl)) {
          userRoutes.saveUnsuccessfulRouting(location);
          router.navigate(["login"]).then(noop);
        }
      } else if (error.error?.[bentayaException]) {
        alertService.sendBasicErrorMessage(error.error[bentayaException]);
      } else if (error.status === 403 || error.status === 401) {
        alertService.sendBasicErrorMessage("No cuenta con los permisos para realizar esta operación");
      } else {
        alertService.sendBasicErrorMessage(`Ha ocurrido un error desconocido. Vuelva a intentarlo o envíe un correo a ${maintenanceEmail}`);
      }
      throw error;
    })
  );
}

function responseAuthIsExpired(response: HttpEvent<any>) {
  return response instanceof HttpResponse && response.headers.get("Authorization") === noAuthHeader;
}

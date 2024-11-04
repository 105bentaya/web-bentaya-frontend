import {inject} from "@angular/core";
import {HttpEvent, HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {noop, Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {AlertService} from "../../../shared/services/alert-service.service";
import {maintenanceEmail} from "../../../shared/constant";

const authException = "webBentayaAuthError";
const bentayaException = "webBentayaError";

export function authInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);
  return next(request).pipe(
    catchError(error => {
      if (error.error[authException]) {
        alertService.sendBasicErrorMessage(error.error[authException]);
        authService.logout();
        router.navigate(["/home"]).then(noop); //todo cambiar por la página de login cuando exista, ya que ahora si estás en otra página te lleva al home.
      } else if (error.error[bentayaException]) {
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

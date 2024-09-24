import {inject} from "@angular/core";
import {HttpEvent, HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {AlertService} from "../../../shared/services/alert-service.service";

export function authInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);
  return next(request).pipe(
    catchError(error => {
      // console.log(error.error.bentayaMessage);
      if (error.status === 401) {
        authService.logout();
        router.navigate(["/home"]);
      }
      if (error.status === 403) {
        alertService.sendBasicErrorMessage("Error al cargar los datos de usuario. Vuelva a iniciar sesión o " +
          "inténtelo más tarde. Si el problema persiste póngase en contacto con algún scouter.");
      }
      throw error;
    })
  );
}

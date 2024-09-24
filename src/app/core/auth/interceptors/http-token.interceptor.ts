import {HttpEvent, HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {Observable} from "rxjs";
import {AuthService} from "../services/auth.service";

export function httpTokenInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);
  if (authService.isLoggedIn()) {
    return next(
      request.clone({
        setHeaders: {
          Authorization: authService.getAuthHeader()
        }
      })
    );
  } else {
    return next(request);
  }
}

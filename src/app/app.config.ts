import {ApplicationConfig} from '@angular/core';
import {InMemoryScrollingOptions, provideRouter, withInMemoryScrolling} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {ConfirmationService} from "primeng/api";
import {provideAnimations} from "@angular/platform-browser/animations";
import {httpTokenInterceptor} from "./core/auth/interceptors/http-token.interceptor";
import {authInterceptor} from "./core/auth/interceptors/auth.interceptor";

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling(scrollConfig)),
    provideHttpClient(withInterceptors([httpTokenInterceptor, authInterceptor])),
    provideAnimations(),
    ConfirmationService
  ]
  //todo: jajja no puedo más, ver si meter aqui providers está bienm generalizar todas las confirmaciones
};

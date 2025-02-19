import {ApplicationConfig, inject, provideAppInitializer} from '@angular/core';
import {InMemoryScrollingOptions, provideRouter, withInMemoryScrolling} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {ConfirmationService} from "primeng/api";
import {provideAnimations} from "@angular/platform-browser/animations";
import {httpTokenInterceptor} from "./core/auth/interceptors/http-token.interceptor";
import {authInterceptor} from "./core/auth/interceptors/auth.interceptor";
import {AuthService} from "./core/auth/services/auth.service";

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling(scrollConfig)),
    provideHttpClient(withInterceptors([httpTokenInterceptor, authInterceptor])),
    provideAnimations(),
    provideAppInitializer(initializeApp),
    ConfirmationService
  ]
};

export function initializeApp() {
  const authService = inject(AuthService);
    if (authService.isLoggedIn()) {
      return new Promise<void>((resolve) => {
        authService.loadUserInfo().subscribe({
          next: () => resolve(),
          error: () => resolve(),
        });
      });
    } else {
      return Promise.resolve();
    }
}

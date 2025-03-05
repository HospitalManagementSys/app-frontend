import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { initializeFirebase } from './firebase-config';

export function initializeAuth(authService: AuthService): () => Promise<void> {
  return () => authService.loadAuthState();
}
export function initializeAppFirebase(): () => Promise<void> {
  return () => initializeFirebase();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFirebase, // Inițializează Firebase
      multi: true,
    },
  ],
};

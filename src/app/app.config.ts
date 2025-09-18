import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ConfigService } from './shared/services/config.service';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { ToastTailwindComponent } from './shared/services/toast-tailwind.component';

export function initializeApp(configService: ConfigService): () => Promise<void> {
  return () => configService.loadConfig().then(() => Promise.resolve());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideAnimations(), // Required for Toastr
    
    provideAnimations(),
    provideToastr({
      toastComponent: ToastTailwindComponent, // use custom
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      toastClass: 'toast' // IMPORTANT: remove default 'toast' class styling
    }),
    
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true,
    }
  ],
};

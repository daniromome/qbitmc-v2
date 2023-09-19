import { authConfig } from './auth.config'
import { DecimalPipe } from '@angular/common'
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import { RouteReuseStrategy, provideRouter } from '@angular/router'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { routes } from './app.routes'
import { provideEffects } from '@ngrx/effects'
import { provideState, provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { AppEffects, appFeature } from '@store/app'
import { AuthInterceptor, provideAuth } from 'angular-auth-oidc-client'

export const appConfig: ApplicationConfig = {
  providers: [
    provideState(appFeature),
    provideStore(),
    provideEffects(AppEffects),
    provideStoreDevtools(),
    importProvidersFrom(IonicModule.forRoot()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DecimalPipe,
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideAuth(authConfig)
  ]
}

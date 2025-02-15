import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { ApplicationConfig } from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router'
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone'
import { routes } from './app.routes'
import { provideEffects } from '@ngrx/effects'
import { provideState, provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { appEffects, appFeature } from '@store/app'
import { provideRouterStore, routerReducer } from '@ngrx/router-store'
import { provideLottieOptions } from 'ngx-lottie'

export const appConfig: ApplicationConfig = {
  providers: [
    provideState(appFeature),
    provideStore({ router: routerReducer }),
    provideEffects(appEffects),
    provideStoreDevtools({ connectInZone: true }),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes, withComponentInputBinding()),
    provideRouterStore(),
    provideLottieOptions({
      player: () => import('lottie-web')
    })
  ]
}

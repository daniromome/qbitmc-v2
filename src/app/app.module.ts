import { logout } from './store/app/app.meta-reducers'
import { NgModule, isDevMode } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { EffectsModule } from '@ngrx/effects'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { RouteReuseStrategy } from '@angular/router'
import { AppStoreModule } from '@store/app'
import { DecimalPipe } from '@angular/common'
import { AuthInterceptor, AuthModule } from 'angular-auth-oidc-client'
import { environment } from 'src/environments/environment'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    StoreModule.forRoot({}, { metaReducers: [logout] }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forRoot([]),
    AppStoreModule,
    AuthModule.forRoot({
      config: {
        authority: environment.KEYCLOAK_URL,
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'qbitmc',
        scope: 'openid profile',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        renewTimeBeforeTokenExpiresInSeconds: 30,
        ignoreNonceAfterRefresh: true,
        secureRoutes: [
          `${environment.API_URL}/profile`,
          `${environment.API_URL}/stripe`,
          `${environment.API_URL}/enrollment`
        ],
        maxIdTokenIatOffsetAllowedInSeconds: 300
      }
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

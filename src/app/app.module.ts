import { logout } from './store/app/app.meta-reducers'
import { NgModule, isDevMode } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

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
import { AuthConfigModule } from './auth/auth-config.module'
import { AuthInterceptor } from 'angular-auth-oidc-client'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    StoreModule.forRoot({}, { metaReducers: [logout] }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forRoot([]),
    AppStoreModule,
    AuthConfigModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

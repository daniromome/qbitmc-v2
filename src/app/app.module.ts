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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AuthInterceptor } from '@services/auth/auth.interceptor'

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
    AppStoreModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

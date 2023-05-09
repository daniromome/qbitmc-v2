import { NgModule } from '@angular/core'
import { AuthModule } from 'angular-auth-oidc-client'
import { environment } from 'src/environments/environment'

@NgModule({
  imports: [AuthModule.forRoot({
    config: {
      authority: 'https://keycloak.daniromo.me/realms/qbitmc',
      redirectUrl: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
      clientId: 'qbitmc',
      scope: 'openid profile',
      responseType: 'code',
      silentRenew: true,
      useRefreshToken: true,
      renewTimeBeforeTokenExpiresInSeconds: 30,
      ignoreNonceAfterRefresh: true,
      secureRoutes: [environment.API_URL]
    }
  })],
  exports: [AuthModule]
})
export class AuthConfigModule { }

import { PassedInitialConfig } from 'angular-auth-oidc-client'
import { environment } from 'src/environments/environment'

export const authConfig: PassedInitialConfig = {
  config: {
    authority: environment.KEYCLOAK_URL,
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: environment.KEYCLOAK_CLIENT_ID,
    scope: 'openid profile', // 'openid profile ' + your scopes
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 30,
    ignoreNonceAfterRefresh: true,
    silentRenewUrl: window.location.origin + '/silent-renew.html',
    secureRoutes: [
      `${environment.API_URL}/profile`,
      `${environment.API_URL}/stripe`,
      `${environment.API_URL}/enrollment`,
      `${environment.API_URL}/server`,
      `${environment.API_URL}/media`
    ],
    maxIdTokenIatOffsetAllowedInSeconds: 30,
    autoUserInfo: false
  }
}

import { Injectable, inject } from '@angular/core'
import { DiscordProfile, KeycloakToken, Profile } from '@models/profile'
import { Observable, filter, first, interval, map, switchMap, timer } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Store } from '@ngrx/store'
import { selectToken } from '@store/app/app.selectors'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { AppActions } from '@store/app'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly store = inject(Store)

  public constructor() {
    this.store.select(selectToken).pipe(
      filter(token => !!token),
      first(),
      switchMap(token => timer(0, (token!.expires_in * 1000) - 1000).pipe(
        switchMap(() => this.refreshToken(token!.refresh_token))
      )),
      takeUntilDestroyed()
    ).subscribe(token => this.store.dispatch(AppActions.refreshAccessToken({ token })))
  }

  public getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.API_URL}/profile`)
  }

  public async linkMcAccount(accessToken: string): Promise<void> {
    const { session_state: state, azp: clientId } = JSON.parse(decodeURIComponent(window.atob(accessToken.split('.')[1])))
    const nonce = crypto.randomUUID()
    const encoder = new TextEncoder()
    const digest = await crypto.subtle.digest('SHA-256', encoder.encode(nonce + state + clientId + 'azure').buffer)
    const hash = window.btoa(String.fromCharCode(...new Uint8Array(digest)))
    const params = new URLSearchParams()
    params.append('nonce', nonce)
    params.append('hash', hash)
    params.append('client_id', clientId)
    params.append('redirect_uri', environment.SITE_URL)
    window.location.href = `${environment.KEYCLOAK_URL}/broker/azure/link?${params.toString()}`
  }

  public updateProfile(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${environment.API_URL}/profile`, profile)
  }

  public discordSignIn(): void {
    const params = new URLSearchParams()
    params.set('client_id', environment.DISCORD_CLIENT_ID)
    params.set('redirect_uri', window.location.origin)
    params.set('response_type', 'token')
    params.set('scope', 'identify email guilds.join')
    window.open(`${environment.DISCORD_URL}/oauth2/authorize?${params.toString()}`, '__self');
  }

  public getDiscordProfile(tokenType: string, token: string): Observable<DiscordProfile> {
    const url = `${environment.DISCORD_URL}/oauth2/@me`
    return this.http.get<{ user: DiscordProfile }>(url, { headers: { Authorization: `${tokenType} ${token}`}}).pipe(
      map(result => result.user)
    )
  }

  public exchangeToken(token: string, profile: DiscordProfile): Observable<KeycloakToken> {
    const url = `${environment.KEYCLOAK_URL}/protocol/openid-connect/token`
    const params = new URLSearchParams()
    params.set('client_id', environment.KEYCLOAK_CLIENT_ID)
    params.set('grant_type', 'urn:ietf:params:oauth:grant-type:token-exchange')
    params.set('subject_token', token)
    params.set('subject_issuer', 'discord')
    params.set('subject_token_type', 'urn:ietf:params:oauth:token-type:access_token')
    if (profile) params.set('user_profile', JSON.stringify(profile))
    return this.http.post<KeycloakToken>(url, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
  }

  public refreshToken(token: string): Observable<KeycloakToken> {
    const url = `${environment.KEYCLOAK_URL}/protocol/openid-connect/token`
    const params = new URLSearchParams()
    params.set('client_id', environment.KEYCLOAK_CLIENT_ID)
    params.set('grant_type', 'refresh_token')
    params.set('refresh_token', token)
    return this.http.post<KeycloakToken>(url, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
  }

  public logout(token: string): Observable<void> {
    const url = `${environment.KEYCLOAK_URL}/protocol/openid-connect/logout`
    const params = new URLSearchParams()
    params.set('client_id', environment.KEYCLOAK_CLIENT_ID)
    params.set('refresh_token', token)
    return this.http.post<void>(url, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
  }
}

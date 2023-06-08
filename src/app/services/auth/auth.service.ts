import { Injectable } from '@angular/core'
import { Profile } from '@models/profile'
import { Observable, from, map } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public constructor(
    private readonly http: HttpClient
  ) {}

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
    params.append('redirect_uri', 'http://localhost:4200')
    window.location.href = `https://keycloak.daniromo.me/realms/qbitmc/broker/azure/link?${params.toString()}`
  }
}

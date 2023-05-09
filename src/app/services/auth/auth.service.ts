import { Injectable } from '@angular/core'
import { Profile } from '@models/profile'
import { AuthChangeEvent, AuthError, Session, Subscription, User as SupabaseUser } from '@supabase/supabase-js'
import { Observable, from, map } from 'rxjs'
import { SupabaseService } from '@services/supabase'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public constructor(
    private readonly supabase: SupabaseService,
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  public signIn(): void {
    //
  }

  public signOut(): Observable<{ error: AuthError | null }> {
    return from(this.supabase.client.auth.signOut())
  }

  public changes(callback: (event: AuthChangeEvent, session: Session | null) => void): { data: { subscription: Subscription } } {
    return this.supabase.client.auth.onAuthStateChange(callback)
  }

  // public getUser(user: SupabaseUser): Observable<User> {
  //   return from(this.supabase.client.from('users').select('*').eq('id', user.id).single()).pipe(
  //     map(response => {
  //       if (response.error) throw response.error
  //       return response.data
  //     })
  //   )
  // }

  public getSession(): Observable<Session | null> {
    return from(this.supabase.client.auth.getSession()).pipe(
      map(response => {
        if (response.error) throw response.error
        return response.data.session
      })
    )
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
    params.append('redirect_uri', 'http://localhost:4200')
    console.log(`https://keycloak.daniromo.me/realms/qbitmc/broker/azure/link?${params.toString()}`)
  }
}

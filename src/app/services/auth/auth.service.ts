import { Injectable } from '@angular/core'
import { Profile } from '@models/profile'
import { AuthChangeEvent, AuthError, OAuthResponse, Session, Subscription, User } from '@supabase/supabase-js'
import { Observable, from, map } from 'rxjs'
import { SupabaseService } from '@services/supabase'
import { PreferencesService } from '@services/preferences'
import { switchMap } from 'rxjs/operators'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public constructor(
    private readonly supabase: SupabaseService,
    private readonly preferences: PreferencesService,
    private readonly router: Router
  ) {}

  public signIn(): Observable<OAuthResponse> {
    const url = this.router.url.split('/')
    url.pop()
    return this.preferences.set('redirected', url.join('/')).pipe(
      switchMap(() => from(this.supabase.client.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          scopes: 'guilds.join'
        }
      })))
    )
  }

  public signOut(): Observable<{ error: AuthError | null }> {
    return from(this.supabase.client.auth.signOut())
  }

  public changes(callback: (event: AuthChangeEvent, session: Session | null) => void): { data: { subscription: Subscription } } {
    return this.supabase.client.auth.onAuthStateChange(callback)
  }

  public getProfile(user: User): Observable<Profile> {
    return from(this.supabase.client.from('users').select('*').eq('id', user.id).single()).pipe(
      map(response => {
        if (response.error) throw response.error
        return response.data
      })
    )
  }

  public getSession(): Observable<Session | null> {
    return from(this.supabase.client.auth.getSession()).pipe(
      map(response => {
        if (response.error) throw response.error
        return response.data.session
      })
    )
  }
}

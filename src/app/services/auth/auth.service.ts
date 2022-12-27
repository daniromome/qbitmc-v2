import { Injectable } from '@angular/core'
import { Profile } from '@models/profile'
import { AuthChangeEvent, AuthError, OAuthResponse, Session, Subscription, User } from '@supabase/supabase-js'
import { Observable, from, map } from 'rxjs'
import { SupabaseService } from '@services/supabase'
import { PreferencesService } from '@services/preferences'
import { switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public constructor(
    private readonly supabase: SupabaseService,
    private readonly preferences: PreferencesService
  ) {}

  public signIn(): Observable<OAuthResponse> {
    return this.preferences.set('redirected', 'true').pipe(
      switchMap(() => from(this.supabase.client.auth.signInWithOAuth({
        provider: 'discord'
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

import { Injectable, inject } from '@angular/core'
import { Profile } from '@models/profile'
import { Observable, from, map, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { AppwriteService } from '@services/appwrite'
import { Models, OAuthProvider } from 'appwrite'
import { User } from '@models/user'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly appwrite = inject(AppwriteService)

  public getSession(): Observable<Models.Session> {
    return from(this.appwrite.account.getSession('current'))
  }

  public authenticate(): Observable<void | URL> {
    return of(
      this.appwrite.account.createOAuth2Session(OAuthProvider.Discord, environment.SITE_URL, environment.SITE_URL, [
        'guilds.join'
      ])
    )
  }

  public getUser(): Observable<User> {
    return from(this.appwrite.account.get()) as Observable<User>
  }

  public getProfile(id: string): Observable<Profile> {
    return from(
      this.appwrite.databases.getDocument<Profile>(
        environment.APPWRITE_DATABASE,
        environment.APPWRITE_COLLECTION_PROFILE,
        id,
        []
      )
    )
  }

  public createProfile(accessToken: string): Observable<Profile> {
    return from(
      this.appwrite.functions.createExecution(environment.APPWRITE_FUNCTION_REGISTRATION, JSON.stringify({ accessToken }))
    ).pipe(map(execution => JSON.parse(execution.responseBody) as Profile))
  }

  public linkMcAccount(): Observable<void | URL> {
    return of(
      this.appwrite.account.createOAuth2Token(OAuthProvider.Microsoft, environment.SITE_URL, environment.SITE_URL, [
        'XboxLive.signin'
      ])
    )
  }

  public updateProfile(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${environment.API_URL}/profile`, profile)
  }
}

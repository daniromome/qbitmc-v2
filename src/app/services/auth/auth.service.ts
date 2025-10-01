import { Injectable, inject } from '@angular/core'
import { Preferences, Profile, PlayerDocument } from '@qbitmc/common'
import { Observable, from, map } from 'rxjs'
import { environment } from 'src/environments/environment'
import { AppwriteService } from '@services/appwrite'
import { Models, OAuthProvider } from 'appwrite'
import { User } from '@models/user'
import { ExecutionResponse } from '@models/execution'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly appwrite = inject(AppwriteService)

  public getSession(): Observable<Models.Session> {
    return from(this.appwrite.account.getSession('current'))
  }

  public authenticate(): Observable<void | string> {
    return from(
      this.appwrite.account.createOAuth2Session(OAuthProvider.Discord, window.location.href, window.location.href, [
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

  public minecraftAccountVerification(code: number): Observable<PlayerDocument> {
    return from(
      this.appwrite.functions.createExecution(environment.APPWRITE_FUNCTION_VERIFICATION_LINK, JSON.stringify({ code }))
    ).pipe(map(execution => (JSON.parse(execution.responseBody) as ExecutionResponse<PlayerDocument>).value))
  }

  public updatePreferences(prefs: Preferences): Observable<User> {
    return from(this.appwrite.account.updatePrefs(prefs)) as Observable<User>
  }

  public logout(): Observable<unknown> {
    return from(this.appwrite.account.deleteSession('current'))
  }
}

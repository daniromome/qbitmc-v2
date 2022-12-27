import { Injectable } from '@angular/core'
import { Preferences } from '@capacitor/preferences'
import { Observable, from, map } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  public constructor() { }

  public set(key: string, value: string): Observable<void> {
    return from(Preferences.set({ key, value }))
  }

  public get(key: string): Observable<string> {
    return from(Preferences.get({ key })).pipe(
      map(preference => preference.value || '')
    )
  }

  public delete(key: string): Observable<void> {
    return from(Preferences.remove({ key }))
  }
}

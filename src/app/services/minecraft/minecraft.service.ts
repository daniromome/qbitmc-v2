import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

interface MinecraftProfile {
  id: string,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class MinecraftService {
  public constructor(
    private readonly http: HttpClient
  ) { }

  public getUUID(username: string): Observable<MinecraftProfile> {
    return this.http.get<MinecraftProfile>(`https://api.mojang.com/users/profiles/minecraft/${username}`)
  }

  public getAvatar(uuid: string, type: 'avatar' | 'head' | 'body' = 'avatar'): string {
    const segments = type === 'avatar' ? ['avatars'] : ['renders', type]
    return `https://crafatar.com/${segments.join('/')}/${uuid}?overlay=true`
  }
}

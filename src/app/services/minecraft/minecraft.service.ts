import { HttpClient, HttpParams } from '@angular/common/http'
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

  public getAvatarUrl(uuid: string): Observable<Blob> {
    const params = new HttpParams({
      fromObject: {
        overlay: true
      }
    })
    return this.http.get(`https://crafatar.com/avatars/${uuid}`, { responseType: 'blob', params })
  }
}

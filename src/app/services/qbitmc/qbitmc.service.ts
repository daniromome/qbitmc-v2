import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Observable, map, from } from 'rxjs'
import { Leaderboards } from '@models/leaderboards'
import { MinecraftProfile } from '@models/minecraft-profile'

@Injectable({
  providedIn: 'root'
})
export class QbitmcService {
  public constructor(
    private readonly http: HttpClient,
  ) { }

  public leaderboards(): Observable<Leaderboards> {
    const url = new URL(`${environment.API_URL}/stats/leaderboards`)
    return this.http.get<Leaderboards>(url.toString())
  }

  public supporters(): Observable<MinecraftProfile[]> {
    const url = new URL(`${environment.API_URL}/supporters`)
    return this.http.get<MinecraftProfile[]>(url.toString())
  }
}

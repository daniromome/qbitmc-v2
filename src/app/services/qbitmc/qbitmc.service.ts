import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Observable, map } from 'rxjs'
import { Leaderboards } from '@models/leaderboards'
import { MinecraftProfile } from '@models/minecraft-profile'
import { PterodactylServer } from '@models/pterodactyl'
import { Server } from '@models/server'

@Injectable({
  providedIn: 'root'
})
export class QbitmcService {
  public constructor(
    private readonly http: HttpClient
  ) { }

  public leaderboards(): Observable<Leaderboards> {
    const url = new URL(`${environment.API_URL}/stats/leaderboards`)
    return this.http.get<Leaderboards>(url.toString())
  }

  public supporters(): Observable<MinecraftProfile[]> {
    const url = new URL(`${environment.API_URL}/supporters`)
    return this.http.get<MinecraftProfile[]>(url.toString())
  }

  public servers(): Observable<Server[]> {
    const url = new URL(`${environment.API_URL}/pterodactyl`)
    return this.http.get<PterodactylServer[]>(url.toString()).pipe(
      map(response => response.map(server => {
        const { id, name, description, status } = server
        const { ip, game, version, staff_only: staffOnly } = JSON.parse(description)
        return { id, name, status, ip, game, version, staffOnly }
      }))
    )
  }
}

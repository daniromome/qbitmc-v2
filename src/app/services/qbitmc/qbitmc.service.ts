import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Observable, map, from } from 'rxjs'
import { Leaderboards } from '@models/leaderboards'

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

  // public supporters(): Observable<MinecraftProfile[]> {
  //   return from(this.supabase.client
  //     .from('supporters')
  //     .select('*')
  //   ).pipe(
  //     map(response => {
  //       if (response.error) throw response.error
  //       else return response.data.map(d => ({ ...d, avatar: this.mc.getAvatar(d.id) }))
  //     })
  //   )
  // }
}

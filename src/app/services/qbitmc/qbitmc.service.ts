import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Observable, map, from } from 'rxjs'
import { Leaderboards } from '@models/leaderboards'
import { SupabaseService } from '@services/supabase'
import { mergeMap } from 'rxjs/operators'
import { MinecraftService } from '@services/minecraft'
import { PlayerStatistics } from '@models/player-statistics'

@Injectable({
  providedIn: 'root'
})
export class QbitmcService {
  public constructor(
    private readonly http: HttpClient,
    private readonly supabase: SupabaseService,
    private readonly mc: MinecraftService
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

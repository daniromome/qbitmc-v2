import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Observable, map, from } from 'rxjs'
import { Leaderboards, LeaderboardRecord } from '@models/leaderboards'
import { SupabaseService } from '@services/supabase'
import { mergeMap } from 'rxjs/operators'
import { MinecraftService } from '@services/minecraft'
import { MinecraftProfile } from '@models/minecraft-profile'

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
    return this.http.get<{ [k: string]: LeaderboardRecord[] }>(`${environment.STATS_URL}/leaderboards`).pipe(
      mergeMap(records =>
        from(this.supabase.client
          .from('minecraft_profiles')
          .select('*')
          .in('id', Object.values(records).flatMap(record => record.map(r => r.id)))
        ).pipe(map(response => {
          if (!response.data || response.error) throw response.error ||
            new Error($localize`An error occurred retrieving the leaderboard profiles`)
          else {
            const profiles: { [k: string]: string } = {}
            const data = response.data as { id: string, name: string }[]
            data.forEach(d => { profiles[d.id] = d.name })
            return profiles
          }
        })).pipe(map(profiles => {
          const recordsCopy = { ...records }
          Object.entries(recordsCopy).forEach(([key, record]) => {
            recordsCopy[key] = record.map(r => ({ ...r, name: profiles[r.id], avatar: this.mc.getAvatar(r.id) }))
          })
          return recordsCopy as unknown as Leaderboards
        }))
      )
    )
  }

  public supporters(): Observable<MinecraftProfile[]> {
    return from(this.supabase.client
      .from('supporters')
      .select('*')
    ).pipe(
      map(response => {
        if (response.error) throw response.error
        else return response.data.map(d => ({ ...d, avatar: this.mc.getAvatar(d.id) }))
      })
    )
  }
}

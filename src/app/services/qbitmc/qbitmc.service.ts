import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Observable, of } from 'rxjs'
import { Leaderboards } from '@models/leaderboards'
import { PlayerDocument } from '@qbitmc/common'

@Injectable({
  providedIn: 'root'
})
export class QbitmcService {
  private readonly http = inject(HttpClient)

  public leaderboards(): Observable<Leaderboards> {
    const url = new URL(`${environment.API_URL}/stats/leaderboards`)
    return this.http.get<Leaderboards>(url.toString())
  }

  public supporters(): Observable<PlayerDocument[]> {
    // const url = new URL(`${environment.API_URL}/supporters`)
    return of([
      {
        $id: '77655fb2-82e7-493f-839c-22870f3fcec9',
        ign: '_Dani'
      } as PlayerDocument
    ])
    // return of(Array.from(Array(6)).map(() => ({ id: '77655fb2-82e7-493f-839c-22870f3fcec9', name: '_Dani' })))
    // return this.http.get<MinecraftProfile[]>(url.toString())
  }
}

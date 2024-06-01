import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Server } from '@models/server'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly http = inject(HttpClient)

  public list(unregistered: boolean = false): Observable<Server[]> {
    const url = new URL(`${environment.API_URL}/server`)
    url.searchParams.append('unregistered', unregistered.toString())
    return this.http.get<Server[]>(url.toString())
  }

  public upsert(server: Server): Observable<Server> {
    return this.http.post<Server>(`${environment.API_URL}/server`, server)
  }
}

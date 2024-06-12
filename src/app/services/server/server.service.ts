import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Server, ServerDocument } from '@qbitmc/common'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly http = inject(HttpClient)

  public list(unregistered: boolean = false): Observable<ServerDocument[]> {
    const url = new URL(`${environment.API_URL}/server`)
    url.searchParams.append('unregistered', unregistered.toString())
    return this.http.get<ServerDocument[]>(url.toString())
  }

  public upsert(server: Server): Observable<ServerDocument> {
    return this.http.post<ServerDocument>(`${environment.API_URL}/server`, server)
  }
}

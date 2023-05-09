import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Application } from '@models/application'
import { SupabaseService } from '@services/supabase'
import { from, Observable, map } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private readonly url: URL

  public constructor(
    private readonly http: HttpClient,
    private readonly supabase: SupabaseService
  ) {
    this.url = new URL(`${environment.API_URL}/enrollment`)
  }

  public submit(application: Application): Observable<Required<Application>> {
    return from(this.supabase.client.from('applications').insert(application).select().single()).pipe(
      map(({ data, error }) => {
        if (error) throw error
        if (!data) throw new Error('Not Found')
        return data as Required<Application>
      })
    )
  }

  public uploadMedia(files: File[]): Observable<unknown> {
    const url = `${this.url.toString()}/media`
    const form = new FormData()
    files.forEach(f => {
      form.append('media', f, f.name)
    })
    return this.http.post(url, form)
  }
}

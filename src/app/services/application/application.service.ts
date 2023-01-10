import { Injectable } from '@angular/core'
import { Application } from '@models/application'
import { SupabaseService } from '@services/supabase'
import { from, Observable, map } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  public constructor(
    private readonly supabase: SupabaseService
  ) { }

  public submit(application: Application): Observable<Required<Application>> {
    return from(this.supabase.client.from('applications').insert(application).select().single()).pipe(
      map(({ data, error }) => {
        if (error) throw error
        if (!data) throw new Error('Not Found')
        return data as Required<Application>
      })
    )
  }
}

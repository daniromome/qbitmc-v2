import { Injectable } from '@angular/core'
import { Application } from '@models/application'
import { SupabaseService } from '@services/supabase'
import { PostgrestResponse } from '@supabase/supabase-js'
import { from, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  public constructor(
    private readonly supabase: SupabaseService
  ) { }

  public submit(application: Application): Observable<PostgrestResponse<undefined>> {
    return from(this.supabase.client.from('applications').insert(application))
  }
}

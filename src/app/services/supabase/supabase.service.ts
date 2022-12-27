import { Injectable } from '@angular/core'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from 'src/app/common/types/supabase'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public readonly client: SupabaseClient

  public constructor() {
    this.client = createClient<Database>(environment.SUPABASE_URL, environment.SUPABASE_KEY)
  }
}

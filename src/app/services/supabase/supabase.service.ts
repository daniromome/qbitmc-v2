import { Injectable } from '@angular/core'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from 'src/app/common/types/supabase'
import { environment } from 'src/environments/environment'
import { from } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public readonly client: SupabaseClient

  public constructor() {
    this.client = createClient<Database>(environment.SUPABASE_URL, environment.SUPABASE_KEY)
  }

  public get storage(): typeof this.client.storage {
    return this.client.storage
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public joinGuild(token: string) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return from(this.client.functions.invoke('join-guild', { body: { token } }))
  }
}

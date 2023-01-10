import { Injectable } from '@angular/core'
import { Observable, map } from 'rxjs'
import { SupabaseService } from '@services/supabase'

interface MinecraftProfile {
  id: string,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class MinecraftService {
  public constructor(
    private readonly supabase: SupabaseService
  ) { }

  public getUUID(username: string): Observable<MinecraftProfile> {
    return this.supabase.mc(username).pipe(
      map(({ data }) => data)
    )
  }

  public getAvatar(uuid: string, type: 'avatar' | 'head' | 'body' = 'avatar'): string {
    const segments = type === 'avatar' ? ['avatars'] : ['renders', type]
    return `https://crafatar.com/${segments.join('/')}/${uuid}?overlay=true`
  }
}

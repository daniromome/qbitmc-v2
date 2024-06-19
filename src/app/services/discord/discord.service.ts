import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DiscordService {
  private readonly url = 'https://discord.com'

  public getChannelURL(channel: string): string {
    return `${this.url}/channels/${environment.DISCORD_GUILD_ID}/${channel}`
  }
}

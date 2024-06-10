import { Injectable, inject } from '@angular/core'
import { Clipboard } from '@angular/cdk/clipboard'
import { ToastController } from '@ionic/angular/standalone'
@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  private clipboard = inject(Clipboard)
  private toast = inject(ToastController)

  public async copyToClipboard(text: string): Promise<void> {
    const result = await this.clipboard.copy(text)
    const message = `${result ? 'Successfully copied' : "Couldn't copy"} to clipboard`
    const t = await this.toast.create({ message, icon: 'copy-outline', buttons: ['dismiss'], duration: 1500 })
    await t.present()
  }
}

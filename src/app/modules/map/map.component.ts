import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { environment } from '../../../environments/environment'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'

@Component({
  selector: 'qbit-map',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  public map: SafeUrl
  private first: boolean

  public constructor(
    private readonly sanitizer: DomSanitizer
  ) {
    this.map = this.sanitizer.bypassSecurityTrustResourceUrl(environment.MAP_URL)
    this.first = true
  }

  public ionViewWillLeave(): void {
    const container = document.getElementById('container')
    if (!container || !container.firstChild) return
    container.removeChild(container.firstChild)
    this.first = false
  }

  public ionViewWillEnter(): void {
    if (this.first) return
    const container = document.getElementById('container')
    const frame = document.getElementById('frame')
    if (frame || !container) return
    const iframe = document.createElement('iframe')
    iframe.setAttribute('src', environment.MAP_URL)
    iframe.setAttribute('frameBorder', '0')
    iframe.setAttribute('load', 'lazy')
    container.appendChild(iframe)
  }
}

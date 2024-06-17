import { Component, ElementRef, Renderer2, computed, effect, inject, viewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser'
import { IonContent } from '@ionic/angular/standalone'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'
import { selectRouteParam } from '@store/router'

@Component({
  selector: 'qbit-map',
  standalone: true,
  imports: [IonContent, CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  private readonly sanitizer = inject(DomSanitizer)
  private readonly store = inject(Store)
  private readonly renderer = inject(Renderer2)

  private readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container')

  private readonly id = this.store.selectSignal(selectRouteParam('id'))
  private readonly server = computed(() => {
    const id = this.id()
    if (!id) return undefined
    return this.store.selectSignal(appFeature.selectServer(id))()
  })
  private readonly url = computed(() => {
    const url = this.server()?.metadata.find(({ key }) => key === 'map')?.value
    return url
  })

  public constructor() {
    effect(() => {
      const url = this.url()
      if (!url) return
      this.sanitizer.bypassSecurityTrustUrl(url)
    })
  }

  public ionViewWillLeave(): void {
    const container = this.container()
    if (container.nativeElement.firstChild === null) return
    this.renderer.removeChild(container.nativeElement, container.nativeElement.firstChild)
  }

  public ionViewWillEnter(): void {
    const container = this.container()
    const url = this.url()
    if (!url) return
    const iframe = this.renderer.createElement('iframe')
    this.renderer.setAttribute(iframe, 'src', url)
    this.renderer.setAttribute(iframe, 'frameBorder', '0')
    this.renderer.setAttribute(iframe, 'load', 'lazy')
    this.renderer.appendChild(container, iframe)
  }
}

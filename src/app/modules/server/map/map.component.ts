import { Component, ElementRef, OnInit, Renderer2, computed, effect, inject, viewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser'
import { IonContent, IonFab, IonFabButton, IonIcon, NavController } from '@ionic/angular/standalone'
import { Store } from '@ngrx/store'
import { selectRouteParam } from '@store/router'
import { arrowBack } from 'ionicons/icons'
import { addIcons } from 'ionicons'
import { serverFeature } from '@store/server'
import { ServerService } from '@services/server'

@Component({
  selector: 'qbit-map',
  standalone: true,
  imports: [IonIcon, IonFabButton, IonFab, IonContent, CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private readonly sanitizer = inject(DomSanitizer)
  private readonly store = inject(Store)
  private readonly renderer = inject(Renderer2)
  private readonly serverService = inject(ServerService)
  public readonly nav = inject(NavController)

  private readonly container = viewChild.required<ElementRef<HTMLDivElement>>('container')

  private readonly id = this.store.selectSignal(selectRouteParam('id'))
  private readonly server = computed(() => {
    const id = this.id()
    if (!id) return undefined
    return this.store.selectSignal(serverFeature.selectServer(id))()
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
      const container = this.container()
      const iframe = this.renderer.createElement('iframe')
      this.renderer.setAttribute(iframe, 'src', url)
      this.renderer.setAttribute(iframe, 'frameBorder', '0')
      this.renderer.setAttribute(iframe, 'load', 'lazy')
      this.renderer.appendChild(container.nativeElement, iframe)
    })
    addIcons({ arrowBack })
  }

  public ngOnInit(): void {
    this.serverService.init()
  }

  public ionViewWillLeave(): void {
    const container = this.container()
    if (container.nativeElement.firstChild === null) return
    this.renderer.removeChild(container.nativeElement, container.nativeElement.firstChild)
  }
}

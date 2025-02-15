import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, Signal } from '@angular/core'
import { ServerTileComponent } from '@components/server'
import { Media } from '@models/media'
import { Store } from '@ngrx/store'
import { ServerDocument } from '@qbitmc/common/_dist/mod'
import { LocaleService } from '@services/locale'
import { mediaFeature } from '@store/media'
import { translationFeature } from '@store/translation'
import { IonContent, IonRouterOutlet, ScrollCustomEvent } from '@ionic/angular/standalone'
import { selectUrl } from '@store/router'
import { serverFeature } from '@store/server'
import { Title, Meta } from '@angular/platform-browser'
import { AnimationOptions, LottieComponent } from 'ngx-lottie'
import { ViewPortService } from '@services/view-port'
import { CommonModule } from '@angular/common'
import { ServerService } from '@services/server'

@Component({
  standalone: true,
  imports: [IonRouterOutlet, IonContent, ServerTileComponent, LottieComponent, CommonModule],
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerComponent implements OnInit {
  private readonly store = inject(Store)
  private readonly locale = inject(LocaleService)
  private readonly title = inject(Title)
  private readonly meta = inject(Meta)
  private readonly height = inject(ViewPortService).height
  private readonly server = inject(ServerService)
  private readonly scrollPosition = signal<number>(0)
  public readonly currentServer = computed(() => this.scrollPosition() / this.height())
  private readonly darkMode = signal<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches)

  public readonly url = this.store.selectSignal(selectUrl)

  public readonly serversWithTranslations = computed(() => {
    const servers = this.store.selectSignal(serverFeature.selectServers)()
    if (servers.length === 0) return []
    return servers.map(server => {
      const translation = this.store.selectSignal(
        translationFeature.selectTranslationByEntityId(server.$id, this.locale.locale)
      )()
      return {
        ...server,
        name: translation['name'] || server.name,
        description: translation['description'] || server.description
      }
    })
  })

  public readonly scrollDownOptions: Signal<AnimationOptions> = computed(() => {
    const mode = this.darkMode() ? 'dark' : 'light'
    return {
      path: `/assets/scrolldown-${mode}.json`,
      loop: true
    }
  })

  public ngOnInit(): void {
    this.server.init()
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => this.darkMode.set(event.matches))
    this.title.setTitle($localize`:@@site-title-servers:Servers - QbitMC`)
    this.meta.addTag({
      name: 'description',
      content: $localize`:@@site-description-servers:Here you'll find a list of the servers that we currently host for our community`
    })
    this.meta.addTag({
      name: 'keywords',
      content: $localize`:@@site-keywords-server:Minecraft Servers, Community Servers, SMPs`
    })
    this.meta.addTag({
      name: 'og:title',
      content: 'Servers - QbitMC'
    })
    this.meta.addTag({
      name: 'og:description',
      content: $localize`:@@site-description-servers:Here you'll find a list of the servers that we currently host for our community`
    })
    this.meta.addTag({
      name: 'og:image',
      content: 'assets/logo.svg'
    })
  }

  public serverMedia(server: ServerDocument): Signal<Media[]> {
    return this.store.selectSignal(mediaFeature.selectMedia(server.media))
  }

  public onScroll(ev: Event): void {
    const event = ev as ScrollCustomEvent
    this.scrollPosition.set(event.detail.currentY)
  }
}

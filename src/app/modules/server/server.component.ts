import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal } from '@angular/core'
import { ServerTileComponent } from '@components/server'
import { Media } from '@models/media'
import { Store } from '@ngrx/store'
import { ServerDocument } from '@qbitmc/common/_dist/mod'
import { LocaleService } from '@services/locale'
import { mediaFeature } from '@store/media'
import { translationFeature } from '@store/translation'
import { IonContent, IonSplitPane, IonRouterOutlet, IonMenu } from '@ionic/angular/standalone'
import { selectUrl } from '@store/router'
import { serverActions, serverFeature } from '@store/server'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  standalone: true,
  imports: [IonRouterOutlet, IonSplitPane, IonContent, IonMenu, ServerTileComponent],
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerComponent implements OnInit {
  private readonly store = inject(Store)
  private readonly locale = inject(LocaleService)
  private readonly title = inject(Title)
  private readonly meta = inject(Meta)
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

  public ngOnInit(): void {
    this.store.dispatch(serverActions.getServers({ includeDrafts: false }))
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
}

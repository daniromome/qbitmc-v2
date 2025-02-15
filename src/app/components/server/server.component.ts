import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Media } from '@models/media'
import { ServerDocument, USER_LABEL } from '@qbitmc/common'
import { interval, tap } from 'rxjs'
import { NavController, IonLabel } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { copyOutline, lockClosed, earth, ban, eyeOff, map } from 'ionicons/icons'
import { ClipboardService } from '@services/clipboard'
import { VISIBILITY_ICON } from '@models/visibility-icon'
import { CommonModule } from '@angular/common'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'

@Component({
  selector: 'qbit-server',
  standalone: true,
  imports: [IonLabel, CommonModule],
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerTileComponent {
  public readonly store = inject(Store)
  public readonly nav = inject(NavController)
  public readonly clipboard = inject(ClipboardService)
  public server = input.required<ServerDocument>()
  public readonly icon = computed(() => VISIBILITY_ICON[this.server().visibility])
  public media = input.required<Media[]>()
  private readonly index = signal(0)
  private readonly indexLimit = computed(() => {
    const media = this.media()
    return media.length - 1
  })
  public readonly background = computed(() => {
    const index = this.index()
    const media = this.media()
    return `url('${media.at(index)?.url}') no-repeat center center`
  })
  private readonly timer = interval(3000).pipe(
    tap(() => {
      this.index.update(i => {
        if (i >= this.indexLimit()) return 0
        return i + 1
      })
    }),
    takeUntilDestroyed()
  )
  public readonly map = computed(() => {
    const server = this.server()
    return server.metadata.find(data => data.key === 'map')?.value
  })
  public readonly isQbitor = this.store.selectSignal(appFeature.selectIsRole(USER_LABEL.QBITOR))

  public constructor() {
    addIcons({ copyOutline, lockClosed, earth, ban, eyeOff, map })
    this.timer.subscribe()
  }

  public navigateToMap(): void {
    const server = this.server()
    this.nav.navigateForward(`/tabs/server/${server.$id}/map`)
  }
}

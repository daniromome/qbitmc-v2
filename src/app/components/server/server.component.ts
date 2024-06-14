import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Media } from '@models/media'
import { ServerDocument } from '@qbitmc/common'
import { interval, tap } from 'rxjs'
import { IonChip, IonButton, IonIcon } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { copyOutline } from 'ionicons/icons'
import { ClipboardService } from '@services/clipboard'

@Component({
  selector: 'qbit-server',
  standalone: true,
  imports: [IonIcon, IonButton, IonChip],
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerComponent {
  public readonly clipboard = inject(ClipboardService)
  public server = input.required<ServerDocument>()
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

  public constructor() {
    addIcons({ copyOutline })
    this.timer.subscribe()
  }
}

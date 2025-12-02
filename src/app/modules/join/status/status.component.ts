import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'

import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'
import { AvatarPipe } from '@pipes/avatar'
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonText,
  IonItem,
  IonLabel,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonContent
} from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { logoDiscord } from 'ionicons/icons'
import { DiscordService } from '@services/discord/discord.service'
import { applicationFeature } from '@store/application'
import { ViewPortService } from '@services/view-port'

@Component({
  selector: 'qbit-status',
  standalone: true,
  imports: [
    IonContent,
    IonCol,
    IonRow,
    IonGrid,
    IonIcon,
    IonLabel,
    IonItem,
    IonText,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    AvatarPipe
  ],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent {
  private readonly store = inject(Store)
  private readonly view = inject(ViewPortService)
  public readonly discord = inject(DiscordService)
  public readonly profile = this.store.selectSignal(appFeature.selectProfile)
  public readonly player = this.store.selectSignal(appFeature.selectPlayer)
  public readonly application = this.store.selectSignal(applicationFeature.selectOwnApplication)
  public readonly background = computed(() => {
    const darkMode = this.view.darkMode()
    const url = darkMode
      ? 'https://appwrite.qbitmc.com/v1/storage/buckets/68dca88d0013bb1cffea/files/68dca8fb00318c38e6f7/preview?height=360&project=66649e96000758b8ebdb'
      : 'https://appwrite.qbitmc.com/v1/storage/buckets/68dca88d0013bb1cffea/files/68dca904000806c3ff0d/preview?height=360&project=66649e96000758b8ebdb'
    return `url(${url}) no-repeat center center`
  })

  public constructor() {
    addIcons({ logoDiscord })
  }
}

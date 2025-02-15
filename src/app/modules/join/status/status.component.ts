import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
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
    CommonModule,
    AvatarPipe
  ],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent {
  private readonly store = inject(Store)
  public readonly discord = inject(DiscordService)
  public readonly profile = this.store.selectSignal(appFeature.selectProfile)
  public readonly player = this.store.selectSignal(appFeature.selectPlayer)
  public readonly application = this.store.selectSignal(applicationFeature.selectOwnApplication)

  public constructor() {
    addIcons({ logoDiscord })
  }
}

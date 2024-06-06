import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Store } from '@ngrx/store'
import { Observable, map } from 'rxjs'
import { Profile } from '@models/profile'
import { appFeature } from '@store/app'
import { TWENTY_FOUR_HOURS } from '@constants/index'
import { AvatarPipe } from '@pipes/avatar'
import { IonCard, IonAvatar, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonText, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { logoDiscord } from 'ionicons/icons'

@Component({
  selector: 'qbit-status',
  standalone: true,
  imports: [
    IonIcon,
    IonLabel,
    IonItem,
    IonText,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonAvatar,
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
  public readonly profile = this.store.selectSignal(appFeature.selectProfile)

  public constructor() {
    addIcons({ logoDiscord })
  }
}

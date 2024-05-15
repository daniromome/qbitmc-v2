import { ChangeDetectionStrategy, Component } from '@angular/core'
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
  imports: [IonIcon, IonLabel, IonItem, IonText, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonAvatar, IonCard, CommonModule, AvatarPipe],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent {
  public readonly profile$: Observable<Profile | undefined>
  public readonly disabled$: Observable<boolean>

  public constructor(
    private readonly store: Store
  ) {
    addIcons({ logoDiscord })
    this.profile$ = this.store.select(appFeature.selectProfile)
    this.disabled$ = this.profile$.pipe(
      map(user => user?.application?.createdAt
        ? (Date.now() - new Date(user?.application.createdAt).valueOf()) < TWENTY_FOUR_HOURS
        : true
      )
    )
  }
}

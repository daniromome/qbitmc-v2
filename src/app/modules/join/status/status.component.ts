import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { Store } from '@ngrx/store'
import { Observable, map } from 'rxjs'
import { Profile } from '@models/profile'
import { appFeature } from '@store/app'
import { TWENTY_FOUR_HOURS } from '@constants/index'
import { AvatarPipe } from '@pipes/avatar'

@Component({
  selector: 'qbit-status',
  standalone: true,
  imports: [CommonModule, IonicModule, AvatarPipe],
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
    this.profile$ = this.store.select(appFeature.selectProfile)
    this.disabled$ = this.profile$.pipe(
      map(user => user?.application?.createdAt
        ? (Date.now() - new Date(user?.application.createdAt).valueOf()) < TWENTY_FOUR_HOURS
        : true
      )
    )
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { ApplicationStoreModule } from '@store/application'
import { Store } from '@ngrx/store'
import { Observable, map } from 'rxjs'
import { Profile } from '@models/profile'
import { selectUser } from '@selectors/app'
import { MinecraftService } from '@services/minecraft'
import { TWENTY_FOUR_HOURS } from '@constants/index'

@Component({
  selector: 'qbit-status',
  standalone: true,
  imports: [CommonModule, IonicModule, ApplicationStoreModule],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent {
  public readonly user$: Observable<Profile | undefined>
  public readonly avatar$: Observable<string>
  public readonly disabled$: Observable<boolean>

  public constructor(
    private readonly store: Store,
    private readonly mc: MinecraftService
  ) {
    this.user$ = this.store.select(selectUser)
    this.avatar$ = this.user$.pipe(
      map(user => user?.minecraft.id ? this.mc.getAvatar(user.minecraft.id) : '')
    )
    this.disabled$ = this.user$.pipe(
      map(user => user?.application?.createdAt
        ? (Date.now() - new Date(user?.application.createdAt).valueOf()) < TWENTY_FOUR_HOURS
        : true
      )
    )
  }
}

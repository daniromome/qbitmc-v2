import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { ApplicationStoreModule } from '@store/application'
import { Store } from '@ngrx/store'
import { Observable, map } from 'rxjs'
import { User } from '@models/user'
import { selectUser } from '@selectors/app'
import { MinecraftService } from '@services/minecraft'

@Component({
  selector: 'qbit-status',
  standalone: true,
  imports: [CommonModule, IonicModule, ApplicationStoreModule],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent {
  public readonly user$: Observable<User | undefined>
  public readonly avatar$: Observable<string>

  public constructor(
    private readonly store: Store,
    private readonly mc: MinecraftService
  ) {
    this.user$ = this.store.select(selectUser)
    this.avatar$ = this.user$.pipe(
      map(user => user?.minecraft.uuid ? this.mc.getAvatar(user.minecraft.uuid) : '')
    )
  }
}

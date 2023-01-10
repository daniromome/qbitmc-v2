import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { Store } from '@ngrx/store'
import { AppActions } from '@store/app'
import { Observable, map } from 'rxjs'
import { User } from '@models/user'
import { selectUser } from '@selectors/app'
import { MinecraftService } from '@services/minecraft'
import { RolePipe } from '@pipes/role'
import { RoleColorPipe } from '@pipes/role-color'

@Component({
  selector: 'qbit-profile',
  standalone: true,
  imports: [CommonModule, IonicModule, RolePipe, RoleColorPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  public user$: Observable<User | undefined>
  public avatar$: Observable<string>

  public constructor(
    private readonly store: Store,
    private readonly mc: MinecraftService
  ) {
    this.user$ = this.store.select(selectUser)
    this.avatar$ = this.user$.pipe(map(u => u ? this.mc.getAvatar(u?.minecraft.uuid) : ''))
  }

  public logout(): void {
    this.store.dispatch(AppActions.logout())
  }
}

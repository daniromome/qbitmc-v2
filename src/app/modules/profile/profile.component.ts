import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { Store } from '@ngrx/store'
import { AppActions } from '@store/app'
import { Observable } from 'rxjs'
import { Profile } from '@models/profile'
import { selectProfile } from '@selectors/app'
import { RolePipe } from '@pipes/role'
import { RoleColorPipe } from '@pipes/role-color'
import { AvatarPipe } from '@pipes/avatar'

@Component({
  selector: 'qbit-profile',
  standalone: true,
  imports: [CommonModule, IonicModule, RolePipe, RoleColorPipe, AvatarPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  public user$: Observable<Profile | undefined>

  public constructor(
    private readonly store: Store
  ) {
    this.user$ = this.store.select(selectProfile)
  }

  public logout(): void {
    this.store.dispatch(AppActions.logout())
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { Store } from '@ngrx/store'
import { AppActions } from '@store/app'
import { Observable } from 'rxjs'
import { Profile } from '@models/profile'
import { selectNickname, selectProfile } from '@selectors/app'
import { StyledTextComponent } from '@components/styled-text/styled-text.component'
import { StyledText } from '@models/styled-text'
import { StyledRolePipe } from '@pipes/styled-role'
import { AvatarPipe } from '@pipes/avatar'
import { ViewPortService } from '@services/view-port'

@Component({
  selector: 'qbit-profile',
  standalone: true,
  imports: [CommonModule, IonicModule, StyledTextComponent, StyledRolePipe, AvatarPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  public readonly profile$: Observable<Profile | undefined>
  public readonly nickname$: Observable<StyledText[]>
  public readonly isTablet$: Observable<boolean>
  private readonly store = inject(Store)
  private readonly view = inject(ViewPortService)

  public constructor(
  ) {
    this.profile$ = this.store.select(selectProfile)
    this.nickname$ = this.store.select(selectNickname)
    this.isTablet$ = this.view.isTablet$
  }

  public logout(): void {
    this.store.dispatch(AppActions.logout())
  }

  public navigateToNicknameEditor() {
    this.store.dispatch(AppActions.navigateToNicknameEditor())
  }
}

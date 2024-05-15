import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Store } from '@ngrx/store'
import { appActions, appFeature } from '@store/app'
import { Observable } from 'rxjs'
import { Profile } from '@models/profile'
import { StyledTextComponent } from '@components/styled-text/styled-text.component'
import { StyledText } from '@models/styled-text'
import { StyledRolePipe } from '@pipes/styled-role'
import { AvatarPipe } from '@pipes/avatar'
import { ViewPortService } from '@services/view-port'
import { IonContent, IonGrid, IonRow, IonCol, IonItem, IonIcon, IonLabel, IonChip } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { colorPalette } from 'ionicons/icons'

@Component({
  selector: 'qbit-profile',
  standalone: true,
  imports: [IonChip, IonLabel, IonIcon, IonItem, IonCol, CommonModule, StyledTextComponent, StyledRolePipe, AvatarPipe, IonContent, IonGrid, IonRow],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  public readonly profile$: Observable<Profile | undefined>
  public readonly nickname$: Observable<StyledText[]>
  private readonly store = inject(Store)
  public readonly view = inject(ViewPortService)

  public constructor(
  ) {
    addIcons({ colorPalette })
    this.profile$ = this.store.select(appFeature.selectProfile)
    this.nickname$ = this.store.select(appFeature.selectNickname)
  }

  public logout(): void {
    this.store.dispatch(appActions.logout())
  }

  public navigateToNicknameEditor(): void {
    this.store.dispatch(appActions.navigateToNicknameEditor())
  }
}

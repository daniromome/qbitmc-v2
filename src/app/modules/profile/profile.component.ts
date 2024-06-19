import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Store } from '@ngrx/store'
import { appActions, appFeature } from '@store/app'
import { StyledTextComponent } from '@components/styled-text/styled-text.component'
import { StyledRolePipe } from '@pipes/styled-role'
import { AvatarPipe } from '@pipes/avatar'
import { ViewPortService } from '@services/view-port'
import { IonContent, IonGrid, IonRow, IonCol, IonItem, IonIcon, IonLabel, IonChip } from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { colorPalette } from 'ionicons/icons'

@Component({
  selector: 'qbit-profile',
  standalone: true,
  imports: [
    IonChip,
    IonLabel,
    IonIcon,
    IonItem,
    IonCol,
    CommonModule,
    StyledTextComponent,
    StyledRolePipe,
    AvatarPipe,
    IonContent,
    IonGrid,
    IonRow
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private readonly store = inject(Store)
  public readonly view = inject(ViewPortService)
  public readonly nickname = this.store.selectSignal(appFeature.selectNickname)
  public readonly user = this.store.selectSignal(appFeature.selectUser)
  public readonly player = this.store.selectSignal(appFeature.selectPlayer)

  public constructor() {
    addIcons({ colorPalette })
  }

  public logout(): void {
    this.store.dispatch(appActions.logout())
  }

  public navigateToNicknameEditor(): void {
    this.store.dispatch(appActions.navigateToNicknameEditor())
  }
}

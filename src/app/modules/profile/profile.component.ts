import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'

import { Store } from '@ngrx/store'
import { appActions, appFeature } from '@store/app'
import { StyledTextComponent } from '@components/styled-text/styled-text.component'
import { StyledRolePipe } from '@pipes/styled-role'
import { AvatarPipe } from '@pipes/avatar'
import { ViewPortService } from '@services/view-port'
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonIcon,
  IonLabel,
  IonChip,
  IonList,
  IonSplitPane,
  IonMenu,
  IonRouterOutlet
} from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { colorPalette } from 'ionicons/icons'
import { selectUrl } from '@store/router'

@Component({
  selector: 'qbit-profile',
  standalone: true,
  imports: [
    IonRouterOutlet,
    IonMenu,
    IonSplitPane,
    IonList,
    IonChip,
    IonLabel,
    IonIcon,
    IonItem,
    IonCol,
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
  public readonly url = this.store.selectSignal(selectUrl)
  public readonly background = computed(() => {
    const darkMode = this.view.darkMode()
    const url = darkMode
      ? 'https://appwrite.qbitmc.com/v1/storage/buckets/68dca88d0013bb1cffea/files/68dda9e8002df7db3578/preview?height=360&project=66649e96000758b8ebdb'
      : 'https://appwrite.qbitmc.com/v1/storage/buckets/68dca88d0013bb1cffea/files/68dda9df0028c003fffd/preview?height=360&project=66649e96000758b8ebdb'
    return `url(${url}) no-repeat 60% center`
  })

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

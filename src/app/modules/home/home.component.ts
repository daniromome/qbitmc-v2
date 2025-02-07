import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'
import { AvatarPipe } from '@pipes/avatar'
import { SliderComponent } from '@components/slider'
import { ViewPortService } from '@services/view-port'
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonIcon,
  IonItem,
  IonLabel,
  IonAvatar,
  IonChip,
  NavController
} from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { calendarOutline, gameControllerOutline, peopleOutline, globeOutline, hammerOutline } from 'ionicons/icons'
import { BulletPointComponent } from '@components/bullet-point'
import { USER_LABEL } from '@qbitmc/common'

@Component({
  selector: 'qbit-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonChip,
    IonAvatar,
    IonLabel,
    IonItem,
    IonIcon,
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    CommonModule,
    AvatarPipe,
    SliderComponent,
    BulletPointComponent
  ]
})
export class HomeComponent {
  private readonly store = inject(Store)
  public readonly nav = inject(NavController)
  public readonly view = inject(ViewPortService)
  public readonly elementsInView = computed(() => {
    const width = this.view.width()
    if (width < 576) return 1
    if (width < 992) return 2
    if (width < 1400) return 3
    return 5
  })
  public readonly hasApplied = this.store.selectSignal(appFeature.selectIsRole(USER_LABEL.APPLICANT))
  public readonly supporters = this.store.selectSignal(appFeature.selectSupporters)
  public readonly supportersCount = computed(() => this.supporters().length)

  public constructor() {
    addIcons({
      calendarOutline,
      gameControllerOutline,
      peopleOutline,
      globeOutline,
      hammerOutline
    })
  }
}

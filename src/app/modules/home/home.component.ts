import { Component, ChangeDetectionStrategy, OnInit, inject, computed, Signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Store } from '@ngrx/store'
import { appActions, appFeature } from '@store/app'
import { AvatarPipe } from '@pipes/avatar'
import { SliderComponent } from '@components/slider'
import { ViewPortService } from '@services/view-port'
import {
  IonContent,
  IonRow,
  IonGrid,
  IonCol,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonItem,
  IonAvatar,
  IonLabel,
  IonChip,
  IonIcon,
  IonButton,
  NavController
} from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { calendarOutline, gameControllerOutline, peopleOutline, globeOutline, hammerOutline } from 'ionicons/icons'
import { BulletPointComponent } from '@components/bullet-point'
import { RouterLinkWithHref } from '@angular/router'
import { mediaFeature } from '@store/media'
import { Media } from '@models/media'
import { ServerDocument } from '@qbitmc/common/_dist/mod'
import { ServerComponent } from '@components/server'

@Component({
  selector: 'qbit-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonButton,
    IonIcon,
    IonChip,
    IonLabel,
    IonAvatar,
    IonItem,
    IonCardSubtitle,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonText,
    IonCol,
    IonGrid,
    IonRow,
    IonContent,
    CommonModule,
    AvatarPipe,
    SliderComponent,
    BulletPointComponent,
    RouterLinkWithHref,
    ServerComponent
  ]
})
export class HomeComponent implements OnInit {
  private readonly store = inject(Store)
  public readonly nav = inject(NavController)
  public readonly view = inject(ViewPortService)
  public readonly elementsInView = computed(() => {
    const width = this.view.width()
    if (width < 992) return 1
    if (width < 1400) return 2
    return 3
  })
  public readonly isSignedIn = this.store.selectSignal(appFeature.selectIsSignedIn)
  public readonly supporters = this.store.selectSignal(appFeature.selectSupporters)
  public readonly supportersCount = computed(() => this.supporters().length)
  public readonly servers = this.store.selectSignal(appFeature.selectServers)

  public constructor() {
    addIcons({
      calendarOutline,
      gameControllerOutline,
      peopleOutline,
      globeOutline,
      hammerOutline
    })
  }

  public ngOnInit(): void {
    this.store.dispatch(appActions.getLeaderboards())
  }

  public serverMedia(server: ServerDocument): Signal<Media[]> {
    return this.store.selectSignal(mediaFeature.selectMedia(server.media))
  }
}

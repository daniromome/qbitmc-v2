import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import {
  IonContent,
  IonItem,
  IonList,
  IonSpinner,
  IonListHeader,
  IonCol,
  IonGrid,
  IonRow,
  IonSkeletonText,
  NavController,
  IonCardContent,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone'
import { addIcons } from 'ionicons'
import { sync } from 'ionicons/icons'
import { Store } from '@ngrx/store'
import { serverActions, serverFeature } from '@store/server'
import { appFeature } from '@store/app'

@Component({
  selector: 'qbit-server',
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonCardContent,
    IonSkeletonText,
    IonRow,
    IonGrid,
    IonCol,
    IonListHeader,
    IonSpinner,
    IonList,
    IonItem,
    IonContent
  ],
  templateUrl: './server-list.component.html',
  styleUrl: './server-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerListComponent implements OnInit {
  private readonly store = inject(Store)
  public readonly nav = inject(NavController)
  public readonly skeleton = Array.from(Array(8)).map((_, i) => i)
  public readonly registeredServers = this.store.selectSignal(appFeature.selectServers)
  public readonly servers = this.store.selectSignal(serverFeature.selectDrafts)
  public readonly serversLoading = this.store.selectSignal(serverFeature.selectLoadingServers)
  public readonly syncing = this.store.selectSignal(serverFeature.selectSyncing)

  public constructor() {
    addIcons({ sync })
  }

  public ngOnInit(): void {
    this.store.dispatch(serverActions.getServers())
  }

  public sync(): void {
    this.store.dispatch(serverActions.syncDatabase())
  }
}

import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import {
  IonContent,
  IonItem,
  IonList,
  IonSpinner,
  IonCol,
  IonGrid,
  IonRow,
  IonSkeletonText,
  NavController,
  IonCardContent,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonButton
} from '@ionic/angular/standalone'
import { Store } from '@ngrx/store'
import { serverActions, serverFeature } from '@store/server'

@Component({
  selector: 'qbit-server',
  standalone: true,
  imports: [
    IonButton,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonCardContent,
    IonSkeletonText,
    IonRow,
    IonGrid,
    IonCol,
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
  public readonly registeredServers = this.store.selectSignal(serverFeature.selectServers)
  public readonly servers = this.store.selectSignal(serverFeature.selectDrafts)
  public readonly serversLoading = this.store.selectSignal(serverFeature.selectLoadingServers)
  public readonly syncing = this.store.selectSignal(serverFeature.selectSyncing)

  public constructor() {}

  public ngOnInit(): void {
    this.store.dispatch(serverActions.getServers({ includeDrafts: true }))
  }

  public sync(): void {
    this.store.dispatch(serverActions.syncDatabase())
  }
}

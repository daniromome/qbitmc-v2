import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
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
  NavController, IonCardContent, IonCard } from '@ionic/angular/standalone'
import { Store } from '@ngrx/store'
import { adminActions, adminFeature } from '@store/admin'
import { appFeature } from '@store/app'

@Component({
  selector: 'qbit-server',
  standalone: true,
  imports: [IonCard, IonCardContent, IonSkeletonText, IonRow, IonGrid, IonCol, IonListHeader, IonSpinner, IonList, IonItem, IonContent],
  templateUrl: './server-list.component.html',
  styleUrl: './server-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerListComponent {
  private readonly store = inject(Store)
  public readonly nav = inject(NavController)
  public readonly skeleton = Array.from(Array(8)).map((_, i) => i)
  public readonly registeredServers = this.store.selectSignal(appFeature.selectServers)
  public readonly servers = this.store.selectSignal(adminFeature.selectServers)
  public readonly serversLoading = this.store.selectSignal(adminFeature.selectLoadingServers)

  public ionViewWillEnter(): void {
    this.store.dispatch(adminActions.getServers())
  }
}

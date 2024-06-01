import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import {
  IonContent,
  IonRouterOutlet,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonLabel,
  IonIcon,
  NavController,
  IonSplitPane,
  IonMenu
} from '@ionic/angular/standalone'
import { Store } from '@ngrx/store'
import { selectUrl } from '@store/router'

@Component({
  selector: 'qbit-admin',
  standalone: true,
  imports: [
    IonMenu,
    IonSplitPane,
    IonIcon,
    IonLabel,
    CommonModule,
    IonList,
    IonCol,
    IonRow,
    IonGrid,
    IonItem,
    IonRouterOutlet,
    IonContent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  private readonly store = inject(Store)
  public readonly url = this.store.selectSignal(selectUrl)
  public readonly nav = inject(NavController)
  public readonly routes = [
    { icon: 'server', label: $localize`:@@admin-panel-label-create-server:Manage Servers`, url: '/tabs/admin/server' }
  ] as const
}

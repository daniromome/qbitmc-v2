import { Component, inject } from '@angular/core'
import {
  IonContent,
  IonRouterOutlet,
  IonItem,
  IonList,
  IonLabel,
  IonIcon,
  NavController,
  IonSplitPane,
  IonMenu
} from '@ionic/angular/standalone'
import { Store } from '@ngrx/store'
import { selectUrl } from '@store/router'
import { addIcons } from 'ionicons'
import { language, server, pricetag } from 'ionicons/icons'

@Component({
  selector: 'qbit-admin',
  standalone: true,
  imports: [IonMenu, IonSplitPane, IonIcon, IonLabel, IonList, IonItem, IonRouterOutlet, IonContent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  private readonly store = inject(Store)
  public readonly url = this.store.selectSignal(selectUrl)
  public readonly nav = inject(NavController)
  public readonly routes = [
    {
      icon: 'server',
      label: $localize`:@@admin-panel-label-manage-server:Manage Servers`,
      url: '/tabs/admin/server',
      disabled: false
    },
    {
      icon: 'pricetag',
      label: $localize`:@@admin-panel-label-manage-products:Manage Products`,
      url: '/tabs/admin/product',
      disabled: true
    },
    {
      icon: 'language',
      label: $localize`:@@admin-panel-label-manage-translation:Manage Translations`,
      url: '/tabs/admin/translation',
      disabled: false
    }
  ] as const

  public constructor() {
    addIcons({ language, server, pricetag })
  }
}

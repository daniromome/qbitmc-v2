import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonPopover,
  IonContent,
  IonItem,
  IonLabel,
  IonTabBar,
  IonTabs,
  IonTabButton,
  IonAvatar,
  IonText,
  IonList,
  IonListHeader,
  IonBackButton
} from '@ionic/angular/standalone'
import { Store } from '@ngrx/store'
import { USER_LABEL, UserLabel, Locale } from '@qbitmc/common'
import { LocaleService } from '@services/locale'
import { AvatarPipe } from '@pipes/avatar'
import { RolePipe } from '@pipes/role'
import { RoleColorPipe } from '@pipes/role-color'
import { appActions, appFeature } from '@store/app'
import { RouterLinkWithHref } from '@angular/router'
import { addIcons } from 'ionicons'
import { chevronBack, person, logOut, home, storefront, compass, people, apps } from 'ionicons/icons'

interface Tab {
  icon: string
  label: string
  path: string
  role?: UserLabel
}

@Component({
  selector: 'qbit-tabs',
  standalone: true,
  imports: [
    IonBackButton,
    IonListHeader,
    IonList,
    IonText,
    IonAvatar,
    IonTabButton,
    IonTabs,
    IonTabBar,
    IonLabel,
    IonItem,
    IonContent,
    IonPopover,
    IonTitle,
    IonIcon,
    IonButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    CommonModule,
    AvatarPipe,
    RolePipe,
    RoleColorPipe,
    RouterLinkWithHref
  ],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  private readonly store = inject(Store)
  public readonly localeService = inject(LocaleService)
  public readonly disabled = this.store.selectSignal(appFeature.selectIsDisabled)
  public readonly user = this.store.selectSignal(appFeature.selectUser)
  public readonly profile = this.store.selectSignal(appFeature.selectProfile)
  public readonly player = this.store.selectSignal(appFeature.selectPlayer)
  private readonly _tabs: Tab[] = [
    {
      icon: 'home',
      label: $localize`:@@home-tab-label:Home`,
      path: 'home'
    },
    {
      icon: 'storefront',
      label: $localize`:@@shop-tab-label:Shop`,
      path: 'shop'
    },
    {
      icon: 'person',
      label: $localize`:@@profile-tab-label:Profile`,
      path: 'profile',
      role: USER_LABEL.QBITOR
    },
    {
      icon: 'apps',
      label: $localize`:@@profile-tab-label:Admin`,
      path: 'admin',
      role: USER_LABEL.ADMIN
    }
  ]

  public readonly tabs = computed(() => {
    const user = this.user()
    if (!user || !user.labels.includes(USER_LABEL.QBITOR))
      return [
        ...this._tabs.filter(tab => !tab.role),
        { icon: 'people', label: $localize`:@@join-tab-label:Join`, path: 'join', role: USER_LABEL.GUEST }
      ]
    return this._tabs.filter(tab => user.labels.some(r => r === tab.role || !tab.role))
  })

  public constructor() {
    addIcons({ chevronBack, person, logOut, home, storefront, compass, people, apps })
  }

  public changeLocale(locale: Locale): void {
    this.localeService.navigateToLocale(locale)
  }

  public logout(): void {
    this.store.dispatch(appActions.logout())
  }
}

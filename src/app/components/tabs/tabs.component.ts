import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonPopover, IonContent, IonItem, IonLabel, IonTabBar, IonTabs, IonTabButton, IonAvatar, IonText, IonList, IonListHeader, IonBackButton } from '@ionic/angular/standalone'
import { Store } from '@ngrx/store'
import { filter, map } from 'rxjs'
import { ROLE, Role } from '@models/role'
import { LocaleService } from '@services/locale'
import { AvatarPipe } from '@pipes/avatar'
import { Locale } from '@models/locale'
import { RolePipe } from '@pipes/role'
import { RoleColorPipe } from '@pipes/role-color'
import { appActions, appFeature } from '@store/app'
import { NavigationEnd, Router, RouterLinkWithHref } from '@angular/router'
import { addIcons } from 'ionicons'
import { chevronBack, person, logOut, home, storefront, compass, people, server } from 'ionicons/icons'
import { toSignal } from '@angular/core/rxjs-interop'

interface Tab {
  icon: string,
  label: string,
  path: string,
  role?: Role
}

@Component({
  selector: 'qbit-tabs',
  standalone: true,
  imports: [IonBackButton, IonListHeader, IonList, IonText, IonAvatar, IonTabButton, IonTabs, IonTabBar, IonLabel, IonItem, IonContent, IonPopover, IonTitle, IonIcon, IonButton, IonButtons, IonToolbar, IonHeader, CommonModule, AvatarPipe, RolePipe, RoleColorPipe, RouterLinkWithHref],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  private readonly store = inject(Store)
  private readonly router = inject(Router)
  public readonly localeService = inject(LocaleService)
  public readonly disabled = this.store.selectSignal(appFeature.selectIsDisabled)
  public readonly profile = this.store.selectSignal(appFeature.selectProfile)
  public readonly isAdmin = this.store.selectSignal(appFeature.selectIsRole(ROLE.ADMIN))
  public readonly route = toSignal(this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(event => (event as NavigationEnd).url.split('/').slice(1))
  ))

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
      icon: 'compass',
      label: $localize`:@@map-tab-label:Map`,
      path: 'map',
      role: ROLE.QBITOR
    },
    {
      icon: 'person',
      label: $localize`:@@profile-tab-label:Profile`,
      path: 'profile',
      role: ROLE.QBITOR
    }
  ]

  public readonly tabs = computed(() => {
    const profile = this.profile()
    if (!profile || profile.roles.length === 0) return [...this._tabs.filter(tab => !tab.role), { icon: 'people', label: $localize`:@@join-tab-label:Join`, path: 'join', role: ROLE.GUEST }]
    return this._tabs.filter(tab => profile.roles.some(r => r === tab.role || !tab.role))
  })

  public constructor() {
    addIcons({ chevronBack, person, logOut, home, storefront, compass, people, server })
  }

  public changeLocale(locale: Locale): void {
    this.localeService.navigateToLocale(locale)
  }

  public logout(): void {
    this.store.dispatch(appActions.logout())
  }

  public navigateBack(): void {
    this.store.dispatch(appActions.navigateBack())
  }
}

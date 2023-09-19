import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule, NavController } from '@ionic/angular'
import { Store } from '@ngrx/store'
import { Observable, filter, map } from 'rxjs'
import { Role } from '@models/role'
import { LocaleService } from '@services/locale'
import { Profile } from '@models/profile'
import { AvatarPipe } from '@pipes/avatar'
import { Locale } from '@models/locale'
import { RolePipe } from '@pipes/role'
import { RoleColorPipe } from '@pipes/role-color'
import { AppActions, appFeature } from '@store/app'
import { NavigationEnd, Router } from '@angular/router'

interface Tab {
  icon: string,
  label: string,
  path: string,
  role?: Role
}

@Component({
  selector: 'qbit-tabs',
  standalone: true,
  imports: [CommonModule, IonicModule, AvatarPipe, RolePipe, RoleColorPipe],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  public readonly tabs$: Observable<Tab[]>
  public readonly disabled$: Observable<boolean>
  public readonly locale: string
  public readonly profile$: Observable<Profile | undefined>
  public readonly route$: Observable<string[]>

  private readonly tabs: Tab[] = [
    {
      icon: 'home',
      label: $localize`:@@home:Home`,
      path: 'home'
    },
    {
      icon: 'storefront',
      label: $localize`:@@shop:Shop`,
      path: 'shop'
    },
    {
      icon: 'compass',
      label: $localize`:@@map:Map`,
      path: 'map',
      role: 'qbitor'
    },
    {
      icon: 'person',
      label: $localize`:@@profile:Profile`,
      path: 'profile',
      role: 'qbitor'
    }
  ]

  public constructor(
    private readonly localeService: LocaleService,
    private readonly store: Store,
    private readonly router: Router,
    private readonly nav: NavController
  ) {
    this.tabs$ = this.store.select(appFeature.selectProfile).pipe(
      map(user => !user || user.roles.length === 0
        ? [...this.tabs.filter(tab => !tab.role), { icon: 'people', label: $localize`Join`, path: 'join', role: 'guest' }]
        : this.tabs.filter(tab => user.roles.some(r => r === tab.role || !tab.role))
      )
    )
    this.disabled$ = this.store.select(appFeature.selectIsDisabled)
    this.profile$ = this.store.select(appFeature.selectProfile)
    this.locale = localeService.locale
    this.route$ = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).url.split('/').slice(1))
    )
  }

  public changeLocale(locale: Locale): void {
    this.localeService.navigateToLocale(locale)
  }

  public logout(): void {
    this.store.dispatch(AppActions.logout())
  }

  public navigateBack(): void {
    this.store.dispatch(AppActions.navigateBack())
  }
}

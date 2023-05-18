import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { Store } from '@ngrx/store'
import { Observable, map } from 'rxjs'
import { selectProfile } from '@selectors/app'
import { Role } from '@models/role'

interface Tab {
  icon: string,
  label: string,
  path: string,
  role?: Role
}

@Component({
  selector: 'qbit-tabs',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  public readonly tabs$: Observable<Tab[]>

  private readonly tabs: Tab[] = [
    {
      icon: 'home',
      label: $localize`:@@home:Home`,
      path: 'home',
    },
    {
      icon: 'storefront',
      label: $localize`:@@shop:Shop`,
      path: 'shop',
      role: 'qbitor'
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
    private readonly store: Store
  ) {
    this.tabs$ = this.store.select(selectProfile).pipe(
      map(user => !user || user.roles.length === 0
        ? [...this.tabs.filter(tab => !tab.role), { icon: 'people', label: $localize`Join`, path: 'join', role: 'guest' }]
        : this.tabs.filter(tab => user.roles.some(r => r === tab.role || !tab.role))
      )
    )
  }
}

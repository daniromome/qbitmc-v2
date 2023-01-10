import { Component, ChangeDetectionStrategy, EnvironmentInjector } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { Store } from '@ngrx/store'
import { Observable, map } from 'rxjs'
import { selectUser } from '@selectors/app'
import { Role } from '@models/role'

interface Tab {
  icon: string,
  label: string,
  path: string,
  role: Role
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
      label: $localize`Home`,
      path: 'home',
      role: 'guest'
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
    }
  ]

  public constructor(
    public readonly environmentInjector: EnvironmentInjector,
    private readonly store: Store
  ) {
    this.tabs$ = this.store.select(selectUser).pipe(
      map(user => !user || user.roles.length === 1
        ? [...this.tabs.filter(tab => tab.role === 'guest'), { icon: 'people', label: $localize`Join`, path: 'join', role: 'guest' }]
        : this.tabs.filter(tab => user.roles.some(r => r.role === tab.role))
      )
    )
  }
}

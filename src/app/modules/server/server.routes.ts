import { Route } from '@angular/router'
import { enabledGuard } from '@guards/enabled'
import { roleGuard } from '@guards/role'
import { USER_LABEL } from '@qbitmc/common'

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./server.component').then(c => c.ServerComponent)
  },
  {
    path: ':id/map',
    loadComponent: () => import('./map/map.component').then(c => c.MapComponent),
    canActivate: [roleGuard(USER_LABEL.QBITOR), enabledGuard]
  }
]

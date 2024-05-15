import { Route } from '@angular/router'
import { roleGuard } from '@guards/role'
import { ROLE } from '@models/role'

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./admin.component').then((c) => c.AdminComponent),
    canActivate: [roleGuard(ROLE.ADMIN)],
    children: [
      {
        path: 'server',
        loadComponent: () => import('./server/server.component').then((c) => c.ServerComponent)
      }
    ]
  }
]

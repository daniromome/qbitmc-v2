import { Route } from '@angular/router'
import { roleGuard } from '@guards/role'
import { ROLE } from '@models/role'
import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import { adminEffects, adminFeature } from '@store/admin'

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./admin.component').then(c => c.AdminComponent),
    canActivate: [roleGuard(ROLE.ADMIN)],
    providers: [provideState(adminFeature), provideEffects(adminEffects)],
    children: [
      {
        path: 'server',
        children: [
          {
            path: '',
            loadComponent: () => import('./server-list/server-list.component').then(c => c.ServerListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./server-list/server-form/server-form.component').then(c => c.ServerFormComponent)
          }
        ]
      }
    ]
  }
]

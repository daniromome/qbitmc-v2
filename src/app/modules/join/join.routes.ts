import { Route } from '@angular/router'
import { appliedGuard } from '@guards/applied'
import { applyGuard } from '@guards/apply'
import { enabledGuard } from '@guards/enabled'

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./join.component').then(c => c.JoinComponent),
    canActivate: [applyGuard, enabledGuard]
  },
  {
    path: 'status',
    loadComponent: () => import('./status/status.component').then(c => c.StatusComponent),
    canActivate: [appliedGuard, enabledGuard]
  }
]

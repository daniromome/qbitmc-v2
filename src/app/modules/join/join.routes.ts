import { Route } from '@angular/router'
import { appliedGuard } from '@guards/applied'
import { applyGuard } from '@guards/apply'
import { enabledGuard } from '@guards/enabled'
import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import { mediaFeature, mediaEffects } from '@store/media'

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./join.component').then(c => c.JoinComponent),
    canActivate: [applyGuard, enabledGuard],
    providers: [provideState(mediaFeature), provideEffects(mediaEffects)]
  },
  {
    path: 'status',
    loadComponent: () => import('./status/status.component').then(c => c.StatusComponent),
    canActivate: [appliedGuard, enabledGuard]
  }
]

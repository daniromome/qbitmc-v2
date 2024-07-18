import { Route } from '@angular/router'
import { enabledGuard } from '@guards/enabled'
import { roleGuard } from '@guards/role'
import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import { BytesPipe } from '@pipes/bytes'
import { VisibilityPipe } from '@pipes/visibility'
import { USER_LABEL } from '@qbitmc/common'
import { mediaFeature, mediaEffects } from '@store/media'
import { serverFeature, serverEffects } from '@store/server'
import { translationFeature, translationEffects } from '@store/translation'

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./server.component').then(c => c.ServerComponent),
    providers: [
      VisibilityPipe,
      BytesPipe,
      provideState(mediaFeature),
      provideEffects(mediaEffects),
      provideState(translationFeature),
      provideEffects(translationEffects),
      provideState(serverFeature),
      provideEffects(serverEffects)
    ]
  },
  {
    path: ':id/map',
    loadComponent: () => import('./map/map.component').then(c => c.MapComponent),
    canActivate: [roleGuard(USER_LABEL.QBITOR), enabledGuard]
  }
]

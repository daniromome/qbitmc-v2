import { Route } from '@angular/router'
import { roleGuard } from '@guards/role'
import { USER_LABEL } from '@qbitmc/common'
import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import { serverEffects, serverFeature } from '@store/server'
import { translationEffects, translationFeature } from '@store/translation'
import { BytesPipe } from '@pipes/bytes'
import { mediaFeature, mediaEffects } from '@store/media'

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./admin.component').then(c => c.AdminComponent),
    canActivate: [roleGuard(USER_LABEL.ADMIN)],
    providers: [],
    children: [
      {
        path: 'server',
        providers: [
          BytesPipe,
          provideState(mediaFeature),
          provideEffects(mediaEffects),
          provideState(serverFeature),
          provideEffects(serverEffects)
        ],
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
      },
      {
        path: 'translation',
        providers: [provideState(translationFeature), provideEffects(translationEffects)],
        children: [
          {
            path: '',
            loadComponent: () => import('./translation-list/translation-list.component').then(c => c.TranslationListComponent)
          },
          {
            path: ':id/server',
            providers: [provideState(serverFeature), provideEffects(serverEffects)],
            loadComponent: () =>
              import('./translation-list/translation-form/translation-form.component').then(c => c.TranslationFormComponent)
          },
          {
            path: 'new/server',
            providers: [provideState(serverFeature), provideEffects(serverEffects)],
            loadComponent: () =>
              import('./translation-list/translation-form/translation-form.component').then(c => c.TranslationFormComponent)
          }
        ]
      }
    ]
  }
]

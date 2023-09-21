import { TitleCasePipe } from '@angular/common'
import { Routes } from '@angular/router'
import { appliedGuard } from '@guards/applied'
import { applyGuard } from '@guards/apply'
import { authGuard } from '@guards/auth'
import { authenticatedGuard } from '@guards/authenticated'
import { enabledGuard } from '@guards/enabled'
import { qbitorGuard } from '@guards/qbitor'
import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import { BytesPipe } from '@pipes/bytes'
import { applicationFeature, ApplicationEffects } from '@store/application'
import { ShopEffects, shopFeature } from '@store/shop'

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./components/tabs').then(c => c.TabsComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./modules/home/home.component').then(c => c.HomeComponent)
      },
      {
        path: 'join',
        canActivate: [authGuard, enabledGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/join/join.component').then(c => c.JoinComponent),
            canActivate: [applyGuard, enabledGuard]
          },
          {
            path: 'status',
            loadComponent: () => import('./modules/join/status/status.component').then(c => c.StatusComponent),
            canActivate: [appliedGuard, enabledGuard]
          }
        ],
        providers: [
          provideState(applicationFeature),
          provideEffects(ApplicationEffects),
          BytesPipe
        ]
      },
      {
        path: 'shop',
        loadComponent: () => import('./modules/shop/shop.component').then(c => c.ShopComponent),
        canActivate: [enabledGuard],
        providers: [
          provideState(shopFeature),
          provideEffects(ShopEffects)
        ]
      },
      {
        path: 'map',
        loadComponent: () => import('./modules/map/map.component').then(c => c.MapComponent),
        canActivate: [qbitorGuard, enabledGuard]
      },
      {
        path: 'profile',
        canActivate: [qbitorGuard, enabledGuard],
        providers: [
          TitleCasePipe
        ],
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/profile/profile.component').then(c => c.ProfileComponent),
            canActivate: [qbitorGuard, enabledGuard]
          },
          {
            path: 'nickname',
            loadComponent: () => import('./modules/profile/nickname-editor/nickname-editor.component').then(c => c.NicknameEditorComponent),
            canActivate: [qbitorGuard, enabledGuard]
          }
        ]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tabs'
  },
  {
    path: 'auth',
    loadComponent: () => import('./modules/auth/auth.component').then(c => c.AuthComponent),
    canActivate: [authenticatedGuard]
  }
]

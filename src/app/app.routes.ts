import { TitleCasePipe } from '@angular/common'
import { Routes } from '@angular/router'
import { authGuard } from '@guards/auth'
import { authenticatedGuard } from '@guards/authenticated'
import { enabledGuard } from '@guards/enabled'
import { roleGuard } from '@guards/role'
import { USER_LABEL } from '@qbitmc/common'
import { provideEffects } from '@ngrx/effects'
import { provideState } from '@ngrx/store'
import { BytesPipe } from '@pipes/bytes'
import { applicationFeature, applicationEffects } from '@store/application'
import { ShopEffects, shopFeature } from '@store/shop'
import { mediaFeature, mediaEffects } from '@store/media'

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./components/tabs').then(c => c.TabsComponent),
    providers: [BytesPipe, provideState(mediaFeature), provideEffects(mediaEffects)],
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.routes').then(m => m.routes)
      },
      {
        path: 'home',
        loadComponent: () => import('./modules/home/home.component').then(c => c.HomeComponent)
      },
      {
        path: 'join',
        canActivate: [authGuard, enabledGuard],
        loadChildren: () => import('./modules/join/join.routes').then(m => m.routes),
        providers: [provideState(applicationFeature), provideEffects(applicationEffects), BytesPipe]
      },
      {
        path: 'shop',
        loadComponent: () => import('./modules/shop/shop.component').then(c => c.ShopComponent),
        canActivate: [enabledGuard],
        providers: [provideState(shopFeature), provideEffects(ShopEffects)]
      },
      {
        path: 'map',
        loadComponent: () => import('./modules/map/map.component').then(c => c.MapComponent),
        canActivate: [roleGuard(USER_LABEL.QBITOR), enabledGuard]
      },
      {
        path: 'profile',
        canActivate: [roleGuard(USER_LABEL.QBITOR), enabledGuard],
        providers: [TitleCasePipe],
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/profile/profile.component').then(c => c.ProfileComponent),
            canActivate: [roleGuard(USER_LABEL.QBITOR), enabledGuard]
          },
          {
            path: 'nickname',
            loadComponent: () =>
              import('./modules/profile/nickname-editor/nickname-editor.component').then(c => c.NicknameEditorComponent),
            canActivate: [roleGuard(USER_LABEL.QBITOR), enabledGuard]
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

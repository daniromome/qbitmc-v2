import { NgModule } from '@angular/core'
import { RouterModule, Routes, PreloadAllModules } from '@angular/router'
import { AppliedGuard } from '@guards/applied'
import { ApplyGuard } from '@guards/apply'
import { AuthenticatedGuard } from '@guards/authenticated'
import { QbitorGuard } from '@guards/qbitor'
import { AuthGuard } from '@guards/auth'
import { enabledGuard } from '@guards/enabled'

const routes: Routes = [
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
        canActivate: [AuthGuard, enabledGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/join/join.component').then(c => c.JoinComponent),
            canActivate: [ApplyGuard, enabledGuard]
          },
          {
            path: 'status',
            loadComponent: () => import('./modules/join/status/status.component').then(c => c.StatusComponent),
            canActivate: [AppliedGuard, enabledGuard]
          }
        ]
      },
      {
        path: 'shop',
        loadComponent: () => import('./modules/shop/shop.component').then(c => c.ShopComponent),
        canActivate: [QbitorGuard, enabledGuard]
      },
      {
        path: 'map',
        loadComponent: () => import('./modules/map/map.component').then(c => c.MapComponent),
        canActivate: [QbitorGuard, enabledGuard]
      },
      {
        path: 'profile',
        loadComponent: () => import('./modules/profile/profile.component').then(c => c.ProfileComponent),
        canActivate: [QbitorGuard, enabledGuard]
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
    canActivate: [AuthenticatedGuard]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

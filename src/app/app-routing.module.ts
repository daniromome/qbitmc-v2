import { NgModule } from '@angular/core'
import { RouterModule, Routes, PreloadAllModules } from '@angular/router'
import { AppliedGuard } from '@guards/applied'
import { ApplyGuard } from '@guards/apply'
import { AuthGuard } from '@guards/auth'
import { AuthenticatedGuard } from '@guards/authenticated'
import { QbitorGuard } from '@guards/qbitor'

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
        children: [
          {
            path: 'auth',
            loadComponent: () => import('./modules/auth/auth.component').then(c => c.AuthComponent),
            canActivate: [AuthenticatedGuard]
          },
          {
            path: '',
            loadComponent: () => import('./modules/join/join.component').then(c => c.JoinComponent),
            canActivate: [AuthGuard, ApplyGuard]
          },
          {
            path: 'status',
            loadComponent: () => import('./modules/join/status/status.component').then(c => c.StatusComponent),
            canActivate: [AuthGuard, AppliedGuard]
          }
        ]
      },
      {
        path: 'shop',
        loadComponent: () => import('./modules/shop/shop.component').then(c => c.ShopComponent),
        canActivate: [QbitorGuard]
      },
      {
        path: 'map',
        loadComponent: () => import('./modules/map/map.component').then(c => c.MapComponent),
        canActivate: [QbitorGuard]
      },
      {
        path: 'profile',
        loadComponent: () => import('./modules/profile/profile.component').then(c => c.ProfileComponent),
        canActivate: [QbitorGuard]
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
    loadComponent: () => import('./modules/auth/auth.component').then(c => c.AuthComponent)
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

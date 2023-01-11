import { NgModule } from '@angular/core'
import { RouterModule, Routes, PreloadAllModules } from '@angular/router'
import { AppliedGuard } from '@guards/applied'
import { ApplyGuard } from '@guards/apply'
import { AuthenticatedGuard } from '@guards/authenticated'
import { QbitorGuard } from '@guards/qbitor'
import { AuthGuard } from '@guards/auth'

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
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/join/join.component').then(c => c.JoinComponent),
            canActivate: [ApplyGuard]
          },
          {
            path: 'status',
            loadComponent: () => import('./modules/join/status/status.component').then(c => c.StatusComponent),
            canActivate: [AppliedGuard]
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
    loadComponent: () => import('./modules/auth/auth.component').then(c => c.AuthComponent),
    canActivate: [AuthenticatedGuard]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

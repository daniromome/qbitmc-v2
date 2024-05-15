import { inject } from '@angular/core'
import { Router, CanActivateFn } from '@angular/router'
import { filter, map, switchMap } from 'rxjs'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'
import { Role } from '@models/role'

export const roleGuard: (...roles: Role[]) => CanActivateFn =
  (...roles: Role[]) =>
    () => {
      const store = inject(Store)
      const router = inject(Router)
      return store.select(appFeature.selectInitialized).pipe(
        filter(initialized => initialized),
        switchMap(() => store.select(appFeature.selectIsRole(...roles))),
        map(is => is || router.createUrlTree(['tabs', 'home']))
      )
    }

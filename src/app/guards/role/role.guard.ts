/* eslint-disable prettier/prettier */
import { inject } from '@angular/core'
import { Router, CanActivateFn } from '@angular/router'
import { filter, map, switchMap } from 'rxjs'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'
import { UserLabel } from '@qbitmc/common'

export const roleGuard: (...roles: UserLabel[]) => CanActivateFn =
  (...roles: UserLabel[]) =>
    () => {
      const store = inject(Store)
      const router = inject(Router)
      return store.select(appFeature.selectUser).pipe(
        filter(user => !!user),
        switchMap(() => store.select(appFeature.selectIsRole(...roles))),
        map(is => is || router.createUrlTree(['tabs', 'home']))
      )
    }

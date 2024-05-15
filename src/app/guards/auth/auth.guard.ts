import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { filter, map, switchMap } from 'rxjs'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'

export const authGuard: CanActivateFn = () => {
  const store = inject(Store)
  const router = inject(Router)
  return store.select(appFeature.selectInitialized).pipe(
    filter(initialized => initialized),
    switchMap(() => store.select(appFeature.selectIsSignedIn)),
    map(isSignedIn => isSignedIn || router.createUrlTree(['auth']))
  )
}

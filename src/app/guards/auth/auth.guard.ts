import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { map } from 'rxjs'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'

export const authGuard: CanActivateFn = () => {
  const store = inject(Store)
  const router = inject(Router)
  return store.select(appFeature.selectIsSignedIn).pipe(
    map(isSignedIn => isSignedIn || router.createUrlTree(['auth']))
  )
}

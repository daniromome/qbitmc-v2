import { inject } from '@angular/core'
import { Router, CanActivateFn } from '@angular/router'
import { map } from 'rxjs'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'

export const qbitorGuard: CanActivateFn = () => {
  const store = inject(Store)
  const router = inject(Router)
  return store.select(appFeature.selectIsRole('qbitor')).pipe(
    map(is => is || router.createUrlTree(['tabs', 'home']))
  )
}

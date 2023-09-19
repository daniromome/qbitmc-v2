import { inject } from '@angular/core'
import { Router, CanActivateFn } from '@angular/router'
import { map } from 'rxjs'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'
import { ROLE } from '@models/role'

export const qbitorGuard: CanActivateFn = () => {
  const store = inject(Store)
  const router = inject(Router)
  return store.select(appFeature.selectIsRole(ROLE.QBITOR)).pipe(
    map(is => is || router.createUrlTree(['tabs', 'home']))
  )
}

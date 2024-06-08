import { inject } from '@angular/core'
import { Router, CanActivateFn } from '@angular/router'
import { filter, map } from 'rxjs'
import { Store } from '@ngrx/store'
import { applicationActions, applicationFeature } from '@store/application'

export const appliedGuard: CanActivateFn = () => {
  const store = inject(Store)
  const router = inject(Router)
  store.dispatch(applicationActions.get())
  return store.select(applicationFeature.selectHasApplied).pipe(
    filter(applied => applied !== undefined),
    map(applied => applied || router.createUrlTree(['tabs', 'join']))
  )
}

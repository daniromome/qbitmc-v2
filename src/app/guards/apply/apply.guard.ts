import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { applicationActions, applicationFeature } from '@store/application'
import { filter, map } from 'rxjs'

export const applyGuard: CanActivateFn = () => {
  const store = inject(Store)
  const router = inject(Router)
  store.dispatch(applicationActions.get())
  return store.select(applicationFeature.selectHasApplied).pipe(
    filter(applied => applied !== undefined),
    map(applied => !applied || router.createUrlTree(['tabs', 'join', 'status']))
  )
}

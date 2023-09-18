import { inject } from '@angular/core'
import { Router, CanActivateFn } from '@angular/router'
import { filter, map, switchMap } from 'rxjs'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'

export const appliedGuard: CanActivateFn = () => {
  const store = inject(Store)
  const router = inject(Router)
  return store.select(appFeature.selectInitialized).pipe(
    filter(initialized => initialized),
    switchMap(() => store.select(appFeature.selectPendingApproval)),
    map(pending => pending || router.createUrlTree(['tabs', 'join']))
  )
}

import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { USER_LABEL } from '@qbitmc/common'
import { appFeature } from '@store/app'
import { filter, map, switchMap } from 'rxjs'

export const applyGuard: CanActivateFn = () => {
  const store = inject(Store)
  const router = inject(Router)
  return store.select(appFeature.selectInitialized).pipe(
    filter(initialized => initialized),
    switchMap(() => store.select(appFeature.selectIsRole(USER_LABEL.APPLICANT))),
    map(isApplicant => !isApplicant || router.createUrlTree(['tabs', 'join', 'status']))
  )
}

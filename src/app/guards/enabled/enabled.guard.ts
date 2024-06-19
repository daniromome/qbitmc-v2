import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'
import { map } from 'rxjs'

export const enabledGuard: CanActivateFn = () => {
  const store = inject(Store)
  const router = inject(Router)
  return store
    .select(appFeature.selectIsDisabled)
    .pipe(map(isDisabled => !isDisabled || router.createUrlTree(['tabs', 'home'])))
}

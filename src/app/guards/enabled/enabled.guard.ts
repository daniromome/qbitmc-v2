import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsDisabled } from '@store/app/app.selectors';
import { map } from 'rxjs';

export const enabledGuard: CanActivateFn = () => {
  const store = inject(Store)
  const router = inject(Router)
  return store.select(selectIsDisabled).pipe(
    map(isDisabled => !isDisabled || router.createUrlTree(['tabs', 'home']))
  )
};

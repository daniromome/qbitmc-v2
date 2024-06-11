import { inject } from '@angular/core'
import { ResolveFn } from '@angular/router'
import { concatLatestFrom } from '@ngrx/operators'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'
import { applicationActions, applicationFeature } from '@store/application'
import { exhaustMap, filter, map, of } from 'rxjs'

export const applicationResolver: ResolveFn<boolean> = () => {
  console.log('resolving')
  const store = inject(Store)
  store.dispatch(applicationActions.get())
  return store.select(appFeature.selectInitialized).pipe(
    filter(initialized => initialized),
    exhaustMap(() => of(store.dispatch(applicationActions.get()))),
    map(() => true)
  )
}

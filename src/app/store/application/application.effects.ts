import { inject, isDevMode } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { applicationActions } from '@store/application'
import { catchError, map, switchMap, repeat, exhaustMap } from 'rxjs/operators'
import { forkJoin, from, of } from 'rxjs'
import { NavController, ToastController } from '@ionic/angular'
import { ApplicationService } from '@services/application'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app/app.reducer'

export const get$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), application = inject(ApplicationService)) =>
    actions$.pipe(
      ofType(applicationActions.get),
      concatLatestFrom(() => store.select(appFeature.selectProfile)),
      switchMap(([_, profile]) => application.findByProfileId(profile!.$id)),
      map(application => {
        if (!application) throw new Error("Couldn't find an application for logged in user")
        return applicationActions.getSuccess({ application })
      }),
      catchError(error => of(applicationActions.getFailure({ error }))),
      repeat()
    ),
  { functional: true }
)

export const submit$ = createEffect(
  (actions$ = inject(Actions), application = inject(ApplicationService)) =>
    actions$.pipe(
      ofType(applicationActions.submit),
      switchMap(action => application.submit(action.application)),
      map(response => applicationActions.submitSuccess({ application: response })),
      catchError(error => of(applicationActions.submitFailure({ error }))),
      repeat()
    ),
  { functional: true }
)

export const submitSuccess$ = createEffect(
  (actions$ = inject(Actions), nav = inject(NavController)) =>
    actions$.pipe(
      ofType(applicationActions.submitSuccess),
      exhaustMap(() => {
        const navigate = from(nav.navigateForward(['tabs', 'join', 'status']))
        return isDevMode() ? navigate : forkJoin([of(localStorage.removeItem('application')), navigate])
      })
    ),
  { dispatch: false, functional: true }
)

export const submitFailure$ = createEffect(
  (actions$ = inject(Actions), toast = inject(ToastController)) =>
    actions$.pipe(
      ofType(applicationActions.submitFailure),
      switchMap(() =>
        toast.create({
          message: $localize`:@@submit-application-failure:An error ocurred while submitting your application, please try again later.`,
          buttons: ['OK'],
          duration: 4500
        })
      ),
      switchMap(t => t.present())
    ),
  { dispatch: false, functional: true }
)

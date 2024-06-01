import { inject, isDevMode } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { EnrollmentService } from '@services/enrollment'
import { applicationActions } from '@store/application'
import { catchError, map, switchMap, tap, repeat, filter } from 'rxjs/operators'
import { of } from 'rxjs'
import { ToastController } from '@ionic/angular'

export const submit$ = createEffect(
  (actions$ = inject(Actions), enrollment = inject(EnrollmentService)) =>
    actions$.pipe(
      ofType(applicationActions.submit),
      switchMap(action => enrollment.submit(action.application)),
      map(response => applicationActions.submitSuccess({ application: response })),
      catchError(error => of(applicationActions.submitFailure({ error }))),
      repeat()
    ),
  { functional: true }
)

export const submitSuccess$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(applicationActions.submitSuccess),
      filter(() => !isDevMode()),
      tap(() => localStorage.removeItem('application'))
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

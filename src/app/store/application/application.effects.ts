import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { EnrollmentService } from '@services/enrollment'
import { ApplicationActions } from '@store/application'
import { catchError, mergeMap, map, switchMap } from 'rxjs/operators'
import { of } from 'rxjs'
import { SupabaseService } from '@services/supabase'
import { Store } from '@ngrx/store'

@Injectable()
export class ApplicationEffects {
  // public submit$ = createEffect(() => this.actions$.pipe(
  //   ofType(ApplicationActions.submit),
  //   concatLatestFrom(() => this.store.select(selectToken)),
  //   mergeMap(([action, token]) => {
  //     if (!token) return of(ApplicationActions.submitFailure({ error: new Error('No provider token found') }))
  //     return this.application.submit(action.application).pipe(
  //       map(response => ApplicationActions.submitSuccess({ application: response, token }))
  //     )
  //   }),
  //   catchError(error => of(ApplicationActions.submitFailure({ error })))
  // ))

  public submitSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.submitSuccess),
    switchMap(action => this.supabase.joinGuild(action.token))
  ), { dispatch: false })

  public constructor(
    private readonly actions$: Actions,
    private readonly application: EnrollmentService,
    private readonly supabase: SupabaseService,
    private readonly store: Store
  ) {}
}

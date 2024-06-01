import { inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { ServerService } from '@services/server'
import { adminActions } from '@store/admin'
import { switchMap, map, catchError, of, repeat } from 'rxjs'

export const getServers$ = createEffect(
  (actions$ = inject(Actions), serverService = inject(ServerService)) =>
    actions$.pipe(
      ofType(adminActions.getServers),
      switchMap(() => serverService.list(true)),
      map(servers => adminActions.getServersSuccess({ servers })),
      catchError(error => {
        console.error(error)
        return of(adminActions.getServersFailure({ error }))
      }),
      repeat()
    ),
  { functional: true }
)

export const upsertServer$ = createEffect(
  (actions$ = inject(Actions), serverService = inject(ServerService)) =>
    actions$.pipe(
      ofType(adminActions.upsertServer),
      switchMap(({ server }) => serverService.upsert(server)),
      map(server => adminActions.upsertServerSuccess({ server })),
      catchError(error => {
        console.error(error)
        return of(adminActions.upsertServerFailure({ error }))
      }),
      repeat()
    ),
  { functional: true }
)

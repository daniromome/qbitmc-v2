import { inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { ServerService } from '@services/server'
import { serverActions } from '@store/server'
import { switchMap, map, catchError, of, repeat } from 'rxjs'

export const getServers$ = createEffect(
  (actions$ = inject(Actions), serverService = inject(ServerService)) =>
    actions$.pipe(
      ofType(serverActions.getServers),
      switchMap(() => serverService.list(true)),
      map(servers => serverActions.getServersSuccess({ servers })),
      catchError(error => {
        console.error(error)
        return of(serverActions.getServersFailure({ error }))
      }),
      repeat()
    ),
  { functional: true }
)

export const upsertServer$ = createEffect(
  (actions$ = inject(Actions), serverService = inject(ServerService)) =>
    actions$.pipe(
      ofType(serverActions.upsertServer),
      switchMap(({ server }) => serverService.upsert(server)),
      map(server => serverActions.upsertServerSuccess({ server })),
      catchError(error => {
        console.error(error)
        return of(serverActions.upsertServerFailure({ error }))
      }),
      repeat()
    ),
  { functional: true }
)

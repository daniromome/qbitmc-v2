import { inject, isDevMode } from '@angular/core'
import { MEDIA_ENTITY } from '@models/media'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { ServerService } from '@services/server'
import { mediaActions } from '@store/media'
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

export const getServersSuccess$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(serverActions.getServersSuccess),
      map(({ servers }) =>
        mediaActions.getMedia({ request: { entity: MEDIA_ENTITY.SERVER, ids: servers.flatMap(s => s.media) } })
      )
    ),
  { functional: true }
)

export const updateServer$ = createEffect(
  (actions$ = inject(Actions), serverService = inject(ServerService)) =>
    actions$.pipe(
      ofType(serverActions.updateServer),
      switchMap(({ id, server }) => serverService.update(id, server)),
      map(server => serverActions.updateServerSuccess({ server })),
      catchError(error => {
        if (isDevMode()) console.error(error)
        return of(serverActions.updateServerFailure({ error }))
      }),
      repeat()
    ),
  { functional: true }
)

export const syncDatabase$ = createEffect(
  (actions$ = inject(Actions), serverService = inject(ServerService)) =>
    actions$.pipe(
      ofType(serverActions.syncDatabase),
      switchMap(() => serverService.sync()),
      map(servers => serverActions.syncDatabaseSuccess({ servers })),
      catchError(error => {
        if (isDevMode()) console.error(error)
        return of(serverActions.syncDatabaseFailure({ error }))
      }),
      repeat()
    ),
  { functional: true }
)

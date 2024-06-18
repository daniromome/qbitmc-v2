import { inject, isDevMode } from '@angular/core'
import { MEDIA_ENTITY } from '@models/media'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { Store } from '@ngrx/store'
import { ServerService } from '@services/server'
import { appFeature } from '@store/app'
import { mediaActions } from '@store/media'
import { serverActions } from '@store/server'
import { translationActions } from '@store/translation'
import { switchMap, map, catchError, of, repeat } from 'rxjs'

export const getServers$ = createEffect(
  (actions$ = inject(Actions), serverService = inject(ServerService), store = inject(Store)) =>
    actions$.pipe(
      ofType(serverActions.getServers),
      switchMap(() => serverService.list(true)),
      concatLatestFrom(() => store.select(appFeature.selectServers)),
      map(([drafts, servers]) => serverActions.getServersSuccess({ servers: [...drafts, ...servers] })),
      catchError(error => {
        console.error(error)
        return of(serverActions.getServersFailure({ error }))
      }),
      repeat()
    ),
  { functional: true }
)

export const getServersSuccessEmitGetMedia$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(serverActions.getServersSuccess),
      map(({ servers }) =>
        mediaActions.getMedia({ request: { entity: MEDIA_ENTITY.SERVER, ids: servers.flatMap(s => s.media) } })
      )
    ),
  { functional: true }
)

export const getServersEmitGetTranslations$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(serverActions.getServers),
      map(() => translationActions.getTranslations({ locale: false, namespace: 'server' }))
    ),
  { functional: true }
)

export const updateServer$ = createEffect(
  (actions$ = inject(Actions), serverService = inject(ServerService)) =>
    actions$.pipe(
      ofType(serverActions.updateServer),
      switchMap(({ $id: id, server }) => serverService.update(id, server)),
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

export const addMediaToServerEmitUpdateServer$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(serverActions.addMediaToServer),
      map(({ server, request }) =>
        serverActions.updateServer({ $id: server.$id, server: { media: [...server.media, ...request.fileIds] } })
      )
    ),
  { functional: true }
)

export const addMediaToServerEmitUploadMediaResources$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(serverActions.addMediaToServer),
      map(({ request }) => mediaActions.uploadMediaResources({ request }))
    ),
  { functional: true }
)

export const deleteMediaFromServerEmitUpdateServer$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(serverActions.deleteMediaFromServer),
      map(({ server, request }) => {
        const media = [...server.media]
        media.splice(media.indexOf(request.id), 1)
        return serverActions.updateServer({ $id: server.$id, server: { media } })
      })
    ),
  { functional: true }
)

export const deleteMediaFromServerEmitUploadMediaResources$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(serverActions.deleteMediaFromServer),
      map(({ request }) => mediaActions.deleteMediaResource({ request }))
    ),
  { functional: true }
)

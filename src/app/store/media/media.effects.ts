import { inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { catchError, map, switchMap, repeat, filter } from 'rxjs/operators'
import { of } from 'rxjs'
import { mediaActions } from './media.actions'
import { MediaService } from '@services/media'
import { Store } from '@ngrx/store'
import { BytesPipe } from '@pipes/bytes'
import { mediaFeature } from './media.reducer'

export const getMedia$ = createEffect(
  (actions$ = inject(Actions), media = inject(MediaService)) =>
    actions$.pipe(
      ofType(mediaActions.getMedia),
      switchMap(({ request }) =>
        media.getMedia(request).pipe(
          map(media => mediaActions.getMediaSuccess({ media, request })),
          catchError(error => of(mediaActions.getMediaFailure({ request, error })))
        )
      ),
      repeat()
    ),
  { functional: true }
)

export const uploadMediaResources$ = createEffect(
  (actions$ = inject(Actions), mediaService = inject(MediaService), store = inject(Store), bytes = inject(BytesPipe)) =>
    actions$.pipe(
      ofType(mediaActions.uploadMediaResources),
      filter(({ request: { files } }) => files && files.length > 0),
      concatLatestFrom(({ request: { ids } }) => store.select(mediaFeature.selectMedia(ids))),
      switchMap(([{ request }, media]) => {
        const { entity, ids, files, fileIds, maxUploadSize } = request
        const currentMediaSize = media.map(m => m.sizeOriginal).reduce((accumulator, value) => accumulator + value, 0)
        const uploadedMediaSize = files.map(f => f.size).reduce((accumulator, value) => accumulator + value, 0)
        const totalSize = currentMediaSize + uploadedMediaSize
        if (maxUploadSize && totalSize > maxUploadSize)
          throw new Error(
            $localize`:@@exceeded-media-upload-size:Your upload failed since you went over the ${bytes.transform(maxUploadSize)} MiB limit by ${bytes.transform(totalSize - maxUploadSize)}`
          )
        return mediaService.uploadMedia({ entity, ids, files, fileIds }).pipe(
          map(media => mediaActions.uploadMediaResourcesSuccess({ media, entity, ids })),
          catchError(error => of(mediaActions.uploadMediaResourcesFailure({ request, error })))
        )
      }),
      repeat()
    ),
  { functional: true }
)

export const deleteMediaResource$ = createEffect(
  (actions$ = inject(Actions), media = inject(MediaService)) =>
    actions$.pipe(
      ofType(mediaActions.deleteMediaResource),
      switchMap(({ request }) => {
        const { id } = request
        return media.deleteMediaResource(request).pipe(
          map(() => id),
          map(id => mediaActions.deleteMediaResourceSuccess({ id })),
          catchError(error => of(mediaActions.deleteMediaResourceFailure({ id, error })))
        )
      }),
      repeat()
    ),
  { functional: true }
)

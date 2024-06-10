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
          map(media => mediaActions.getMediaSuccess({ media })),
          catchError(error => of(mediaActions.getMediaFailure({ request, error })))
        )
      ),
      repeat()
    ),
  { functional: true }
)

// export const getMediaSuccess$ = createEffect(
//   (actions$ = inject(Actions)) =>
//     actions$.pipe(
//       ofType(mediaActions.getMediaSuccess),
//       map(({ keys }) => mediaActions.getMediaResources({ keys }))
//     ),
//   { functional: true }
// )

// export const getMediaResources$ = createEffect(
//   (actions$ = inject(Actions), media = inject(MediaService)) =>
//     actions$.pipe(
//       ofType(mediaActions.getMediaResources),
//       switchMap(({ keys }) =>
//         forkJoin(
//           keys.map(key =>
//             media.getMediaResource(key).pipe(map(media => ({ key, size: media.size, blob: URL.createObjectURL(media) })))
//           )
//         ).pipe(
//           map(media => mediaActions.getMediaResourcesSuccess({ media })),
//           catchError(error => of(mediaActions.getMediaResourcesFailure({ keys, error })))
//         )
//       ),
//       repeat()
//     ),
//   { functional: true }
// )

export const uploadMediaResources$ = createEffect(
  (actions$ = inject(Actions), mediaService = inject(MediaService), store = inject(Store), bytes = inject(BytesPipe)) =>
    actions$.pipe(
      ofType(mediaActions.uploadMediaResources),
      filter(({ request: { files } }) => files && files.length > 0),
      concatLatestFrom(({ request: { entity, id } }) => store.select(mediaFeature.selectMedia({ entity, id }))),
      switchMap(([{ request }, media]) => {
        const { entity, id, files, maxUploadSize } = request
        const currentMediaSize = media.map(m => m.sizeOriginal).reduce((accumulator, value) => accumulator + value, 0)
        const uploadedMediaSize = files.map(f => f.size).reduce((accumulator, value) => accumulator + value, 0)
        const totalSize = currentMediaSize + uploadedMediaSize
        if (maxUploadSize && totalSize > maxUploadSize)
          throw new Error(
            $localize`:@@exceeded-media-upload-size:Your upload failed since you went over the ${bytes.transform(maxUploadSize)} MiB limit by ${bytes.transform(totalSize - maxUploadSize)}`
          )
        return mediaService.uploadMedia({ entity, id, files }).pipe(
          map(media => mediaActions.uploadMediaResourcesSuccess({ media, entity, id })),
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
      switchMap(({ path }) => {
        return media.deleteMediaResource(path).pipe(
          map(() => path),
          map(path => mediaActions.deleteMediaResourceSuccess({ path })),
          catchError(error => of(mediaActions.deleteMediaResourceFailure({ path, error })))
        )
      }),
      repeat()
    ),
  { functional: true }
)

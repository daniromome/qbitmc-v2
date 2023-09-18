import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { EnrollmentService } from '@services/enrollment'
import { ApplicationActions, applicationFeature } from '@store/application'
import { catchError, map, switchMap, tap, repeat } from 'rxjs/operators'
import { forkJoin, of } from 'rxjs'
import { Store } from '@ngrx/store'
import { MAX_UPLOAD_SIZE } from '@constants/index'
import { BytesPipe } from '@pipes/bytes'
import { AlertController, ToastController } from '@ionic/angular'

@Injectable()
export class ApplicationEffects {
  public getMedia$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.getMedia),
    switchMap(() => this.enrollment.getMedia()),
    map(({ keys }) => ApplicationActions.getMediaSuccess({ keys })),
    catchError(error => of(ApplicationActions.getMediaFailure({ error }))),
    repeat()
  ))

  public getMediaSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.getMediaSuccess),
    map(({ keys }) => ApplicationActions.getMediaResources({ keys }))
  ))

  public getMediaResources$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.getMediaResources),
    switchMap(({ keys }) =>
      forkJoin(keys.map(key => this.enrollment.getMediaResource(key).pipe(
        map(media => ({ key, size: media.size, blob: URL.createObjectURL(media) }))
      )))
    ),
    map(media => ApplicationActions.getMediaResourcesSuccess({ media })),
    catchError(error => of(ApplicationActions.getMediaResourcesFailure({ error }))),
    repeat()
  ))

  public uploadMediaResources$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.uploadMediaResources),
    concatLatestFrom(() => this.store.select(applicationFeature.selectApplicationMedia)),
    switchMap(([{ files }, media]) => {
      const currentMediaSize = media.map(m => m.size).reduce((accumulator, value) => accumulator + value, 0)
      const uploadedMediaSize = files.map(f => f.size).reduce((accumulator, value) => accumulator + value, 0)
      const totalSize = currentMediaSize + uploadedMediaSize
      if (totalSize > MAX_UPLOAD_SIZE)
        throw new Error($localize`Your upload failed since you went over the 25 MiB limit by ${this.bytes.transform(totalSize - MAX_UPLOAD_SIZE)}`)
      return this.enrollment.uploadMedia(files).pipe(
        map(keys => keys.map((key, i) => ({ key, size: files.at(i)!.size, blob: URL.createObjectURL(files.at(i)!) })))
      )
    }),
    map(media => ApplicationActions.uploadMediaResourcesSuccess({ media })),
    catchError(error => of(ApplicationActions.uploadMediaResourcesFailure({ error }))),
    repeat()
  ))

  public uploadMediaResourcesFailure$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.uploadMediaResourcesFailure),
    switchMap(({ error }) => this.alert.create({ buttons: ['OK'], message: error.message, header: 'Error' })),
    switchMap(alert => alert.present())
  ), { dispatch: false })

  public deleteMediaResource$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.deleteMediaResource),
    switchMap(({ key }) =>
      this.enrollment.deleteMediaResource(key.split('/')[2]).pipe(
        map(() => key)
      )
    ),
    map(key => ApplicationActions.deleteMediaResourceSuccess({ key })),
    catchError(error => of(ApplicationActions.deleteMediaResourceFailure({ error }))),
    repeat()
  ))

  public submit$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.submit),
    switchMap(action => this.enrollment.submit(action.application)),
    map(response => ApplicationActions.submitSuccess({ application: response })),
    catchError(error => of(ApplicationActions.submitFailure({ error }))),
    repeat()
  ))

  public submitSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.submitSuccess),
    tap(() => localStorage.removeItem('application'))
  ), { dispatch: false })

  public submitFailure$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.submitFailure),
    switchMap(() => this.toast.create({
      message: $localize`:@@submit-application-failure:An error ocurred while submitting your application, please try again later.`,
      buttons: ['OK'],
      duration: 4500
    })),
    switchMap(toast => toast.present())
  ), { dispatch: false })

  public constructor(
    private readonly actions$: Actions,
    private readonly enrollment: EnrollmentService,
    private readonly store: Store,
    private readonly bytes: BytesPipe,
    private readonly alert: AlertController,
    private readonly toast: ToastController
  ) {}
}

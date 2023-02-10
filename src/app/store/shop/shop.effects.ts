import { selectJWT } from '@selectors/app'
import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, from, zip } from 'rxjs'
import { ShopActions } from '@store/shop'
import { switchMap, tap } from 'rxjs/operators'
import { AlertController } from '@ionic/angular'
import { StripeService } from '@services/stripe'
import { Store } from '@ngrx/store'
import { SpinnerService } from '@services/spinner'

@Injectable()
export class ShopEffects {
  public getProducts$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.getProducts),
    switchMap(() => zip(this.stripe.products(), this.spinner.spin())),
    map(([response]) => ShopActions.getProductsSuccess({ products: response })),
    catchError(error => of(ShopActions.getProductsFailure({ error })))
  ))

  public getProductsSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.getProductsSuccess),
    switchMap(() => this.spinner.stop())
  ), { dispatch: false })

  public getProductsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.getProductsFailure),
    switchMap(() => this.spinner.stop()),
    switchMap(() => from(this.alert.create({
      header: $localize`:@@unexpectedError:Unexpected Error`,
      message: $localize`:@@contactAdmin:Please contact an administrator if this issue persists`,
      buttons: ['OK']
    })).pipe(
      switchMap(alert => from(alert.present()))
    ))
  ), { dispatch: false })

  public checkout$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.checkout),
    tap(() => this.spinner.spin().subscribe()),
    concatLatestFrom(() => this.store.select(selectJWT)),
    switchMap(([{ price }, jwt]) => this.stripe.checkout(jwt, price)),
    map(url => ShopActions.checkoutSuccess({ url })),
    catchError(() => of(ShopActions.checkoutFailure()))
  ))

  public checkoutSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.checkoutSuccess),
    tap(({ url }) => window.open(url, '_self')),
    switchMap(() => this.spinner.stop())
  ), { dispatch: false })

  public checkoutFailure$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.checkoutFailure),
    switchMap(() => this.spinner.stop())
  ), { dispatch: false })

  public portal$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.portal),
    tap(() => this.spinner.spin().subscribe()),
    concatLatestFrom(() => this.store.select(selectJWT)),
    switchMap(([_, jwt]) => this.stripe.portal(jwt)),
    map(url => ShopActions.portalSuccess({ url })),
    catchError(() => of(ShopActions.portalFailure()))
  ))

  public portalSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.portalSuccess),
    tap(({ url }) => window.open(url, '_self')),
    switchMap(() => this.spinner.stop())
  ), { dispatch: false })

  public portalFailure$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.portalFailure),
    switchMap(() => this.spinner.stop())
  ), { dispatch: false })

  public constructor(
    private readonly actions$: Actions,
    private readonly stripe: StripeService,
    private readonly alert: AlertController,
    private readonly store: Store,
    private readonly spinner: SpinnerService
  ) {}
}

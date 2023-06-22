import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, from, zip } from 'rxjs'
import { ShopActions } from '@store/shop'
import { repeat, switchMap, tap } from 'rxjs/operators'
import { AlertController, NavController, ToastController } from '@ionic/angular'
import { StripeService } from '@services/stripe'
import { Store } from '@ngrx/store'
import { SpinnerService } from '@services/spinner'
import { selectCustomer, selectIsRole, selectIsSignedIn } from '@selectors/app';

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
    switchMap(({ price }) => this.stripe.checkout(price)),
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
    concatLatestFrom(() => this.store.select(selectCustomer)),
    switchMap(([_, customer]) => this.stripe.portal(customer)),
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

  public subscribe$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.subscribe),
    concatLatestFrom(() => zip(
      this.store.select(selectIsRole('supporter')),
      this.store.select(selectIsRole('qbitor')),
      this.store.select(selectIsSignedIn)
    )),
    map(([{ price }, [isSupporter, isQbitor, isSignedIn]]) => {
      if (isSupporter) {
        return ShopActions.portal()
      }
      if (isQbitor) {
        return ShopActions.checkout({ price })
      }
      return ShopActions.auth({ isSignedIn })
    })
  ))

  public auth$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.auth),
    switchMap(({ isSignedIn }) =>
      from(isSignedIn
        ? this.nav.navigateForward(['tabs', 'join'])
        : this.nav.navigateForward(['auth'])
      ).pipe(
        switchMap(() => from(this.toast.create({
          message: isSignedIn
            ? $localize`:@@shop-insufficient-permissions:You need to apply and be accepted in order to use the shop`
            : $localize`:@@shop-not-signed-in:You need to be signed-in in to use the shop`,
          buttons: ['OK'],
          duration: 4500
        })).pipe(
          switchMap(toast => toast.present())
        ))
      )
    ),
    repeat()
  ), { dispatch: false })

  public constructor(
    private readonly actions$: Actions,
    private readonly stripe: StripeService,
    private readonly alert: AlertController,
    private readonly store: Store,
    private readonly spinner: SpinnerService,
    private readonly nav: NavController,
    private readonly toast: ToastController
  ) {}
}

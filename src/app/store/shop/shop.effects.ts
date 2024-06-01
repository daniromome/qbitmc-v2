import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, from, zip } from 'rxjs'
import { ShopActions } from '@store/shop'
import { repeat, switchMap, tap } from 'rxjs/operators'
import { AlertController, NavController, ToastController } from '@ionic/angular'
import { StripeService } from '@services/stripe'
import { Store } from '@ngrx/store'
import { appFeature } from '@store/app'
import { ROLE } from '@models/role'

@Injectable()
export class ShopEffects {
  public getProducts$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.getProducts),
    switchMap(() => this.stripe.products()),
    map((response) => ShopActions.getProductsSuccess({ products: response })),
    catchError(error => of(ShopActions.getProductsFailure({ error })))
  ))

  public getProductsSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.getProductsSuccess),
  ), { dispatch: false })

  public getProductsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.getProductsFailure),
    switchMap(() => from(this.alert.create({
      header: $localize`:@@unexpected-error-title:Unexpected Error`,
      message: $localize`:@@unexpected-error-message:Please contact an administrator if this issue persists`,
      buttons: ['OK']
    })).pipe(
      switchMap(alert => from(alert.present()))
    ))
  ), { dispatch: false })

  public checkout$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.checkout),
    switchMap(({ price }) => this.stripe.checkout(price)),
    map(url => ShopActions.checkoutSuccess({ url })),
    catchError(() => of(ShopActions.checkoutFailure())),
    repeat()
  ))

  public checkoutSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.checkoutSuccess),
    tap(({ url }) => window.open(url, '_self')),
  ), { dispatch: false })

  public checkoutFailure$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.checkoutFailure),
  ), { dispatch: false })

  public portal$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.portal),
    concatLatestFrom(() => this.store.select(appFeature.selectCustomer)),
    switchMap(([_, customer]) => this.stripe.portal(customer)),
    map(url => ShopActions.portalSuccess({ url })),
    catchError(() => of(ShopActions.portalFailure())),
    repeat()
  ))

  public portalSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.portalSuccess),
    tap(({ url }) => window.open(url, '_self')),
  ), { dispatch: false })

  public portalFailure$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.portalFailure),
  ), { dispatch: false })

  public subscribe$ = createEffect(() => this.actions$.pipe(
    ofType(ShopActions.subscribe),
    concatLatestFrom(() => zip(
      this.store.select(appFeature.selectIsRole(ROLE.SUPPORTER)),
      this.store.select(appFeature.selectIsRole(ROLE.QBITOR)),
      this.store.select(appFeature.selectIsSignedIn)
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
    private readonly nav: NavController,
    private readonly toast: ToastController
  ) {}
}

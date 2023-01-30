import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, from, EMPTY } from 'rxjs'
import { AppActions } from '@store/app'
import { switchMap } from 'rxjs/operators'
import { NavController, AlertController, ToastController } from '@ionic/angular'
import { AuthService } from '@services/auth'
import { ActivatedRoute, Router } from '@angular/router'
import { PreferencesService } from '@services/preferences'
import { ApplicationActions } from '@store/application'
import { QbitmcService } from '@services/qbitmc'

@Injectable()
export class AppEffects {
  public login$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.login),
    switchMap(() => this.auth.signIn())
  ), { dispatch: false })

  public autoLogin$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.autoLogin),
    switchMap(() => this.auth.getSession()),
    map(session => AppActions.autoLoginMiddleware({ session }))
  ))

  public loginMiddleware$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.loginMiddleware),
    switchMap(action => {
      if (!action.session) throw new Error()
      this.preferences.delete('redirected')
      return this.auth.getUser(action.session.user)
    }),
    map(user => AppActions.loginSuccess({ user })),
    catchError(error => of(AppActions.loginFailure({ error })))
  ))

  public autologinMiddleware$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.autoLoginMiddleware),
    switchMap(action => {
      if (!action.session) throw new Error()
      this.preferences.delete('redirected')
      return this.auth.getUser(action.session.user)
    }),
    map(user => AppActions.loginSuccess({ user })),
    catchError(error => of(AppActions.autologinFailure({ error })))
  ))

  public loginFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.loginFailure),
    switchMap(() => this.route.queryParams),
    switchMap(params => {
      // eslint-disable-next-line dot-notation
      const error = [params['error'], params['error_description']]
      if (error[0] && typeof error[0] === 'string') error[0] = error[0].replaceAll('_', ' ').toLocaleUpperCase()
      return from(
        this.alert.create({
          header: error[0] || $localize`:@@unexpectedError:Unexpected Error`,
          message: error[1] || $localize`:@@contactAdmin:Please contact an administrator if this issue persists`
        })
      ).pipe(
        switchMap(alert => from(alert.present()))
      )
    })
  ), { dispatch: false })

  public logout$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.logout),
    switchMap(() => this.auth.signOut()),
    switchMap(() => from(this.nav.navigateRoot('/tabs/home')))
  ), { dispatch: false })

  public loginSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.loginSuccess),
    switchMap(() => {
      const url = this.router.url.split('/')
      url.pop()
      return this.router.url === '/tabs/home' ? EMPTY : from(this.nav.navigateBack(url))
    })
  ), { dispatch: false })

  public applicationSubmit$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.submitSuccess),
    map(action => AppActions.submittedApplication({ application: action.application }))
  ))

  public applicationSubmitFailure$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.submitFailure),
    switchMap(() => from(this.alert.create({
      header: $localize`:@@errorTitle:Error`,
      message: $localize`There was an error while submitting your application,
      you'll be logged out in order to circunvent this issue. Please try again.`,
      buttons: ['OK']
    }))),
    switchMap(alert => from(alert.present())),
    map(() => AppActions.logout())
  ))

  public submittedApplication$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.submittedApplication),
    switchMap(() => from(this.nav.navigateForward('/tabs/join/status')))
  ), { dispatch: false })

  public getLeaderboards$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.getLeaderboards),
    switchMap(() => this.qbitmc.leaderboards()),
    map(leaderboards => AppActions.getLeaderboardsSuccess({ leaderboards })),
    catchError(error => of(AppActions.getLeaderboardsFailure({ error })))
  ))

  public getLeaderboardsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.getLeaderboardsFailure),
    switchMap(() => from(this.toast.create({
      message: $localize`There was an error loading leaderboards, please try again later`,
      buttons: ['OK'],
      duration: 3000
    })).pipe(switchMap(toast => from(toast.present()))))
  ), { dispatch: false })

  public getSupporters$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.getSupporters),
    switchMap(() => this.qbitmc.supporters()),
    map(supporters => AppActions.getSupportersSuccess({ supporters })),
    catchError(error => of(AppActions.getSupportersFailure({ error })))
  ))

  public getSupportersFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.getSupportersFailure),
    switchMap(() => from(this.toast.create({
      message: $localize`There was an error loading supporters list, please try again later`,
      buttons: ['OK'],
      duration: 3000
    })).pipe(switchMap(toast => from(toast.present()))))
  ), { dispatch: false })

  public constructor(
    private readonly actions$: Actions,
    private readonly auth: AuthService,
    private readonly nav: NavController,
    private readonly alert: AlertController,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly preferences: PreferencesService,
    private readonly qbitmc: QbitmcService,
    private readonly toast: ToastController
  ) {}
}

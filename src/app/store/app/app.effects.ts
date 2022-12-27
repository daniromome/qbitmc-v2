import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, from } from 'rxjs'
import { AppActions } from '@store/app'
import { switchMap } from 'rxjs/operators'
import { NavController, AlertController } from '@ionic/angular'
import { AuthService } from '@services/auth'
import { ActivatedRoute } from '@angular/router'
import { PreferencesService } from '@services/preferences'

@Injectable()
export class AppEffects {
  public login$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.login),
    switchMap(() => this.auth.signIn())
  ), { dispatch: false })

  public autoLogin$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.autoLogin),
    switchMap(() => this.auth.getSession()),
    map(session => AppActions.loginMiddleware({ session }))
  ))

  public loginMiddleware$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.loginMiddleware),
    switchMap(action => {
      if (!action.session) throw new Error()
      this.preferences.delete('redirected')
      return this.auth.getProfile(action.session.user)
    }),
    map(profile => AppActions.loginSuccess({ profile })),
    catchError(() => of(AppActions.loginFailure))
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
          header: error[0] || $localize`Unexpected Error`,
          message: error[1] || $localize`Please contact an administrator if this issue persists`
        })
      ).pipe(
        switchMap(alert => from(alert.present()))
      )
    })
  ), { dispatch: false })

  public logout$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.logout),
    switchMap(() => this.auth.signOut()),
    switchMap(() => from(this.nav.navigateRoot('/home')))
  ), { dispatch: false })

  public constructor(
    private readonly actions$: Actions,
    private readonly auth: AuthService,
    private readonly nav: NavController,
    private readonly alert: AlertController,
    private readonly route: ActivatedRoute,
    private readonly preferences: PreferencesService
  ) {}
}

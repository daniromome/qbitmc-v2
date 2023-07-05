import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, from } from 'rxjs'
import { AppActions } from '@store/app'
import { filter, repeat, switchMap, tap, withLatestFrom } from 'rxjs/operators'
import { NavController, AlertController, ToastController } from '@ionic/angular'
import { AuthService } from '@services/auth'
import { ApplicationActions } from '@store/application'
import { QbitmcService } from '@services/qbitmc'
import { OidcSecurityService } from 'angular-auth-oidc-client'
import { Store } from '@ngrx/store'
import { selectIsRole, selectPendingChanges, selectProfile } from '@selectors/app'
import { Router } from '@angular/router'

@Injectable()
export class AppEffects {
  public initialize$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.initialize),
    switchMap(() => this.oidcSecurityService.checkAuth()),
    map(response => AppActions.getProfile({ token: response.accessToken }))
  ))

  public getProfile$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.getProfile),
    switchMap(({ token }) => {
      if (!token) throw new Error('User is not signed in')
      return this.auth.getProfile()
    }),
    map(profile => AppActions.getProfileSuccess({ profile })),
    catchError(error => of(AppActions.getProfileFailure({ error })))
  ))

  public getProfileSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.getProfileSuccess),
    filter(({ profile }) => profile.disabled),
    switchMap(() => this.alert.create({
      header: $localize`Account Disabled`,
      message: $localize`Your account has been deactivated, get in touch with an administrator to get it restored`,
      buttons: ['OK']
    })),
    switchMap(alert => alert.present())
  ), { dispatch: false })

  // public getProfileFailure$ = createEffect(() => this.actions$.pipe(
  //   ofType(AppActions.getProfileFailure),
  //   switchMap(() => from(this.alert.create({
  //     header: $localize`:@@unexpectedError:Unexpected Error`,
  //     message: $localize`:@@contactAdmin:Please contact an administrator if this issue persists`
  //   })).pipe(
  //     switchMap(alert => from(alert.present()))
  //   ))
  // ), { dispatch: false })

  public login$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.login),
    tap(() => this.oidcSecurityService.authorize())
  ), { dispatch: false })

  public linkMinecraftAccount$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.linkMinecraftAccount),
    withLatestFrom(this.oidcSecurityService.getAccessToken()),
    switchMap(([ _action, token ]) => this.auth.linkMcAccount(token))
  ), { dispatch: false })

  public logout$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.logout),
    switchMap(() => this.oidcSecurityService.logoffAndRevokeTokens()),
    switchMap(() => from(this.nav.navigateRoot('/tabs/home')))
  ), { dispatch: false })

  public applicationSubmit$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.submitSuccess),
    map(action => AppActions.submittedApplication({ application: action.application }))
  ))

  public submittedApplication$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.submittedApplication),
    switchMap(() => this.nav.navigateForward('/tabs/join/status'))
  ), { dispatch: false })

  // public getLeaderboards$ = createEffect(() => this.actions$.pipe(
  //   ofType(AppActions.getLeaderboards),
  //   switchMap(() => this.qbitmc.leaderboards()),
  //   map(leaderboards => AppActions.getLeaderboardsSuccess({ leaderboards })),
  //   catchError(error => of(AppActions.getLeaderboardsFailure({ error })))
  // ))

  // public getLeaderboardsFailure$ = createEffect(() => this.actions$.pipe(
  //   ofType(AppActions.getLeaderboardsFailure),
  //   switchMap(() => this.toast.create({
  //     message: $localize`There was an error loading leaderboards, please try again later`,
  //     buttons: ['OK'],
  //     duration: 3000
  //   })),
  //   switchMap(toast => toast.present())
  // ), { dispatch: false })

  public getSupporters$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.initialize),
    switchMap(() => this.qbitmc.supporters()),
    map(supporters => AppActions.getSupportersSuccess({ supporters })),
    catchError(error => of(AppActions.getSupportersFailure({ error })))
  ))

  public getSupportersFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.getSupportersFailure),
    switchMap(() => this.toast.create({
      message: $localize`:@@list-supporters-error:There was an error loading supporters list, please try again later`,
      buttons: ['OK'],
      duration: 3000
    })),
    switchMap(toast => from(toast.present()))
  ), { dispatch: false })

  public getServers$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.initialize),
    switchMap(() => this.qbitmc.servers()),
    map(servers => AppActions.getServersSuccess({ servers })),
    catchError(error => of(AppActions.getServersFailure({ error })))
  ))

  public getServersFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.getServersFailure),
    switchMap(() => this.toast.create({
      message: $localize`:@@list-servers-error:There was an error loading servers list, please try again later`,
      buttons: ['OK'],
      duration: 3000
    })),
    switchMap(toast => from(toast.present()))
  ), { dispatch: false })

  public navigateToNicknameEditor$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.navigateToNicknameEditor),
    concatLatestFrom(() => this.store.select(selectIsRole('supporter'))),
    switchMap(([_, isSupporter]) => isSupporter
      ? this.nav.navigateForward(['tabs', 'profile', 'nickname'])
      : this.nav.navigateBack(['tabs', 'shop'])
    )
  ), { dispatch: false })

  public navigateBack$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.navigateBack),
    concatLatestFrom(() => this.store.select(selectPendingChanges)),
    switchMap(([action, pendingChanges]) => {
      if (pendingChanges) {
        return from(
          this.alert.create({
            buttons: [ { text: 'Confirm', role: 'confirm' }, { text: 'Cancel', role: 'cancel' } ],
            header: 'Warning',
            message: 'You have unsaved changes, are you sure you want to go back?'
          })
        ).pipe(
          switchMap(alert => from(alert.present()).pipe(switchMap(() => alert.onWillDismiss()))),
          switchMap(event => {
            if (event.role === 'cancel') return of(AppActions.setUnsavedChanges({ changes: true }))
            return this.navigateBack()
          })
        )
      }
      return this.navigateBack()
    })
  ))

  public updateNickname$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.updateNickname),
    concatLatestFrom(() => this.store.select(selectProfile)),
    switchMap(([action, profile]) => {
      return this.auth.updateProfile({ ...profile!, nickname: action.nickname })
    }),
    map(profile => AppActions.updateNicknameSuccess({ profile })),
    catchError(error => of(AppActions.updateNicknameFailure({ error }))),
    repeat()
  ))

  public updateNicknameSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.updateNicknameSuccess),
    switchMap(() => this.navigateBack())
  ))

  public constructor(
    private readonly actions$: Actions,
    private readonly auth: AuthService,
    private readonly nav: NavController,
    private readonly alert: AlertController,
    private readonly qbitmc: QbitmcService,
    private readonly toast: ToastController,
    private readonly oidcSecurityService: OidcSecurityService,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  private navigateBack() {
    const route = this.router.url.split('/').slice(1, -1)
    return from(this.nav.navigateBack(route)).pipe(map(() => AppActions.setUnsavedChanges({ changes: false })))
  }
}

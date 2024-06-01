import { inject } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, from } from 'rxjs'
import { appActions, appFeature } from '@store/app'
import { exhaustMap, filter, repeat, switchMap } from 'rxjs/operators'
import { NavController, AlertController, ToastController } from '@ionic/angular'
import { AuthService } from '@services/auth'
import { applicationActions } from '@store/application'
import { QbitmcService } from '@services/qbitmc'
import { Store } from '@ngrx/store'
import { Router } from '@angular/router'
import { OidcSecurityService } from 'angular-auth-oidc-client'
import { ROLE } from '@models/role'
import { ServerService } from '@services/server'

export const initialize$ = createEffect(
  (actions$ = inject(Actions), oidc = inject(OidcSecurityService)) =>
    actions$.pipe(
      ofType(appActions.initialize),
      switchMap(() => oidc.checkAuth()),
      map(() => appActions.getProfile())
    ),
  { functional: true }
)

export const getProfile$ = createEffect(
  (actions$ = inject(Actions), auth = inject(AuthService)) =>
    actions$.pipe(
      ofType(appActions.getProfile),
      switchMap(() => auth.getProfile()),
      map(profile => appActions.getProfileSuccess({ profile })),
      catchError(error => of(appActions.getProfileFailure({ error })))
    ),
  { functional: true }
)

export const getProfileSuccess$ = createEffect(
  (actions$ = inject(Actions), alert = inject(AlertController)) =>
    actions$.pipe(
      ofType(appActions.getProfileSuccess),
      filter(({ profile }) => profile.disabled),
      switchMap(() => alert.create({
        header: $localize`:@@account-disabled-title:Account Disabled`,
        message: $localize`:@@account-disabled-message:Your account has been deactivated, get in touch with an administrator to get it restored`,
        buttons: ['OK']
      })),
      switchMap(alert => alert.present())
    ),
  { functional: true, dispatch: false }
)

// export const getProfileFailure$ = createEffect(() => actions$.pipe(
//   ofType(appActions.getProfileFailure),
//   switchMap(() => from(alert.create({
//     header: $localize`:@@unexpected-error-title:Unexpected Error`,
//     message: $localize`:@@unexpected-error-message:Please contact an administrator if this issue persists`
//   })).pipe(
//     switchMap(alert => from(alert.present()))
//   ))
// ), { dispatch: false })

export const login$ = createEffect(
  (actions$ = inject(Actions), oidc = inject(OidcSecurityService)) =>
    actions$.pipe(
      ofType(appActions.login),
      exhaustMap(() => of(oidc.authorize()))
    ),
  { functional: true, dispatch: false }
)

export const linkMinecraftAccount$ = createEffect(
  (actions$ = inject(Actions), oidc = inject(OidcSecurityService), auth = inject(AuthService)) =>
    actions$.pipe(
      ofType(appActions.linkMinecraftAccount),
      switchMap(() => oidc.getAccessToken()),
      filter(token => !!token),
      switchMap(token => auth.linkMcAccount(token))
    ),
  { functional: true, dispatch: false }
)

export const logout$ = createEffect(
  (actions$ = inject(Actions), oidc = inject(OidcSecurityService)) =>
    actions$.pipe(
      ofType(appActions.logout),
      switchMap(() => oidc.logoffAndRevokeTokens()),
      map(() => appActions.logoutDone())
    ),
  { functional: true }
)

export const logoutDone$ = createEffect(
  (actions$ = inject(Actions), nav = inject(NavController)) =>
    actions$.pipe(
      ofType(appActions.logoutDone),
      switchMap(() => nav.navigateRoot(['tabs', 'home']))
    ),
  { functional: true, dispatch: false }
)

export const applicationSubmit$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(applicationActions.submitSuccess),
      map(action => appActions.submittedApplication({ application: action.application }))
    ),
  { functional: true }
)

export const submittedApplication$ = createEffect(
  (actions$ = inject(Actions), nav = inject(NavController)) =>
    actions$.pipe(
      ofType(appActions.submittedApplication),
      switchMap(() => nav.navigateForward(['tabs', 'join', 'status']))
    ),
  { functional: true, dispatch: false }
)

// public getLeaderboards$ = createEffect(() => actions$.pipe(
//   ofType(appActions.getLeaderboards),
//   switchMap(() => qbitmc.leaderboards()),
//   map(leaderboards => appActions.getLeaderboardsSuccess({ leaderboards })),
//   catchError(error => of(appActions.getLeaderboardsFailure({ error })))
// ))

// public getLeaderboardsFailure$ = createEffect(() => actions$.pipe(
//   ofType(appActions.getLeaderboardsFailure),
//   switchMap(() => toast.create({
//     message: $localize`There was an error loading leaderboards, please try again later`,
//     buttons: ['OK'],
//     duration: 3000
//   })),
//   switchMap(toast => toast.present())
// ), { dispatch: false })

export const getSupporters$ = createEffect(
  (actions$ = inject(Actions), qbitmc = inject(QbitmcService)) =>
    actions$.pipe(
      ofType(appActions.initialize),
      switchMap(() => qbitmc.supporters()),
      map(supporters => appActions.getSupportersSuccess({ supporters })),
      catchError(error => of(appActions.getSupportersFailure({ error })))
    ),
  { functional: true }
)

export const getSupportersFailure$ = createEffect(
  (actions$ = inject(Actions), toast = inject(ToastController)) =>
    actions$.pipe(
      ofType(appActions.getSupportersFailure),
      switchMap(() => toast.create({
        message: $localize`:@@list-supporters-error:There was an error loading supporters list, please try again later`,
        buttons: ['OK'],
        duration: 3000
      })),
      switchMap(toast => from(toast.present()))
    ),
  { functional: true, dispatch: false }
)

export const getServers$ = createEffect(
  (actions$ = inject(Actions), serverService = inject(ServerService)) =>
    actions$.pipe(
      ofType(appActions.initialize),
      switchMap(() => serverService.list()),
      map(servers => appActions.getServersSuccess({ servers })),
      catchError(error => of(appActions.getServersFailure({ error })))
    ),
  { functional: true }
)

export const getServersFailure$ = createEffect(
  (actions$ = inject(Actions), toast = inject(ToastController)) =>
    actions$.pipe(
      ofType(appActions.getServersFailure),
      switchMap(() => toast.create({
        message: $localize`:@@list-servers-error:There was an error loading servers list, please try again later`,
        buttons: ['OK'],
        duration: 3000
      })),
      switchMap(toast => from(toast.present()))
    ),
  { functional: true, dispatch: false }
)

export const navigateToNicknameEditor$ = createEffect(
  (actions$ = inject(Actions), nav = inject(NavController), store = inject(Store)) =>
    actions$.pipe(
      ofType(appActions.navigateToNicknameEditor),
      concatLatestFrom(() => store.select(appFeature.selectIsRole(ROLE.SUPPORTER))),
      switchMap(([_, isSupporter]) => isSupporter
        ? nav.navigateForward(['tabs', 'profile', 'nickname'])
        : nav.navigateBack(['tabs', 'shop'])
      )
    ),
  { functional: true, dispatch: false }
)

export const navigateBack$ = createEffect(
  (
    actions$ = inject(Actions),
    nav = inject(NavController),
    store = inject(Store),
    router = inject(Router),
    alert = inject(AlertController)
  ) =>
    actions$.pipe(
      ofType(appActions.navigateBack),
      concatLatestFrom(() => store.select(appFeature.selectChanges)),
      switchMap(([_action, pendingChanges]) => {
        const route = router.url.split('/').slice(1, -1)
        const back = from(nav.navigateBack(route)).pipe(map(() => appActions.setUnsavedChanges({ changes: false })))
        if (pendingChanges) {
          return from(
            alert.create({
              buttons: [{ text: 'Confirm', role: 'confirm' }, { text: 'Cancel', role: 'cancel' }],
              header: 'Warning',
              message: 'You have unsaved changes, are you sure you want to go back?'
            })
          ).pipe(
            switchMap(alert => from(alert.present()).pipe(switchMap(() => alert.onWillDismiss()))),
            switchMap(event => {
              if (event.role === 'cancel') return of(appActions.setUnsavedChanges({ changes: true }))
              return back
            })
          )
        }
        return back
      })
    ),
  { functional: true }
)

export const updateNickname$ = createEffect(
  (actions$ = inject(Actions), auth = inject(AuthService), store = inject(Store)) =>
    actions$.pipe(
      ofType(appActions.updateNickname),
      concatLatestFrom(() => store.select(appFeature.selectProfile)),
      switchMap(([action, profile]) => {
        return auth.updateProfile({ ...profile!, nickname: action.nickname })
      }),
      map(profile => appActions.updateNicknameSuccess({ profile })),
      catchError(error => of(appActions.updateNicknameFailure({ error }))),
      repeat()
    ),
  { functional: true }
)

export const updateNicknameSuccess$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(appActions.updateNicknameSuccess),
      map(() => appActions.navigateBack())
    ),
  { functional: true }
)

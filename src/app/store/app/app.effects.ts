import { inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { catchError, map, of, from } from 'rxjs'
import { appActions, appFeature } from '@store/app'
import { exhaustMap, filter, repeat, switchMap } from 'rxjs/operators'
import { NavController, AlertController, ToastController } from '@ionic/angular'
import { AuthService } from '@services/auth'
import { QbitmcService } from '@services/qbitmc'
import { Store } from '@ngrx/store'
import { Router } from '@angular/router'
import { USER_LABEL } from '@qbitmc/common'
import { ServerService } from '@services/server'
import { applicationActions } from '@store/application'
import { selectUrl } from '@store/router'

export const initialize$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(appActions.initialize),
      map(() => appActions.getSession())
    ),
  { functional: true }
)

export const getSession$ = createEffect(
  (actions$ = inject(Actions), auth = inject(AuthService)) =>
    actions$.pipe(
      ofType(appActions.getSession),
      switchMap(() => auth.getSession()),
      map(session => appActions.getSessionSuccess({ session })),
      catchError(error => of(appActions.getSessionFailure({ error })))
    ),
  { functional: true }
)

export const getSessionSuccessEmitGetUser$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(appActions.getSessionSuccess),
      map(() => appActions.getUser())
    ),
  { functional: true }
)

export const getUser$ = createEffect(
  (actions$ = inject(Actions), auth = inject(AuthService)) =>
    actions$.pipe(
      ofType(appActions.getUser),
      exhaustMap(() => auth.getUser()),
      map(user => appActions.getUserSuccess({ user })),
      catchError(error => of(appActions.getUserFailure({ error })))
    ),
  { functional: true }
)

export const getUserSuccess$ = createEffect(
  (actions$ = inject(Actions), alert = inject(AlertController)) =>
    actions$.pipe(
      ofType(appActions.getUserSuccess),
      filter(({ user }) => user.labels.includes(USER_LABEL.DISABLED)),
      switchMap(() =>
        alert.create({
          header: $localize`:@@account-disabled-title:Account Disabled`,
          message: $localize`:@@account-disabled-message:Your account has been deactivated, get in touch with an administrator to get it restored`,
          buttons: ['OK']
        })
      ),
      switchMap(alert => alert.present())
    ),
  { functional: true, dispatch: false }
)

export const getSessionSuccessEmitGetProfile$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(appActions.getSessionSuccess),
      filter(({ session }) => session.provider === 'discord'),
      map(({ session }) => appActions.getProfile({ id: session.userId }))
    ),
  { functional: true }
)

export const getProfile$ = createEffect(
  (actions$ = inject(Actions), auth = inject(AuthService)) =>
    actions$.pipe(
      ofType(appActions.getProfile),
      switchMap(({ id }) => auth.getProfile(id)),
      map(profile => appActions.getProfileSuccess({ profile })),
      catchError(error => of(appActions.getProfileFailure({ error })))
    ),
  { functional: true }
)

export const getProfileSuccessEmitGetApplication$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
      ofType(appActions.getProfileSuccess),
      concatLatestFrom(() => store.select(selectUrl)),
      filter(([_, url]) => url.includes('join')),
      map(() => applicationActions.get())
    ),
  { functional: true }
)

export const getProfileFailure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(appActions.getProfileFailure),
      map(() => appActions.createProfile())
    ),
  { functional: true }
)

export const createProfile$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), auth = inject(AuthService)) =>
    actions$.pipe(
      ofType(appActions.createProfile),
      concatLatestFrom(() => store.select(appFeature.selectSession)),
      exhaustMap(([_, session]) => auth.createProfile(session!.providerAccessToken)),
      map(profile => appActions.createProfileSuccess({ profile }))
    ),
  { functional: true }
)

export const login$ = createEffect(
  (actions$ = inject(Actions), auth = inject(AuthService)) =>
    actions$.pipe(
      ofType(appActions.login),
      exhaustMap(() => auth.authenticate())
    ),
  { functional: true, dispatch: false }
)

export const minecraftAccountVerification$ = createEffect(
  (actions$ = inject(Actions), auth = inject(AuthService)) =>
    actions$.pipe(
      ofType(appActions.minecraftAccountVerification),
      switchMap(({ code }) => auth.minecraftAccountVerification(code)),
      map(player => appActions.minecraftAccountVerificationSuccess({ player })),
      catchError(error => of(appActions.minecraftAccountVerificationFailure({ error }))),
      repeat()
    ),
  { functional: true }
)

// export const logout$ = createEffect(
//   (actions$ = inject(Actions), oidc = inject(OidcSecurityService)) =>
//     actions$.pipe(
//       ofType(appActions.logout),
//       switchMap(() => oidc.logoffAndRevokeTokens()),
//       map(() => appActions.logoutDone())
//     ),
//   { functional: true }
// )

export const logoutDone$ = createEffect(
  (actions$ = inject(Actions), nav = inject(NavController)) =>
    actions$.pipe(
      ofType(appActions.logoutDone),
      switchMap(() => nav.navigateRoot(['tabs', 'home']))
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
      switchMap(() =>
        toast.create({
          message: $localize`:@@list-supporters-error:There was an error loading supporters list, please try again later`,
          buttons: ['OK'],
          duration: 3000
        })
      ),
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
      switchMap(() =>
        toast.create({
          message: $localize`:@@list-servers-error:There was an error loading servers list, please try again later`,
          buttons: ['OK'],
          duration: 3000
        })
      ),
      switchMap(toast => from(toast.present()))
    ),
  { functional: true, dispatch: false }
)

export const navigateToNicknameEditor$ = createEffect(
  (actions$ = inject(Actions), nav = inject(NavController), store = inject(Store)) =>
    actions$.pipe(
      ofType(appActions.navigateToNicknameEditor),
      concatLatestFrom(() => store.select(appFeature.selectIsRole(USER_LABEL.SUPPORTER))),
      switchMap(([_, isSupporter]) =>
        isSupporter ? nav.navigateForward(['tabs', 'profile', 'nickname']) : nav.navigateBack(['tabs', 'shop'])
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
              buttons: [
                { text: 'Confirm', role: 'confirm' },
                { text: 'Cancel', role: 'cancel' }
              ],
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
      concatLatestFrom(() => store.select(appFeature.selectUser)),
      switchMap(([action, user]) => {
        return auth.updatePreferences({ ...user!.prefs, nickname: action.nickname })
      }),
      map(user => appActions.updateNicknameSuccess({ user })),
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

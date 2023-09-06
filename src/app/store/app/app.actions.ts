import { EnrollmentApplication } from '@models/application'
import { KeycloakToken, Profile } from '@models/profile'
import { createAction, props } from '@ngrx/store'
import { Leaderboards } from '@models/leaderboards'
import { MinecraftProfile } from '@models/minecraft-profile'
import { Server } from '@models/server'

export const initialize = createAction(
  '[App] Initialize Application'
)

export const login = createAction(
  '[App] Login'
)

export const getProfile = createAction(
  '[App] Get Profile'
)

export const getProfileSuccess = createAction(
  '[App] Get Profile Success',
  props<{ profile: Profile }>()
)

export const getProfileFailure = createAction(
  '[App] Get Profile Failure',
  props<{ error: Error }>()
)

export const linkMinecraftAccount = createAction(
  '[App] Link minecraft account'
)

export const logout = createAction(
  '[App] Logout'
)

export const logoutDone = createAction(
  '[App] Logout Done'
)

export const submittedApplication = createAction(
  '[App] Submitted Application',
  props<{ application: Required<EnrollmentApplication> }>()
)

export const getLeaderboards = createAction(
  '[App] Get Leaderboards'
)
export const getLeaderboardsSuccess = createAction(
  '[App] Get Leaderboards Success',
  props<{ leaderboards: Leaderboards }>()
)
export const getLeaderboardsFailure = createAction(
  '[App] Get Leaderboards Failure',
  props<{ error: Error }>()
)

export const getSupporters = createAction(
  '[App] Get Supporters'
)
export const getSupportersSuccess = createAction(
  '[App] Get Supporters Success',
  props<{ supporters: MinecraftProfile[] }>()
)
export const getSupportersFailure = createAction(
  '[App] Get Supporters Failure',
  props<{ error: Error }>()
)

export const getServers = createAction(
  '[App] Get Servers'
)
export const getServersSuccess = createAction(
  '[App] Get Servers Success',
  props<{ servers: Server[] }>()
)
export const getServersFailure = createAction(
  '[App] Get Servers Failure',
  props<{ error: Error }>()
)

export const navigateToNicknameEditor = createAction(
  '[App] Navigate to Nickname Editor'
)

export const setUnsavedChanges = createAction(
  '[App] Set Unsaved Changes',
  props<{ changes: boolean }>()
)

export const navigateBack = createAction(
  '[App] Navigate Back'
)

export const updateNickname = createAction(
  '[App] Update Nickname',
  props<{ nickname: string }>()
)
export const updateNicknameSuccess = createAction(
  '[App] Update Nickname Success',
  props<{ profile: Profile }>()
)
export const updateNicknameFailure = createAction(
  '[App] Update Nickname Failure',
  props<{ error: Error }>()
)

export const setAccessToken = createAction(
  '[App] Set Access Token',
  props<{ token: KeycloakToken }>()
)
export const refreshAccessToken = createAction(
  '[App] Refresh Access Token',
  props<{ token: KeycloakToken }>()
)

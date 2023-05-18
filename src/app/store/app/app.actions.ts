import { EnrollmentApplication } from '@models/application'
import { Profile } from '@models/profile'
import { createAction, props } from '@ngrx/store'
import { Leaderboards } from '@models/leaderboards'
import { MinecraftProfile } from '@models/minecraft-profile'

export const initialize = createAction(
  '[App] Initialize Application'
)

export const login = createAction(
  '[App] Login'
)

export const getProfile = createAction(
  '[App] Get Profile',
  props<{ token: string }>()
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

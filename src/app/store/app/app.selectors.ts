import { shuffle } from '@functions/shuffle'
import { MinecraftProfile } from '@models/minecraft-profile'
import { Role } from '@models/role'
import { createSelector, createFeatureSelector } from '@ngrx/store'
import { appFeatureKey, AppState } from './app.reducer'

export const selectAppState = createFeatureSelector<AppState>(appFeatureKey)

export const selectInitialized = createSelector(
  selectAppState,
  (state) => state.initialized
)

export const selectProfile = createSelector(
  selectAppState,
  (state) => state.profile
)

export const selectIsSignedIn = createSelector(
  selectProfile,
  (profile) => !!profile
)

export const selectPendingApproval = createSelector(
  selectProfile,
  (profile) => !!profile?.application?.createdAt && profile?.application?.approved === null
)

export const selectUserId = createSelector(
  selectProfile,
  (profile) => profile?.id
)

export const selectApplied = createSelector(
  selectProfile,
  (profile) => !!profile?.application?.createdAt
)

export const selectIsRole = (role: Role) => createSelector(
  selectAppState,
  (state) => !!state.profile?.roles.some(r => r === role)
)

export const selectLeaderboards = createSelector(
  selectAppState,
  (state) => state.leaderboards ? Object.entries(state.leaderboards) : []
)

export const selectSupporters = createSelector(
  selectAppState,
  (state) => shuffle<MinecraftProfile>(state.supporters)
)

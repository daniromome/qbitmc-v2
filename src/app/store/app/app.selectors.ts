import { shuffle } from '@functions/shuffle'
import { MinecraftProfile } from '@models/minecraft-profile'
import { Role } from '@models/role'
import { createSelector, createFeatureSelector } from '@ngrx/store'
import { appFeatureKey, AppState } from './app.reducer'
import { inflate } from '@functions/inflate'

export const selectAppState = createFeatureSelector<AppState>(appFeatureKey)

export const selectToken = createSelector(
  selectAppState,
  state => state.token
)

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

export const selectIsDisabled = createSelector(
  selectProfile,
  (profile) => !!profile?.disabled
)

export const selectPendingApproval = createSelector(
  selectProfile,
  (profile) => !!profile?.application?.createdAt && !profile?.application?.approved
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
  (state) => {
    const shuffledSupporters = shuffle<MinecraftProfile>(state.supporters)
    if (shuffledSupporters.length < 1) return []
    if (shuffledSupporters.length < 5) return inflate<MinecraftProfile>(shuffledSupporters, 10)
    return inflate<MinecraftProfile>(shuffledSupporters, shuffledSupporters.length * 2)
  }
)

export const selectServers = createSelector(
  selectAppState,
  (state) => state.servers
)

export const selectCustomer = createSelector(
  selectProfile,
  (profile) => profile?.customer
)

export const selectNickname = createSelector(
  selectAppState,
  (state) => state.nickname
)

export const selectPendingChanges = createSelector(
  selectAppState,
  state => state.changes
)

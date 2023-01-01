import { createSelector, createFeatureSelector } from '@ngrx/store'
import { appFeatureKey, AppState } from './app.reducer'

export const selectAppState = createFeatureSelector<AppState>(appFeatureKey)

export const selectProfile = createSelector(
  selectAppState,
  (state) => state.profile
)

export const selectIsSignedIn = createSelector(
  selectProfile,
  (user) => !!user
)

export const selectProfileId = createSelector(
  selectProfile,
  (profile) => profile?.id
)

export const selectToken = createSelector(
  selectAppState,
  (state) => state.token
)

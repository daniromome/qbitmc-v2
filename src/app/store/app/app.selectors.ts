import { Role } from '@models/role'
import { createSelector, createFeatureSelector } from '@ngrx/store'
import { appFeatureKey, AppState } from './app.reducer'

export const selectAppState = createFeatureSelector<AppState>(appFeatureKey)

export const selectUser = createSelector(
  selectAppState,
  (state) => state.user
)

export const selectIsSignedIn = createSelector(
  selectUser,
  (user) => !!user
)

export const selectUserId = createSelector(
  selectUser,
  (user) => user?.id
)

export const selectToken = createSelector(
  selectAppState,
  (state) => state.token
)

export const selectJWT = createSelector(
  selectAppState,
  (state) => state.jwt || ''
)

export const selectIsRole = (role: Role) => createSelector(
  selectAppState,
  (state) => !!state.user?.roles.some(r => r.role === role)
)

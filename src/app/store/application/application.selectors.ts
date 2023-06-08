import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectAll, ApplicationState, applicationFeatureKey } from './application.reducer'

export const selectApplicationState = createFeatureSelector<ApplicationState>(applicationFeatureKey)

export const selectApplicationMedia = createSelector(
  selectApplicationState,
  state => state.media ? Object.values(state.media) : []
)

export const selectApplicationMediaSize = createSelector(
  selectApplicationMedia,
  media => media.every(m => !!m.size) ? media.map(m => m.size!).reduce((accumulator, value) => accumulator + value, 0) : 0
)

export const selectAllCareers = createSelector(
  selectApplicationState,
  selectAll
)

import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectAll, ApplicationState, applicationFeatureKey } from './application.reducer'

export const selectApplicationState = createFeatureSelector<ApplicationState>(applicationFeatureKey)

export const selectAllCareers = createSelector(
  selectApplicationState,
  selectAll
)

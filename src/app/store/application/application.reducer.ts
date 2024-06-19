import { createFeature, createReducer, createSelector, on } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { EnrollmentApplicationDocument } from '@qbitmc/common'
import { applicationActions } from './application.actions'

export const applicationFeatureKey = 'application'

export interface ApplicationState extends EntityState<EnrollmentApplicationDocument> {
  id: string | undefined
  hasApplied: boolean | undefined
}

export const adapter: EntityAdapter<EnrollmentApplicationDocument> = createEntityAdapter<EnrollmentApplicationDocument>({
  selectId: application => application.$id
})

export const initialState: ApplicationState = { ...adapter.getInitialState(), id: undefined, hasApplied: undefined }

export const reducer = createReducer(
  initialState,
  on(
    applicationActions.getSuccess,
    applicationActions.submitSuccess,
    (state, action): ApplicationState => ({
      ...adapter.addOne(action.application, state),
      id: action.application.$id,
      hasApplied: true
    })
  ),
  on(applicationActions.getFailure, (state): ApplicationState => ({ ...state, hasApplied: false }))
)

export const applicationFeature = createFeature({
  name: applicationFeatureKey,
  reducer,
  extraSelectors: ({ selectApplicationState }) => ({
    ...adapter.getSelectors(selectApplicationState),
    selectOwnApplication: createSelector(selectApplicationState, state => (state.id ? state.entities[state.id] : undefined))
  })
})

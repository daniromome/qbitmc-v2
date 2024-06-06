import { createFeature, createReducer, createSelector, on } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { EnrollmentApplicationDocument } from '@models/application'
import { applicationActions } from './application.actions'

export const applicationFeatureKey = 'application'

export interface ApplicationState extends EntityState<EnrollmentApplicationDocument> {
  id: string | undefined
}

export const adapter: EntityAdapter<EnrollmentApplicationDocument> = createEntityAdapter<EnrollmentApplicationDocument>()

export const initialState: ApplicationState = { ...adapter.getInitialState(), id: undefined }

export const reducer = createReducer(
  initialState,
  on(
    applicationActions.getSuccess,
    (state, action): ApplicationState => ({ ...adapter.addOne(action.application, state), id: action.application.$id })
  )
)

export const applicationFeature = createFeature({
  name: applicationFeatureKey,
  reducer,
  extraSelectors: ({ selectApplicationState }) => ({
    ...adapter.getSelectors(selectApplicationState),
    selectMyApplication: createSelector(selectApplicationState, state => (state.id ? state.entities[state.id] : undefined))
  })
})

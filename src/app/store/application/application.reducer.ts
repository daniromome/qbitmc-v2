import { createFeature, createReducer } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { EnrollmentApplication } from '@models/application'

export const applicationFeatureKey = 'application'

export interface ApplicationState extends EntityState<EnrollmentApplication> {}

export const adapter: EntityAdapter<EnrollmentApplication> = createEntityAdapter<EnrollmentApplication>()

export const initialState: ApplicationState = { ...adapter.getInitialState() }

export const reducer = createReducer(initialState)

export const applicationFeature = createFeature({
  name: applicationFeatureKey,
  reducer,
  extraSelectors: ({ selectApplicationState }) => ({
    ...adapter.getSelectors(selectApplicationState)
  })
})

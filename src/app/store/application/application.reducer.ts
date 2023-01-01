import { createReducer } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { Application } from '@models/application'

export const applicationFeatureKey = 'application'

export interface ApplicationState extends EntityState<Application> {}

export const adapter: EntityAdapter<Application> = createEntityAdapter<Application>()

export const initialState: ApplicationState = adapter.getInitialState({})

export const reducer = createReducer(
  initialState
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors()

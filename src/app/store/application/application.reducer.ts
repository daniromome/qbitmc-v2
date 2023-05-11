import { createReducer, on } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { EnrollmentApplication } from '@models/application'
import { Media } from '@models/media'
import { ApplicationActions } from '.'

export const applicationFeatureKey = 'application'

export interface ApplicationState extends EntityState<EnrollmentApplication> {
  media?: Record<string, Media>
}

export const adapter: EntityAdapter<EnrollmentApplication> = createEntityAdapter<EnrollmentApplication>()

export const initialState: ApplicationState = adapter.getInitialState()

export const reducer = createReducer(
  initialState,
  on(ApplicationActions.getMediaResourcesSuccess, (state, action): ApplicationState => {
    const media = { ...state.media }
    action.media.forEach(m => media[m.key] = m)
    return { ...state, media }
  }),
  on(ApplicationActions.uploadMediaResourcesSuccess, (state, action): ApplicationState => {
    const media = { ...state.media }
    action.media.forEach(m => media[m.key] = m)
    return { ...state, media }
  }),
  on(ApplicationActions.deleteMediaResourceSuccess, (state, action): ApplicationState => {
    const media = { ...state.media }
    delete media[action.key]
    return { ...state, media }
  })
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors()

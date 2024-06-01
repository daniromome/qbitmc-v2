import { createFeature, createReducer, createSelector, on } from '@ngrx/store'
import { mediaActions } from './media.actions'
import { GetMediaRequest, MEDIA_STATUS, Media, MediaEntity, MediaStatus } from '@models/media'
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity'

export const mediaFeatureKey = 'media'

export interface MediaState extends EntityState<Media> {
  loading: Record<string, MediaStatus>
  error: Record<string, string>
}

const adapter: EntityAdapter<Media> = createEntityAdapter<Media>({
  selectId: (m: Media): string => m.key
})

const initialState: MediaState = adapter.getInitialState({
  loading: {},
  error: {}
})

export const reducer = createReducer(
  initialState,
  on(mediaActions.getMedia, (state, action): MediaState => {
    const { entity, id } = action.request
    return setMediaState(state, `${entity}/${id}`, MEDIA_STATUS.DOWNLOADING)
  }),
  on(mediaActions.getMediaFailure, (state, action): MediaState => {
    const { entity, id } = action.request
    return setMediaState(state, `${entity}/${id}`, MEDIA_STATUS.LOADED, action.error.message)
  }),
  on(mediaActions.getMediaResourcesSuccess, (state, action): MediaState => {
    const [entity, id] = action.media[0].key.split('/')
    return adapter.upsertMany(action.media, setMediaState(state, `${entity}/${id}`, MEDIA_STATUS.LOADED))
  }),
  on(mediaActions.getMediaResourcesFailure, (state, action): MediaState => {
    const [entity, id] = action.keys[0].split('/')
    return setMediaState(state, `${entity}/${id}`, MEDIA_STATUS.LOADED, action.error.message)
  }),
  on(mediaActions.uploadMediaResources, (state, action): MediaState => {
    const { entity, id } = action.request
    return setMediaState(state, `${entity}/${id}`, MEDIA_STATUS.UPLOADING)
  }),
  on(mediaActions.uploadMediaResourcesSuccess, (state, { entity, id, media }): MediaState => {
    return adapter.upsertMany(
      media.map(m => ({ ...m, key: `${entity}/${id}/${m.key}` })),
      setMediaState(state, `${entity}/${id}`, MEDIA_STATUS.LOADED)
    )
  }),
  on(mediaActions.getMediaResourcesFailure, (state, action): MediaState => {
    const [entity, id] = action.keys[0].split('/')
    return setMediaState(state, `${entity}/${id}`, MEDIA_STATUS.LOADED, action.error.message)
  }),
  on(mediaActions.deleteMediaResource, (state, { path }): MediaState => {
    const [entity, id] = path.split('/')
    return setMediaState(state, `${entity}/${id}`, MEDIA_STATUS.DELETING)
  }),
  on(mediaActions.deleteMediaResourceSuccess, (state, { path }): MediaState => {
    const [entity, id] = path.split('/')
    return adapter.removeOne(path, setMediaState(state, `${entity}/${id}`, MEDIA_STATUS.LOADED))
  }),
  on(mediaActions.deleteMediaResourceFailure, (state, { path, error }): MediaState => {
    const [entity, id] = path.split('/')
    return setMediaState(state, `${entity}/${id}`, MEDIA_STATUS.LOADED, error.message)
  })
)

export const mediaFeature = createFeature({
  name: mediaFeatureKey,
  reducer,
  extraSelectors: ({ selectMediaState }) => {
    const entitySelectors = adapter.getSelectors(selectMediaState)
    const selectMedia = (request: GetMediaRequest) =>
      createSelector(selectMediaState, state => {
        const identifiers = state.ids as string[]
        const { entity, id } = request
        const entities = identifiers.filter(i => i.startsWith(`${entity}/${id}`))
        return entities.map(e => state.entities[e]!)
      })
    return {
      ...entitySelectors,
      selectMedia,
      selectMediaSize: (request: GetMediaRequest) =>
        createSelector(selectMedia(request), media =>
          media.every(m => !!m.size) ? media.map(m => m.size).reduce((accumulator, value) => accumulator + value, 0) : 0
        ),
      selectLoading: (entity: MediaEntity, id: string) => {
        return createSelector(selectMediaState, state => state.loading[`${entity}/${id}`])
      },
      selectError: (entity: MediaEntity, id: string) => {
        return createSelector(selectMediaState, state => state.error[`${entity}/${id}`])
      }
    }
  }
})

function setMediaState(state: MediaState, path: string, loading: MediaStatus, error?: string): MediaState {
  return error
    ? { ...state, loading: { ...state.loading, [path]: loading }, error: { ...state.error, [path]: error } }
    : { ...state, loading: { ...state.loading, [path]: loading } }
}

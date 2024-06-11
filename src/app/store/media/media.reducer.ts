import { createFeature, createReducer, createSelector, on } from '@ngrx/store'
import { mediaActions } from './media.actions'
import { BUCKET, MEDIA_STATUS, Media, MediaEntity, MediaStatus } from '@models/media'
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity'

export const mediaFeatureKey = 'media'

export interface MediaState extends EntityState<Media> {
  loading: Record<string, MediaStatus>
  error: Record<string, string>
}

const adapter: EntityAdapter<Media> = createEntityAdapter<Media>({
  selectId: (m: Media): string => m.$id
})

const initialState: MediaState = adapter.getInitialState({
  loading: {},
  error: {}
})

export const reducer = createReducer(
  initialState,
  on(mediaActions.getMedia, (state, action): MediaState => {
    const { entity, ids } = action.request
    return setMediaState(state, [entity, ...ids], MEDIA_STATUS.DOWNLOADING)
  }),
  on(mediaActions.getMediaSuccess, (state, action): MediaState => {
    const { entity, ids } = action.request
    return adapter.upsertMany(action.media, setMediaState(state, [entity, ...ids], MEDIA_STATUS.LOADED))
  }),
  on(mediaActions.getMediaFailure, (state, action): MediaState => {
    const { entity, ids } = action.request
    return setMediaState(state, [entity, ...ids], MEDIA_STATUS.LOADED, action.error.message)
  }),
  on(mediaActions.uploadMediaResources, (state, action): MediaState => {
    const { fileIds } = action.request
    return setMediaState(state, fileIds, MEDIA_STATUS.UPLOADING)
  }),
  on(mediaActions.uploadMediaResourcesSuccess, (state, { media }): MediaState => {
    return adapter.upsertMany(
      media,
      setMediaState(
        state,
        media.map(m => m.$id),
        MEDIA_STATUS.LOADED
      )
    )
  }),
  on(mediaActions.deleteMediaResource, (state, { request }): MediaState => {
    const { id } = request
    return setMediaState(state, [id], MEDIA_STATUS.DELETING)
  }),
  on(mediaActions.deleteMediaResourceSuccess, (state, { id }): MediaState => {
    return adapter.removeOne(id, setMediaState(state, [id], MEDIA_STATUS.LOADED))
  }),
  on(mediaActions.deleteMediaResourceFailure, (state, { id, error }): MediaState => {
    return setMediaState(state, [id], MEDIA_STATUS.LOADED, error.message)
  })
)

export const mediaFeature = createFeature({
  name: mediaFeatureKey,
  reducer,
  extraSelectors: ({ selectMediaState }) => {
    const entitySelectors = adapter.getSelectors(selectMediaState)
    const selectMedia = (media: string[]) => createSelector(selectMediaState, state => media.map(m => state.entities[m]!))
    const selectEntityMedia = (entity: MediaEntity) =>
      createSelector(entitySelectors.selectAll, media => media.filter(m => m.bucketId === BUCKET[entity]))
    return {
      ...entitySelectors,
      selectMedia,
      selectEntityMedia,
      selectEntityMediaSize: (entity: MediaEntity) =>
        createSelector(selectEntityMedia(entity), media =>
          media.map(m => m.sizeOriginal).reduce((accumulator, value) => accumulator + value, 0)
        ),
      selectMediaSize: (media: string[]) =>
        createSelector(selectMedia(media), selectedMedia =>
          selectedMedia.map(m => m.sizeOriginal).reduce((accumulator, value) => accumulator + value, 0)
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

function setMediaState(state: MediaState, ids: string[], loading: MediaStatus, error?: string): MediaState {
  if (!error) return ids.reduce<MediaState>((acc, key) => ({ ...acc, loading: { ...acc.loading, [key]: loading } }), state)
  return ids.reduce<MediaState>(
    (acc, key) => ({ ...acc, loading: { ...acc.loading, [key]: loading }, error: { ...acc.error, [key]: error } }),
    state
  )
}

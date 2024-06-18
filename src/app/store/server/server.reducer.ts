import { ServerDocument, VISIBILITY } from '@qbitmc/common'
import { createFeature, createReducer, createSelector, on } from '@ngrx/store'
import { serverActions } from './server.actions'
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity'

export interface ServerState extends EntityState<ServerDocument> {
  loading: {
    servers: boolean
    syncing: boolean
  }
}

export const adapter: EntityAdapter<ServerDocument> = createEntityAdapter<ServerDocument>({
  selectId: server => server.$id
})

export const initialState: ServerState = adapter.getInitialState({
  loading: {
    servers: false,
    syncing: false
  }
})

export const serverFeature = createFeature({
  name: 'server',
  reducer: createReducer(
    initialState,
    on(serverActions.getServers, (state): ServerState => ({ ...state, loading: { ...state.loading, servers: true } })),
    on(serverActions.syncDatabase, (state): ServerState => ({ ...state, loading: { ...state.loading, syncing: true } })),
    on(
      serverActions.getServersSuccess,
      serverActions.syncDatabaseSuccess,
      (state, { servers }): ServerState => adapter.upsertMany(servers, state)
    ),
    on(
      serverActions.getServersSuccess,
      serverActions.getServersFailure,
      (state): ServerState => ({
        ...state,
        loading: { ...state.loading, servers: false }
      })
    ),
    on(
      serverActions.syncDatabaseSuccess,
      serverActions.syncDatabaseFailure,
      (state): ServerState => ({
        ...state,
        loading: { ...state.loading, syncing: false }
      })
    ),
    on(serverActions.updateServerSuccess, (state, { server }): ServerState => adapter.upsertOne(server, state))
  ),
  extraSelectors: ({ selectServerState, selectLoading, selectEntities }) => {
    const entitySelectors = adapter.getSelectors(selectServerState)
    return {
      ...entitySelectors,
      selectLoadingServers: createSelector(selectLoading, loading => loading.servers),
      selectSyncing: createSelector(selectLoading, loading => loading.syncing),
      selectServer: (id: string) => createSelector(selectEntities, entities => (entities ? entities[id] : undefined)),
      selectServers: createSelector(entitySelectors.selectAll, servers =>
        servers.filter(s => s.visibility !== VISIBILITY.DRAFT)
      ),
      selectDrafts: createSelector(entitySelectors.selectAll, servers => servers.filter(s => s.visibility === VISIBILITY.DRAFT))
    }
  }
})

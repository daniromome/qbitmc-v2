import { ServerDocument } from '@qbitmc/common'
import { createFeature, createReducer, createSelector, on } from '@ngrx/store'
import { serverActions } from './server.actions'
import { LoadingState, setLoadingGeneric } from 'src/app/utils/loading.state'

export interface IServerState {
  servers: ServerDocument[]
}

const setLoading = setLoadingGeneric<IServerState>

export type ServerState = IServerState & LoadingState<IServerState>

export const initialState: ServerState = {
  servers: [],
  loading: {
    servers: false
  }
}

export const serverFeature = createFeature({
  name: 'admin',
  reducer: createReducer(
    initialState,
    on(serverActions.getServers, state => ({ ...state, loading: setLoading(state, 'servers', true) })),
    on(serverActions.getServersSuccess, (state, { servers }): ServerState => ({ ...state, servers })),
    on(serverActions.getServersSuccess, serverActions.getServersFailure, state => ({
      ...state,
      loading: setLoading(state, 'servers', false)
    }))
  ),
  extraSelectors: ({ selectLoading, selectServers }) => ({
    selectLoadingServers: createSelector(selectLoading, loading => loading.servers),
    selectServer: (id: string) => createSelector(selectServers, servers => servers.find(server => server.$id === id))
  })
})

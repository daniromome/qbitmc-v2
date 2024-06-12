import { ServerDocument } from '@qbitmc/common'
import { createFeature, createReducer, createSelector, on } from '@ngrx/store'
import { adminActions } from './admin.actions'
import { LoadingState, setLoadingGeneric } from 'src/app/utils/loading.state'

export interface IAdminState {
  servers: ServerDocument[]
}

const setLoading = setLoadingGeneric<IAdminState>

export type AdminState = IAdminState & LoadingState<IAdminState>

export const initialState: AdminState = {
  servers: [],
  loading: {
    servers: false
  }
}

export const adminFeature = createFeature({
  name: 'admin',
  reducer: createReducer(
    initialState,
    on(adminActions.getServers, state => ({ ...state, loading: setLoading(state, 'servers', true) })),
    on(adminActions.getServersSuccess, (state, { servers }): AdminState => ({ ...state, servers })),
    on(adminActions.getServersSuccess, adminActions.getServersFailure, state => ({
      ...state,
      loading: setLoading(state, 'servers', false)
    }))
  ),
  extraSelectors: ({ selectLoading, selectServers }) => ({
    selectLoadingServers: createSelector(selectLoading, loading => loading.servers),
    selectServer: (id: string) => createSelector(selectServers, servers => servers.find(server => server.$id === id))
  })
})

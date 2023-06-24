import { createReducer, on } from '@ngrx/store'
import { Profile } from '@models/profile'
import { AppActions } from '@store/app'
import { Leaderboards } from '@models/leaderboards'
import { MinecraftProfile } from '@models/minecraft-profile'
import { Server } from '@models/server'

export const appFeatureKey = 'app'

export interface AppState {
  profile?: Profile
  leaderboards?: Leaderboards
  supporters: MinecraftProfile[]
  servers: Server[]
  initialized: boolean
}

export const initialState: AppState = {
  supporters: [],
  servers: [],
  initialized: false
}

export const reducer = createReducer(
  initialState,
  on(AppActions.getProfileSuccess, (state, action): AppState => ({ ...state, profile: action.profile, initialized: true })),
  on(AppActions.getProfileFailure, (state): AppState => ({ ...state, initialized: true })),
  on(AppActions.submittedApplication, (state, action): AppState => ({
    ...state,
    profile: {
      ...state.profile as Profile,
      application: { createdAt: action.application.createdAt, approved: action.application.approved },
      forename: action.application.forename
    }
  })),
  on(AppActions.getLeaderboardsSuccess, (state, action): AppState => ({ ...state, leaderboards: action.leaderboards })),
  on(AppActions.getSupportersSuccess, (state, action): AppState => ({ ...state, supporters: action.supporters })),
  on(AppActions.getServersSuccess, (state, action): AppState => ({ ...state, servers: action.servers }))
)

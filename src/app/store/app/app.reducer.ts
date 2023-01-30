import { createReducer, on } from '@ngrx/store'
import { User } from '@models/user'
import { AppActions } from '@store/app'
import { Leaderboards } from '@models/leaderboards'
import { MinecraftProfile } from '@models/minecraft-profile'

export const appFeatureKey = 'app'

export interface AppState {
  user?: User
  token?: string
  jwt?: string
  leaderboards?: Leaderboards
  supporters: MinecraftProfile[]
}

export const initialState: AppState = {
  supporters: []
}

export const reducer = createReducer(
  initialState,
  on(AppActions.loginSuccess, (state, action): AppState => ({ ...state, user: action.user })),
  on(AppActions.autoLoginMiddleware, (state, action): AppState => ({
    ...state,
    token: action.session?.provider_token || '',
    jwt: action.session?.access_token || ''
  })),
  on(AppActions.loginMiddleware, (state, action): AppState => ({
    ...state,
    token: action.session?.provider_token || '',
    jwt: action.session?.access_token || ''
  })),
  on(AppActions.submittedApplication, (state, action): AppState => ({
    ...state,
    user: {
      ...state.user as User,
      application: { createdAt: action.application.created_at, approved: action.application.approved },
      minecraft: { ign: action.application.ign, uuid: action.application.uuid },
      nickname: action.application.nickname
    }
  })),
  on(AppActions.getLeaderboardsSuccess, (state, action): AppState => ({ ...state, leaderboards: action.leaderboards })),
  on(AppActions.getSupportersSuccess, (state, action): AppState => ({ ...state, supporters: action.supporters }))
)

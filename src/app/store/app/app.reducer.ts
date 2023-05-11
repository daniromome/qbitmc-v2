import { createReducer, on } from '@ngrx/store'
import { Profile } from '@models/profile'
import { AppActions } from '@store/app'
import { Leaderboards } from '@models/leaderboards'
import { MinecraftProfile } from '@models/minecraft-profile'

export const appFeatureKey = 'app'

export interface AppState {
  profile?: Profile
  leaderboards?: Leaderboards
  supporters: MinecraftProfile[]
}

export const initialState: AppState = {
  supporters: []
}

export const reducer = createReducer(
  initialState,
  on(AppActions.getProfileSuccess, (state, action): AppState => ({ ...state, profile: action.profile })),
  on(AppActions.submittedApplication, (state, action): AppState => ({
    ...state,
    profile: {
      ...state.profile as Profile,
      application: { createdAt: action.application.created_at, approved: action.application.approved },
      forename: action.application.forename
    }
  })),
  on(AppActions.getLeaderboardsSuccess, (state, action): AppState => ({ ...state, leaderboards: action.leaderboards })),
  on(AppActions.getSupportersSuccess, (state, action): AppState => ({ ...state, supporters: action.supporters }))
)

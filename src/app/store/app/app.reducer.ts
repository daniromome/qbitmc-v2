import { createReducer, on } from '@ngrx/store'
import { KeycloakToken, Profile } from '@models/profile'
import { AppActions } from '@store/app'
import { Leaderboards } from '@models/leaderboards'
import { MinecraftProfile } from '@models/minecraft-profile'
import { Server } from '@models/server'
import { StyledText } from '@models/styled-text'
import { parseUnstyledText } from '@functions/styled-text'

export const appFeatureKey = 'app'

export interface AppState {
  token?: KeycloakToken
  profile?: Profile
  leaderboards?: Leaderboards
  supporters: MinecraftProfile[]
  servers: Server[]
  initialized: boolean,
  nickname: StyledText[],
  changes: boolean
}

export const initialState: AppState = {
  supporters: [],
  servers: [],
  initialized: false,
  nickname: [],
  changes: false
}

const getNickname = (state: AppState, profile: Profile): AppState => {
  if (profile.nickname) {
    const nickname = profile.nickname.replaceAll('<', '').split('r>').map(parseUnstyledText)
    return { ...state, profile, nickname }
  }
  if (profile.minecraft) {
    const nickname = [parseUnstyledText(profile.minecraft.name)]
    return { ...state, profile, nickname }
  }
  return { ...state, profile, nickname: [] }
}

export const reducer = createReducer(
  initialState,
  on(AppActions.getProfileSuccess, (state, action): AppState => ({ ...getNickname(state, action.profile), initialized: true })),
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
  on(AppActions.getServersSuccess, (state, action): AppState => ({ ...state, servers: action.servers })),
  on(AppActions.setUnsavedChanges, (state, action): AppState => ({ ...state, changes: action.changes })),
  on(AppActions.updateNicknameSuccess, (state, action): AppState => getNickname(state, action.profile)),
  on(AppActions.setAccessToken, (state, action): AppState => ({ ...state, token: action.token })),
  on(AppActions.refreshAccessToken, (state, action): AppState => ({ ...state, token: action.token })),
  on(AppActions.logoutDone, (state): AppState => ({ ...state, changes: false, nickname: [], profile: undefined, token: undefined }))
)

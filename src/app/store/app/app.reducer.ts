import { MemoizedSelector, createFeature, createReducer, createSelector, on } from '@ngrx/store'
import { KeycloakToken, Profile } from '@models/profile'
import { appActions } from '@store/app'
import { Leaderboards } from '@models/leaderboards'
import { MinecraftProfile } from '@models/minecraft-profile'
import { Server } from '@models/server'
import { StyledText } from '@models/styled-text'
import { parseUnstyledText, shuffleArray } from '@utils'
import { Role } from '@models/role'

export const appFeatureKey = 'app'

export interface AppState {
  token: KeycloakToken | undefined
  profile: Profile | undefined
  leaderboards: Leaderboards | undefined
  supporters: MinecraftProfile[]
  servers: Server[]
  initialized: boolean
  nickname: StyledText[]
  changes: boolean
}

export const initialState: AppState = {
  token: undefined,
  profile: undefined,
  leaderboards: undefined,
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
  on(appActions.getProfileSuccess, (state, action): AppState => ({ ...getNickname(state, action.profile), initialized: true })),
  on(appActions.getProfileFailure, (state): AppState => ({ ...state, initialized: true })),
  on(
    appActions.submittedApplication,
    (state, action): AppState => ({
      ...state,
      profile: {
        ...(state.profile as Profile),
        application: { createdAt: action.application.createdAt, approved: action.application.approved },
        forename: action.application.forename
      }
    })
  ),
  on(appActions.getLeaderboardsSuccess, (state, action): AppState => ({ ...state, leaderboards: action.leaderboards })),
  on(appActions.getSupportersSuccess, (state, action): AppState => ({ ...state, supporters: action.supporters })),
  on(appActions.getServersSuccess, (state, action): AppState => ({ ...state, servers: action.servers })),
  on(appActions.setUnsavedChanges, (state, action): AppState => ({ ...state, changes: action.changes })),
  on(appActions.updateNicknameSuccess, (state, action): AppState => getNickname(state, action.profile)),
  on(appActions.setAccessToken, (state, action): AppState => ({ ...state, token: action.token })),
  on(appActions.refreshAccessToken, (state, action): AppState => ({ ...state, token: action.token })),
  on(
    appActions.logoutDone,
    (state): AppState => ({ ...state, changes: false, nickname: [], profile: undefined, token: undefined })
  )
)

export const appFeature = createFeature({
  name: appFeatureKey,
  reducer,
  extraSelectors: ({ selectProfile, selectAppState, selectServers }) => ({
    selectIsSignedIn: createSelector(selectAppState, state => !!state.profile && state.initialized),
    selectIsDisabled: createSelector(selectProfile, profile => !!profile?.disabled),
    selectPendingApproval: createSelector(
      selectProfile,
      profile => !!profile?.application?.createdAt && !profile?.application?.approved
    ),
    selectUserId: createSelector(selectProfile, profile => profile?.id || ''),
    selectApplied: createSelector(selectProfile, profile => !!profile?.application?.createdAt),
    selectIsRole: (...roles: Role[]): MemoizedSelector<Record<string, any>, boolean, (s1: AppState) => boolean> =>
      createSelector(selectAppState, state => !!state.profile?.roles.some(r => roles.some(role => r === role))),
    selectLeaderboards: createSelector(selectAppState, state => (state.leaderboards ? Object.entries(state.leaderboards) : [])),
    selectSupporters: createSelector(selectAppState, state => {
      return shuffleArray<MinecraftProfile>(state.supporters)
    }),
    selectCustomer: createSelector(selectProfile, profile => profile?.customer),
    selectServer: (id: string) => createSelector(selectServers, servers => servers.find(server => server.id === id))
  })
})

import { MemoizedSelector, createFeature, createReducer, createSelector, on } from '@ngrx/store'
import { Profile } from '@models/profile'
import { appActions } from '@store/app'
import { Leaderboards } from '@models/leaderboards'
import { MinecraftProfile } from '@models/minecraft-profile'
import { Server } from '@models/server'
import { StyledText } from '@models/styled-text'
import { parseUnstyledText, shuffleArray } from '@utils'
import { Models } from 'appwrite'
import { USER_LABEL, UserLabel, User } from '@models/user'

export const appFeatureKey = 'app'

export interface AppState {
  session: Models.Session | undefined
  user: User | undefined
  profile: Profile | undefined
  leaderboards: Leaderboards | undefined
  supporters: MinecraftProfile[]
  servers: Server[]
  initialized: boolean
  nickname: StyledText[]
  changes: boolean
}

export const initialState: AppState = {
  session: undefined,
  user: undefined,
  profile: undefined,
  leaderboards: undefined,
  supporters: [],
  servers: [],
  initialized: false,
  nickname: [],
  changes: false
}

const getNickname = (state: AppState): AppState => {
  if (state.nickname.length > 0) return state
  const currentNickname = state.user?.prefs.nickname
  if (currentNickname) {
    const nickname = currentNickname.replaceAll('<', '').split('r>').map(parseUnstyledText)
    return { ...state, nickname }
  }
  const player = state.user?.prefs['player']
  const ign = state.profile?.players.find(p => p.uuid === player)?.ign
  if (ign) {
    const nickname = [parseUnstyledText(ign)]
    return { ...state, nickname }
  }
  return { ...state, nickname: [] }
}

export const reducer = createReducer(
  initialState,
  on(appActions.getSessionSuccess, (state, action): AppState => ({ ...state, session: action.session })),
  on(appActions.getSessionSuccess, appActions.getSessionFailure, (state): AppState => ({ ...state, initialized: true })),
  on(appActions.getUserSuccess, (state, { user }): AppState => ({ ...state, user })),
  on(appActions.getProfileSuccess, (state, { profile }): AppState => ({ ...state, profile })),
  on(
    appActions.submittedApplication,
    (state, action): AppState => ({
      ...state,
      profile: {
        ...(state.profile as Profile),
        application: action.application
      }
    })
  ),
  on(appActions.getLeaderboardsSuccess, (state, action): AppState => ({ ...state, leaderboards: action.leaderboards })),
  on(appActions.getSupportersSuccess, (state, action): AppState => ({ ...state, supporters: action.supporters })),
  on(appActions.getServersSuccess, (state, action): AppState => ({ ...state, servers: action.servers })),
  on(appActions.setUnsavedChanges, (state, action): AppState => ({ ...state, changes: action.changes }))
)

export const appFeature = createFeature({
  name: appFeatureKey,
  reducer,
  extraSelectors: ({ selectProfile, selectAppState, selectServers, selectSession, selectUser }) => ({
    selectIsSignedIn: createSelector(selectAppState, state => !!state.session && state.initialized),
    selectIsDisabled: createSelector(selectUser, user => user?.labels.includes(USER_LABEL.DISABLED)),
    selectUserId: createSelector(selectSession, session => session?.$id || ''),
    selectPlayer: createSelector(selectAppState, state => {
      const player = state.user?.prefs['player']
      return state.profile?.players.find(p => p.uuid === player)
    }),
    selectIsRole: (...labels: UserLabel[]): MemoizedSelector<Record<string, any>, boolean, (s1: AppState) => boolean> =>
      createSelector(selectAppState, state => !!state.user?.labels.some(l => labels.includes(l))),
    selectLeaderboards: createSelector(selectAppState, state => (state.leaderboards ? Object.entries(state.leaderboards) : [])),
    selectSupporters: createSelector(selectAppState, state => {
      return shuffleArray<MinecraftProfile>(state.supporters)
    }),
    selectCustomer: createSelector(selectProfile, profile => profile?.customer),
    selectServer: (id: string) => createSelector(selectServers, servers => servers.find(server => server.id === id))
  })
})

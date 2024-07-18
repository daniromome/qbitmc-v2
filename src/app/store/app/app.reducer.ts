import { MemoizedSelector, createFeature, createReducer, createSelector, on } from '@ngrx/store'
import { appActions } from '@store/app'
import { StyledText } from '@models/styled-text'
import { shuffleArray } from '@utils'
import { Models } from 'appwrite'
import { USER_LABEL, UserLabel, Profile, PlayerDocument } from '@qbitmc/common'
import { User } from '@models/user'

export const appFeatureKey = 'app'

export interface AppState {
  session: Models.Session | undefined
  user: User | undefined
  profile: Profile | undefined
  supporters: PlayerDocument[]
  initialized: boolean
  nickname: StyledText[]
  changes: boolean
  loading: Record<string, boolean>
  error: Record<string, string>
}

export const initialState: AppState = {
  session: undefined,
  user: undefined,
  profile: undefined,
  supporters: [],
  initialized: false,
  nickname: [],
  changes: false,
  loading: {
    verification: false
  },
  error: {
    verification: ''
  }
}

// const getNickname = (state: AppState): AppState => {
//   if (state.nickname.length > 0) return state
//   const currentNickname = state.user?.prefs.nickname
//   if (currentNickname) {
//     const nickname = currentNickname.replaceAll('<', '').split('r>').map(parseUnstyledText)
//     return { ...state, nickname }
//   }
//   const player = state.user?.prefs['player']
//   const ign = state.profile?.players.find(p => p.$id === player)?.ign
//   if (ign) {
//     const nickname = [parseUnstyledText(ign)]
//     return { ...state, nickname }
//   }
//   return { ...state, nickname: [] }
// }

export const reducer = createReducer(
  initialState,
  on(appActions.getSessionSuccess, (state, action): AppState => ({ ...state, session: action.session })),
  on(appActions.getSessionSuccess, appActions.getSessionFailure, (state): AppState => ({ ...state, initialized: true })),
  on(appActions.getUserSuccess, (state, { user }): AppState => ({ ...state, user })),
  on(appActions.getProfileSuccess, appActions.createProfileSuccess, (state, { profile }): AppState => ({ ...state, profile })),
  on(appActions.getSupportersSuccess, (state, action): AppState => ({ ...state, supporters: action.supporters })),
  on(appActions.setUnsavedChanges, (state, action): AppState => ({ ...state, changes: action.changes })),
  on(
    appActions.minecraftAccountVerification,
    (state): AppState => ({ ...state, loading: { ...state.loading, verification: true } })
  ),
  on(
    appActions.minecraftAccountVerificationSuccess,
    (state, action): AppState => ({
      ...state,
      profile: { ...state.profile!, players: [...state.profile!.players, action.player] },
      user: { ...state.user!, prefs: { ...state.user!.prefs, player: action.player.$id } },
      loading: { ...state.loading, verification: false }
    })
  ),
  on(
    appActions.minecraftAccountVerificationFailure,
    (state): AppState => ({
      ...state,
      loading: { ...state.loading, verification: false },
      error: { ...state.error, verification: $localize`:@@verification-invalid:Invalid verification code, please try again` }
    })
  ),
  on(appActions.dismissError, (state, action): AppState => {
    const error = { ...state.error }
    delete error[action.key]
    return { ...state, error }
  }),
  on(appActions.logoutDone, (state): AppState => ({ ...state, user: undefined, profile: undefined, session: undefined }))
)

export const appFeature = createFeature({
  name: appFeatureKey,
  reducer,
  extraSelectors: ({ selectProfile, selectAppState, selectSession, selectUser, selectLoading, selectError }) => ({
    selectIsSignedIn: createSelector(selectAppState, state => !!state.session && state.initialized),
    selectIsDisabled: createSelector(selectUser, user => user?.labels.includes(USER_LABEL.DISABLED)),
    selectUserId: createSelector(selectSession, session => session?.$id || ''),
    selectPlayer: createSelector(selectAppState, state => {
      const player = state.user?.prefs['player']
      return state.profile?.players.find(p => p.$id === player)
    }),
    selectIsRole: (...labels: UserLabel[]): MemoizedSelector<Record<string, any>, boolean, (s1: AppState) => boolean> =>
      createSelector(selectAppState, state => !!state.user?.labels.some(l => labels.includes(l))),
    selectSupporters: createSelector(selectAppState, state => {
      return shuffleArray<PlayerDocument>(state.supporters)
    }),
    selectCustomer: createSelector(selectProfile, profile => profile?.customer),
    selectLoadingVerification: createSelector(selectLoading, loading => loading['verification']),
    selectErrorVerification: createSelector(selectError, error => error['verification'])
  })
})

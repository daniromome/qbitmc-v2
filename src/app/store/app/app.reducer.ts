import { createReducer, on } from '@ngrx/store'
import { Profile } from '@models/profile'
import { AppActions } from '@store/app'

export const appFeatureKey = 'app'

export interface AppState {
  profile?: Profile
  token?: string
}

export const initialState: AppState = {

}

export const reducer = createReducer(
  initialState,
  on(AppActions.loginSuccess, (state, action): AppState => ({ ...state, profile: action.profile })),
  on(AppActions.autoLoginMiddleware, (state, action): AppState => ({ ...state, token: action.session?.provider_token || '' })),
  on(AppActions.loginMiddleware, (state, action): AppState => ({ ...state, token: action.session?.provider_token || '' })),
  on(AppActions.submittedApplication, (state, action): AppState => ({
    ...state,
    profile: { ...state.profile as Profile, uuid: action.application.uuid }
  }))
)

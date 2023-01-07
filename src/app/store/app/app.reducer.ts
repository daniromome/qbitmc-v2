import { createReducer, on } from '@ngrx/store'
import { User } from '@models/user'
import { AppActions } from '@store/app'

export const appFeatureKey = 'app'

export interface AppState {
  user?: User
  token?: string
}

export const initialState: AppState = {

}

export const reducer = createReducer(
  initialState,
  on(AppActions.loginSuccess, (state, action): AppState => ({ ...state, user: action.user })),
  on(AppActions.autoLoginMiddleware, (state, action): AppState => ({ ...state, token: action.session?.provider_token || '' })),
  on(AppActions.loginMiddleware, (state, action): AppState => ({ ...state, token: action.session?.provider_token || '' })),
  on(AppActions.submittedApplication, (state, action): AppState => ({
    ...state,
    user: { ...state.user as User }
  }))
)

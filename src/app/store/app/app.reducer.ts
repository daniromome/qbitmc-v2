import { createReducer, on } from '@ngrx/store'
import { Profile } from '@models/profile'
import { AppActions } from '@store/app'

export const appFeatureKey = 'app'

export interface AppState {
  profile?: Profile
}

export const initialState: AppState = {

}

export const reducer = createReducer(
  initialState,
  on(AppActions.loginSuccess, (state, action): AppState => ({ ...state, profile: action.profile }))
)

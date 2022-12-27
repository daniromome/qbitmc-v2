import { ActionReducer, INIT } from '@ngrx/store'
import { AppActions } from '@store/app'

export const logout = (reducer: ActionReducer<any>): ActionReducer<any> =>
  (state, action) => {
    if (action && action.type === AppActions.logout.type) {
      return reducer(undefined, { type: INIT })
    }
    return reducer(state, action)
  }

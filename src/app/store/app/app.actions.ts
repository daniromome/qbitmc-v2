import { Profile } from '@models/profile'
import { createAction, props } from '@ngrx/store'
import { Session } from '@supabase/supabase-js'

export const login = createAction(
  '[App] Login'
)

export const autoLogin = createAction(
  '[App] Auto Login'
)

export const loginMiddleware = createAction(
  '[App] Login Middleware',
  props<{ session: Session | null }>()
)

export const loginSuccess = createAction(
  '[App] Login Success',
  props<{ profile: Profile }>()
)

export const loginFailure = createAction(
  '[App] Login Failure',
  props<{ error: Error }>()
)

export const logout = createAction(
  '[App] Logout'
)

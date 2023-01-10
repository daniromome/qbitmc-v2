import { Application } from '@models/application'
import { User } from '@models/user'
import { createAction, props } from '@ngrx/store'
import { Session } from '@supabase/supabase-js'

export const login = createAction(
  '[App] Login'
)

export const autoLogin = createAction(
  '[App] Auto Login'
)

export const autoLoginMiddleware = createAction(
  '[App] Auto Login Middleware',
  props<{ session: Session | null }>()
)

export const loginMiddleware = createAction(
  '[App] Login Middleware',
  props<{ session: Session | null }>()
)

export const loginSuccess = createAction(
  '[App] Login Success',
  props<{ user: User }>()
)

export const autologinFailure = createAction(
  '[App] Auto Login Failure',
  props<{ error: Error }>()
)

export const loginFailure = createAction(
  '[App] Login Failure',
  props<{ error: Error }>()
)

export const logout = createAction(
  '[App] Logout'
)

export const submittedApplication = createAction(
  '[App] Submitted Application',
  props<{ application: Required<Application> }>()
)

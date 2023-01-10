import { createAction, props } from '@ngrx/store'
import { Application } from '@models/application'

export const submit = createAction(
  '[Application] Submit',
  props<{ application: Application }>()
)

export const submitSuccess = createAction(
  '[Application] Submit Success',
  props<{ application: Required<Application>, token: string }>()
)

export const submitFailure = createAction(
  '[Application] Submit Failure',
  props<{ error: Error }>()
)

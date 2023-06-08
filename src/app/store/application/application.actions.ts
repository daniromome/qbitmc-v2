import { createAction, props } from '@ngrx/store'
import { EnrollmentApplication } from '@models/application'
import { Media } from '@models/media'

export const getMedia = createAction(
  '[Application] Get Media'
)
export const getMediaSuccess = createAction(
  '[Application] Get Media Success',
  props<{ keys: string[] }>()
)
export const getMediaFailure = createAction(
  '[Application] Get Media Failure',
  props<{ error: Error }>()
)
export const getMediaResources = createAction(
  '[Application] Get Media Resources',
  props<{ keys: string[] }>()
)
export const getMediaResourcesSuccess = createAction(
  '[Application] Get Media Resources Success',
  props<{ media: Media[] }>()
)
export const getMediaResourcesFailure = createAction(
  '[Application] Get Media Resources Failure',
  props<{ error: Error }>()
)
export const uploadMediaResources = createAction(
  '[Application] Upload Media Resources',
  props<{ files: File[] }>()
)
export const uploadMediaResourcesSuccess = createAction(
  '[Application] Upload Media Resources Success',
  props<{ media: Media[] }>()
)
export const uploadMediaResourcesFailure = createAction(
  '[Application] Upload Media Resources Failure',
  props<{ error: Error }>()
)
export const deleteMediaResource = createAction(
  '[Application] Delete Media Resource',
  props<{ key: string }>()
)
export const deleteMediaResourceSuccess = createAction(
  '[Application] Delete Media Resource Success',
  props<{ key: string }>()
)
export const deleteMediaResourceFailure = createAction(
  '[Application] Delete Media Resource Failure',
  props<{ error: Error }>()
)

export const submit = createAction(
  '[Application] Submit',
  props<{ application: EnrollmentApplication }>()
)

export const submitSuccess = createAction(
  '[Application] Submit Success',
  props<{ application: Required<EnrollmentApplication> }>()
)

export const submitFailure = createAction(
  '[Application] Submit Failure',
  props<{ error: Error }>()
)

import { createActionGroup, props } from '@ngrx/store'
import { EnrollmentApplication } from '@models/application'

export const applicationActions = createActionGroup({
  source: 'Application',
  events: {
    Submit: props<{ application: EnrollmentApplication }>(),
    'Submit Success': props<{ application: Required<EnrollmentApplication> }>(),
    'Submit Failure': props<{ error: Error }>()
  }
})

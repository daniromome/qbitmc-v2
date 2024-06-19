import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { EnrollmentApplication, EnrollmentApplicationDocument } from '@qbitmc/common'

export const applicationActions = createActionGroup({
  source: 'Application',
  events: {
    Get: emptyProps(),
    'Get Success': props<{ application: EnrollmentApplicationDocument }>(),
    'Get Failure': props<{ error: Error }>(),
    Submit: props<{ application: EnrollmentApplication }>(),
    'Submit Success': props<{ application: EnrollmentApplicationDocument }>(),
    'Submit Failure': props<{ error: Error }>()
  }
})

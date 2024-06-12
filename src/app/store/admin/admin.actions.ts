import { Server, ServerDocument } from '@qbitmc/common'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const adminActions = createActionGroup({
  source: 'Admin',
  events: {
    'Get Servers': emptyProps(),
    'Get Servers Success': props<{ servers: ServerDocument[] }>(),
    'Get Servers Failure': props<{ error: Error }>(),
    'Upsert Server': props<{ server: Server }>(),
    'Upsert Server Success': props<{ server: ServerDocument }>(),
    'Upsert Server Failure': props<{ error: Error }>()
  }
})

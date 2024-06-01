import { Server } from '@models/server'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const adminActions = createActionGroup({
  source: 'Admin',
  events: {
    'Get Servers': emptyProps(),
    'Get Servers Success': props<{ servers: Server[] }>(),
    'Get Servers Failure': props<{ error: Error }>(),
    'Upsert Server': props<{ server: Server }>(),
    'Upsert Server Success': props<{ server: Server }>(),
    'Upsert Server Failure': props<{ error: Error }>()
  }
})

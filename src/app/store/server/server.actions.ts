import { Server, ServerDocument } from '@qbitmc/common'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const serverActions = createActionGroup({
  source: 'Server',
  events: {
    'Get Servers': emptyProps(),
    'Get Servers Success': props<{ servers: ServerDocument[] }>(),
    'Get Servers Failure': props<{ error: Error }>(),
    'Update Server': props<{ id: string; server: Server }>(),
    'Update Server Success': props<{ server: ServerDocument }>(),
    'Update Server Failure': props<{ error: Error }>(),
    'Sync Database': emptyProps(),
    'Sync Database Success': props<{ servers: ServerDocument[] }>(),
    'Sync Database Failure': props<{ error: Error }>()
  }
})

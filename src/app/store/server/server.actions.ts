import { Server, ServerDocument } from '@qbitmc/common'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { DeleteMediaRequest, UploadMediaRequest } from '@models/media'

export const serverActions = createActionGroup({
  source: 'Server',
  events: {
    'Get Servers': props<{ includeDrafts: boolean }>(),
    'Get Servers Success': props<{ servers: ServerDocument[] }>(),
    'Get Servers Failure': props<{ error: Error }>(),
    'Update Server': props<{ $id: string; server: Partial<Server> }>(),
    'Update Server Success': props<{ server: ServerDocument }>(),
    'Update Server Failure': props<{ error: Error }>(),
    'Sync Database': emptyProps(),
    'Sync Database Success': props<{ servers: ServerDocument[] }>(),
    'Sync Database Failure': props<{ error: Error }>(),
    'Add Media to Server': props<{ request: UploadMediaRequest; server: ServerDocument }>(),
    'Delete Media from Server': props<{ request: DeleteMediaRequest; server: ServerDocument }>()
  }
})

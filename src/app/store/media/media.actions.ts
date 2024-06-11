import { DeleteMediaRequest, GetMediaRequest, Media, UploadMediaConstraints, UploadMediaRequest } from '@models/media'
import { createActionGroup, props } from '@ngrx/store'

export const mediaActions = createActionGroup({
  source: 'Media',
  events: {
    'Get Media': props<{ request: GetMediaRequest }>(),
    'Get Media Success': props<{ request: GetMediaRequest; media: Media[] }>(),
    'Get Media Failure': props<{ request: GetMediaRequest; error: Error }>(),
    // 'Get Media Resources': props<{ keys: string[] }>(),
    // 'Get Media Resources Success': props<{ media: Media[] }>(),
    // 'Get Media Resources Failure': props<{ keys: string[]; error: Error }>(),
    'Upload Media Resources': props<{ request: UploadMediaRequest & UploadMediaConstraints }>(),
    'Upload Media Resources Success': props<{ media: Media[] } & GetMediaRequest>(),
    'Upload Media Resources Failure': props<{ request: UploadMediaRequest & UploadMediaConstraints; error: Error }>(),
    'Delete Media Resource': props<{ request: DeleteMediaRequest }>(),
    'Delete Media Resource Success': props<{ id: string }>(),
    'Delete Media Resource Failure': props<{ id: string; error: Error }>()
  }
})

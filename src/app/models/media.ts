import { Models } from 'appwrite'
import { ObjectValues } from '../utils/object-values'
import { environment } from 'src/environments/environment'

export interface Media extends Models.File {
  url: string
}

export const MEDIA_STATUS = {
  UPLOADING: 'uploading',
  DOWNLOADING: 'downloading',
  DELETING: 'deleting',
  LOADED: ''
} as const

export type MediaStatus = ObjectValues<typeof MEDIA_STATUS>

export const MEDIA_ENTITY = {
  APPLICATIONS: 'applications',
  SERVER: 'server'
} as const

export type MediaEntity = ObjectValues<typeof MEDIA_ENTITY>

export const BUCKET: Record<MediaEntity, string> = {
  applications: environment.APPWRITE_BUCKET_APPLICATION,
  server: ''
} as const

export interface MediaRequest {
  entity: MediaEntity
}
export interface GetMediaRequest extends MediaRequest {
  ids: string[]
}

export interface UploadMediaRequest extends GetMediaRequest {
  files: File[]
  fileIds: string[]
}

export interface DeleteMediaRequest extends MediaRequest {
  id: string
}

export interface UploadMediaConstraints {
  maxUploadSize: number
}

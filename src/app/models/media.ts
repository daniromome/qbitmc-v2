import { Models } from 'appwrite'
import { ObjectValues } from '../utils/object-values'

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

export interface GetMediaRequest {
  entity: MediaEntity
}

export interface UploadMediaRequest extends GetMediaRequest {
  files: File[]
}

export interface DeleteMediaRequest extends GetMediaRequest {
  id: string
}

export interface UploadMediaConstraints {
  maxUploadSize: number
}

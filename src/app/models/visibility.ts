import { ObjectValues } from '../utils/object-values'

export const VISIBILITY = {
  PUBLIC: 'PUBLIC',
  UNLISTED: 'HIDDEN',
  PRIVATE: 'PRIVATE',
  RESTRICTED: 'RESTRICTED'
} as const

export type Visibility = ObjectValues<typeof VISIBILITY>

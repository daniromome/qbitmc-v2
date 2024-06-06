import { ObjectValues } from '@utils'
import { Locale, Models } from 'appwrite'

interface Preferences extends Models.Preferences {
  nickname?: string
  locale?: Locale
  player?: string
}

export const USER_LABEL = {
  QBITOR: 'qbitor',
  MOD: 'mod',
  SUPPORTER: 'supporter',
  ADMIN: 'admin',
  GUEST: 'guest',
  DISABLED: 'disabled'
} as const

export type UserLabel = ObjectValues<typeof USER_LABEL>

export interface User extends Omit<Models.User<Preferences>, 'labels'> {
  labels: UserLabel[]
}

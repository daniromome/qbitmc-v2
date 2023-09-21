import { ObjectValues } from '@utils'

export const ROLE = {
  QBITOR: 'qbitor',
  MOD: 'mod',
  SUPPORTER: 'supporter',
  ADMIN: 'admin',
  GUEST: 'guest'
} as const

export type Role = ObjectValues<typeof ROLE>

import { Roles } from './role'

export interface User {
  id: string
  nickname: string
  minecraft: {
    uuid: string,
    ign: string
  }
  application: {
    createdAt: string,
    approved: boolean | null
  }
  roles: Roles
}
